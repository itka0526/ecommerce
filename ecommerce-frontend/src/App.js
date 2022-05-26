import { useEffect, useState } from "react";
import { ReactComponent as SearchIcon } from "./assets/searchicon.svg";
import { ReactComponent as SortByIcon } from "./assets/sortby.svg";
import { ReactComponent as DoubleUpIcon } from "./assets/db-up.svg";
import Product from "./Components/Product";

import useSearchDebounce from "../src/Components/hooks/useSearchDebounce";

import { useParams } from "react-router-dom";
import Modal from "./Components/Modal";
import useModal from "./Components/hooks/useModal";

function App({ url: p_url }) {
    const { id: url } = useParams();

    const [logo, setLogo] = useState("");

    const [products, setProducts] = useState([]);
    const [reversed, setReversed] = useState(true);

    const fetchProducts = async () => {
        const pending_logo = await fetch(
            `/graphql?query={
                     getLogo(url: "${p_url || url}"){
                         logo
                        }
                    }`
        );
        const {
            data: {
                getLogo: { logo: f_logo },
            },
        } = await pending_logo.json();
        setLogo(f_logo);

        const pending_response = await fetch(
            `/graphql?query={
                     getProducts(url: "${url}"){
                         id
                         main_image {
                             base64
                         }
                         price
                         title
                         reviews
                        }
                    }`
        );
        const {
            data: { getProducts: list_of_products },
        } = await pending_response.json();
        setProducts(list_of_products || [{ title: "No products available." }]);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div
            id="main"
            className="
                       h-screen w-screen flex flex-col overflow-hidden
                       relative
                       bg-gray-100
                       dark:bg-black
                       dark:text-gray-300
                      "
        >
            <Navbar
                logo={logo}
                url={url}
                reversed={reversed}
                setReversed={setReversed}
                products={products}
            />
            <div
                className="w-screen h-full overflow-y-scroll flex flex-col items-center 
                           md:flex-row md:flex-wrap md:justify-center"
            >
                {reversed === true
                    ? products
                          .slice()
                          .reverse()
                          .map((product) => (
                              <Product
                                  product={product}
                                  key={product.id}
                                  url={url}
                              />
                          ))
                    : products.map((product) => (
                          <Product
                              product={product}
                              key={product.id}
                              url={url}
                          />
                      ))}
            </div>
        </div>
    );
}
function Navbar({ reversed, setReversed, products, url, logo }) {
    const [searchOn, setSearchOn] = useState(false);
    const [searchUserValue, setSearchUserValue] = useSearchDebounce(1000);

    const { isShowing, toggle } = useModal();

    const [found, setFound] = useState([]);

    const [selected, setSelected] = useState({});

    useEffect(() => {
        if (searchUserValue.length >= 3) {
            setSearchOn(true);
            const results = products
                .map((prod) => {
                    if (
                        prod.title.startsWith(`${searchUserValue}`) ||
                        prod.price.startsWith(`${searchUserValue}`)
                    ) {
                        return prod;
                    }
                    return false;
                })
                .filter((x) => x);
            setFound(results);
        }
    }, [searchUserValue, products]);

    return (
        <>
            <Modal
                isShowing={isShowing}
                hide={toggle}
                product={selected}
                option={"preview"}
                url={url}
            />
            <div className="navbar h-24 border-y-[1px] border-[#333] flex p-4 bg-gray-200 dark:bg-inherit">
                <div className="md:flex hidden justify-start items-center flex-grow h-full aspect-square">
                    <img
                        className="object-contain w-full h-full select-none"
                        src={logo}
                        alt={"Loading..."}
                        draggable={"false"}
                    />
                </div>
                <div className="flex justify-center items-center p-1 flex-grow relative">
                    <div className="h-full w-full bg-inherit border-[1px] border-[#333] flex items-center">
                        <input
                            className="h-full w-full bg-inherit  pl-4"
                            placeholder="Хайх"
                            onChange={(e) => setSearchUserValue(e.target.value)}
                        ></input>
                        <div
                            className=" h-7 w-7 flex justify-center mr-4 cursor-pointer"
                            onClick={() => setSearchOn(true)}
                            title={"хайх"}
                        >
                            <SearchIcon className="dark:fill-white" />
                        </div>
                    </div>

                    <div
                        className={
                            !searchOn
                                ? `w-[calc(100%-8px)] bg-inherit overflow-hidden
                         border-[1px] border-[#333] flex flex-col items-center
                         absolute h-0 transition-[height] top-[calc(100%-6px)] bg-white 
                         dark:bg-[#333] rounded-b-lg z-[9] duration-300 shadow-md `
                                : `w-[calc(100%-8px)] bg-inherit
                         border-[1px] border-[#333] flex flex-col 
                         absolute h-52  transition-[height] top-[calc(100%-6px)] bg-white 
                         dark:bg-[#333] rounded-b-lg z-[9] duration-300 shadow-md `
                        }
                    >
                        {searchOn ? (
                            <>
                                <div className="h-12">
                                    <span className="pl-2 underline underline-offset-2">
                                        {found.length === 0
                                            ? "Not found:"
                                            : "Found:"}
                                    </span>
                                </div>
                            </>
                        ) : null}
                        <div className="h-4/5 overflow-y-scroll">
                            {found.map((match, idx) => {
                                return (
                                    <div
                                        key={`${idx}-match`}
                                        className="h-12 flex pl-8 gap-x-2 justify-between pr-2 items-center mx-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-[background] duration-500 cursor-pointer"
                                        onClick={() => {
                                            setSelected(match);
                                            toggle();
                                        }}
                                    >
                                        <span className="text-base ">
                                            {match.title}
                                        </span>
                                        <span className=" after:content-['₮'] text-sm ">
                                            {match.price + " "}
                                        </span>
                                        <span className=" ">
                                            {match.reviews || 0}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-8 w-full cursor-pointer flex justify-center">
                            <div
                                className="h-full w-8 flex  "
                                onClick={() => {
                                    setSearchOn(false);
                                    setFound([]);
                                    setSelected({});
                                }}
                                title={"нуух"}
                            >
                                <DoubleUpIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:flex hidden justify-end items-center p-2 m-0 flex-grow relative">
                    <span
                        className="absolute m-auto  text-sm inset-0 h-10 py-2  hover:flex justify-start pl-8  whitespace-nowrap opacity-0 hover:opacity-100 transition-[opacity] duration-300 select-none "
                        aria-disabled
                        onClick={() => {
                            setReversed(!reversed);
                        }}
                    >
                        {reversed ? "Шинэ:" : "Хуучин:"}
                    </span>
                    <div
                        className="w-8 h-8 cursor-pointer "
                        title="Огноогоор"
                        onClick={() => {
                            setReversed(!reversed);
                        }}
                    >
                        <SortByIcon className="dark:fill-white" />
                    </div>
                </div>
            </div>
        </>
    );
}
export default App;
