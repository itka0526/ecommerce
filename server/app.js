const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { Pool } = require("pg");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const CustomFunction = require("./functions/convertor");

const PORT = process.env.PORT || 4000;

const pgPool = new Pool(
    process.env.PRODUCTION
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: {
                  rejectUnauthorized: false,
              },
          }
        : {
              user: "itgelt",
              database: "store",
              password: "",
              host: "localhost",
              port: 5432,
          }
);
const expresession = require("express-session");
const pgSession = require("connect-pg-simple")(expresession);
const sessionMiddleWare = expresession({
    secret: "ecommerce",
    resave: false,
    saveUninitialized: false,
    //httpOnly: false,
    cookie: {
        maxAge: 43200000,
    },
    store: new pgSession({
        pool: pgPool,
        tableName: "session",
    }),
});

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

type Query {
  getProducts(url: String!): [Product]!
  getProduct(url: String!, product_id: String!): Product!
  getLogo(url: String!): Logo!
}

type Logo {
    logo: String
}

type Seller {
    user_id: Int
    username: String
    phone_number: String
    facebook: String
    email: String
}

type Image {
    name: String
    size: String
    type: String
    base64: String
    file: File
}
type File {
    i: String
}
type Product {
    id: String
    main_image: Image
    other_images: [Image]
    price: String
    title: String
    reviews: String
    description: String
    seller: Seller
}
`);

var root = {
    getLogo: async ({ url }) => {
        try {
            const {
                rows: [logo],
            } = await pgPool.query(
                `
                    SELECT logo
                    FROM users
                    WHERE url=$1;
                    `,
                [url]
            );
            return logo;
        } catch (error) {
            console.log("db_error: ", error);
        }
    },
    //USE ORMS FOR FASTER DB QUERIES
    getProduct: async ({ url, product_id }) => {
        try {
            const {
                rows: [{ list_of_products, ...seller }],
            } = await pgPool.query(
                `
                    SELECT user_id, username, phone_number,facebook, email, list_of_products FROM users
                    WHERE url=$1;
                    `,
                [url]
            );
            const product = list_of_products.find(
                ({ id }) => id === product_id
            );
            const { main_image, other_images, ...rest } = product;

            return {
                ...rest,
                main_image,
                other_images,
                seller,
            };
        } catch (error) {
            console.log("db_error: ", error);
        }
    },
    getProducts: async ({ url }) => {
        try {
            const {
                rows: [{ list_of_products: list }],
            } = await pgPool.query(
                `
                    SELECT list_of_products FROM users
                    WHERE url=$1;
                    `,
                [url]
            );
            return list;
        } catch (error) {
            console.log("db_error: ", error);
        }
    },
};

const app = express();
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: process.env.PRODUCTION || true,
    })
);

app.use(express.json({ limit: "20mb" }));
t;
app.use(sessionMiddleWare);

app.use(express.static("build"));

app.get("/stores", async (_, res) => {
    try {
        const { rows: result } = await pgPool.query(
            `
        SELECT url 
        FROM users;
        `
        );
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(503);
    }
});

app.post("/delete", (req, res) => {
    const { username, password } = req.session.user;
    if (!username || !password) {
        res.json({ auth: false });
        return;
    }
    pgPool.query(
        `
                select url, list_of_products
                from users
                where email=$1 and password=$2;
        `,
        [username, password],
        (error, result) => {
            //block code executing further if error is true
            if (error) {
                res.json({ status: "failed" });
                return;
            }
            if (result) {
                const { id: delete_item_id } = req.body;
                const {
                    rows: [{ list_of_products, url }],
                } = result;
                var index_of_the_delete_item = list_of_products
                    .map(({ id: db_id }, index) =>
                        db_id === delete_item_id ? index : false
                    )
                    .filter((x) => x !== false)[0];
                console.log(
                    delete_item_id,
                    "idx: ",
                    index_of_the_delete_item,
                    url
                );

                pgPool.query(
                    `
                    update users
                    set list_of_products=(
                       list_of_products - $1::int
                    )
                    where url=$2 and email=$3 and password=$4
                	;
                   `,
                    [index_of_the_delete_item, url, username, password],
                    (e, r) => {
                        if (e) {
                            res.status(503);
                            console.log(e);
                            return;
                        }
                        if (r) {
                            res.json({
                                status: "success",
                                removed: delete_item_id,
                            });
                        }
                    }
                );
            }
        }
    );
});
app.post("/register", (req, res) => {
    const userSession = req.session.user;
    if (userSession) {
        console.log("authenticated");
        res.json({ auth: true });
        return;
    }
    if (!userSession) {
        const { username, email, phone_number, password, url } = req.body;
        pgPool.query(
            `
            SELECT email, url
            FROM users
            `,
            (err, result) => {
                if (err) {
                    res.status(503);
                } else if (result) {
                    const userAlreadyExist = result.rows.some(
                        ({ email: db_email }) => db_email === email
                    );
                    if (userAlreadyExist === true) {
                        res.json({
                            status: "failed",
                            message: "User already exist",
                        });
                        return;
                    }
                    const theUrlAlreadyExist = result.rows.some(
                        ({ url: db_url }) => db_url === url
                    );
                    if (theUrlAlreadyExist === true) {
                        res.json({
                            status: "failed",
                            message: "URL already exist.",
                        });
                        return;
                    }
                    if (
                        userAlreadyExist === false &&
                        theUrlAlreadyExist === false
                    )
                        pgPool.query(
                            `
                       insert into users (url, username, phone_number, email, password) 
                       values ($1, $2, $3, $4, $5)
                       `,
                            [url, username, phone_number, email, password],
                            (error2, result2) => {
                                if (error2) {
                                    res.status(500);
                                    return;
                                } else if (result2) {
                                    res.json({ status: "success" });
                                }
                            }
                        );
                }
            }
        );
    }
});
app.route("/login")
    .get(async (req, res) => {
        const userSession = req.session.user;
        if (userSession === undefined) {
            res.json({ auth: false });
        } else if (userSession) {
            pgPool.query(
                `
                select url 
                from users 
                where email=$1
                and password=$2;
                `,
                [userSession.username, userSession.password],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ auth: false });
                        return;
                    } else if (result) {
                        res.json({ auth: true, url: result.rows[0].url });
                    }
                }
            );
        }
    })
    .post(async (req, res) => {
        const loginInfo = req.body;
        try {
            if (loginInfo) {
                const { username: unsafeUsername, password: unsafePassword } =
                    loginInfo;
                const {
                    rows: [results],
                } = await pgPool.query(
                    `
                      SELECT email AS db_username, password AS db_password FROM users 
                      WHERE 
                      (username=$1 and password=$2) 
                      OR 
                      (email=$1 and password=$2);
                    `,
                    [unsafeUsername, unsafePassword]
                );
                if (results === undefined) {
                    res.json({
                        auth: false,
                        message: "Username and password don't match",
                    });
                } else if (results.db_username && results.db_password) {
                    req.session.user = {
                        username: results.db_username,
                        password: results.db_password,
                    };
                    res.json({ auth: true });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500);
        }
    });
app.get("/signout", (req, _) => {
    req.session.destroy();
});

app.route("/me")
    .get((req, res) => {
        const { username, password } = req.session.user;
        if (!username || !password) {
            res.json({ auth: false });
            return;
        }
        pgPool.query(
            `
        SELECT username, phone_number, facebook
        FROM users
        WHERE email=$1 and password=$2;
        `,
            [username, password],
            (err, result) => {
                if (err) {
                    res.status(503);
                    return;
                } else if (result) {
                    const {
                        rows: [o],
                    } = result;
                    res.json(o);
                }
            }
        );
    })
    .post((req, res) => {
        const { username, password } = req.session.user;
        if (!username || !password) {
            res.json({ auth: false });
            return;
        }

        let sqlStatements = [
            `
            UPDATE users
                SET username=$1,
                 phone_number=$2,
                 facebook=$3
            WHERE email=$4 AND password=$5;
        `,
            `
            UPDATE users
                SET username=$1,
                 phone_number=$2,
                 facebook=$3,
                 logo=$4
            WHERE email=$5 AND password=$6;
        `,
        ];
        const {
            username: f_username,
            phone_number: f_phone_number,
            facebook: f_facebook,
            logo: f_logo,
        } = req.body;

        pgPool.query(
            f_logo === false ? sqlStatements[0] : sqlStatements[1],
            f_logo === false
                ? [f_username, f_phone_number, f_facebook, username, password]
                : [
                      f_username,
                      f_phone_number,
                      f_facebook,
                      f_logo,
                      username,
                      password,
                  ],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(503);
                    return;
                } else if (result) {
                    res.json({ status: "success" });
                }
            }
        );
    });

app.post("/upload", (req, res) => {
    const userSession = req.session.user;

    if (userSession === undefined) {
        res.json({ auth: false });
        return;
    }
    if (userSession.username && userSession.password) {
        const upload_data = req.body;
        const generateID = uuidv4();

        upload_data.id = generateID;

        pgPool.query(
            `
            UPDATE users
            SET list_of_products=(list_of_products || $3::jsonb)
            WHERE email=$1
            AND password=$2;
            `,
            [userSession.username, userSession.password, upload_data],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    return;
                } else if (result) {
                    res.json({ status: "success" });
                }
            }
        );
    }
});

app.post("/convert_heic_base64_to_png_base64", async (req, res) => {
    try {
        const incoming_data = req.body;
        const final_result = await CustomFunction(incoming_data);
        res.json(final_result);
    } catch (er) {
        console.log(er);
        res.status(500).send("Error: Something went wrong :/");
    }
});

app.get("/*", (req, res) =>
    res.sendFile(path.join(__dirname, "build/index.html"))
);

app.listen(PORT, () => {
    console.log(
        "Running a GraphQL API server at http://localhost:4000/graphql",
        uuidv4()
    );
});
