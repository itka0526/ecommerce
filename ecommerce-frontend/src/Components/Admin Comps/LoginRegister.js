import { useEffect, useState } from "react";
import { ReactComponent as FacebookIcon } from "../../assets/facebook-svgrepo-com.svg";
import { ReactComponent as GithubIcon } from "../../assets/github-svgrepo-com.svg";
import { ReactComponent as GmailIcon } from "../../assets/gmail-svgrepo-com.svg";
import { ReactComponent as EyeIcon } from "../../assets/eye-svgrepo-com.svg";
import Register from "../Register";
import { useNavigate } from "react-router-dom";

export default function LoginRegister({ setAuth, different_style = false }) {
    const [error, setError] = useState("");

    const [state, setState] = useState("login");
    const navigate = useNavigate();

    const fetchUserInfo = async (props) => {
        const options = {
            login: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props[0]),
            },
            register: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props[0]),
            },
        };
        const pending_response = await fetch(`/${state}`, options[`${state}`]);
        const response = await pending_response.json();
        if (response.auth === false) {
            setError(response.message);
        } else if (response.auth === true) {
            navigate(0);
            setAuth(true);
        }
    };

    useEffect(() => {
        setError("");
    }, [state]);

    return (
        <div
            className={
                different_style
                    ? "w-full flex justify-center"
                    : "flex justify-center items-center w-screen h-screen absolute z-30 px-1"
            }
        >
            <div
                className="border-2 border-white shadow-2xl rounded-xl bg-white  flex flex-col w-[420px] min-w-1/3 p-8 gap-y-5 select-none dark:bg-[#191919] dark:border-[1px] dark:border-gray-700
                               dark:shadow-md dark:shadow-gray-900 px-2 "
                style={different_style ? { width: "360px" } : {}}
            >
                <div className="flex flex-col p-4 h-20 ">
                    <div className="flex justify-center cursor-pointer gap-x-3">
                        <h1
                            className={
                                state === "register"
                                    ? "text-2xl font-bold mb-2 dark:text-gray-300 opacity-50"
                                    : "text-3xl font-bold mb-2 dark:text-gray-300 transition-[font-size]"
                            }
                            onClick={() => setState("login")}
                        >
                            Нэвтрэх
                        </h1>
                        <h1
                            className={
                                state === "login"
                                    ? "text-2xl font-bold mb-2 dark:text-gray-300 opacity-50"
                                    : "text-3xl font-bold mb-2 dark:text-gray-300 transition-[font-size] "
                            }
                            onClick={() => {
                                setState("register");
                            }}
                        >
                            Бүртгүүлэх
                        </h1>
                    </div>
                    <div className=" border-t-2 border-black dark:border-gray-300"></div>
                    <div className="flex justify-center">
                        <h1 className=" text-red-500">{error}</h1>
                    </div>
                </div>
                {state === "login" ? (
                    <Login func={fetchUserInfo} />
                ) : state === "register" ? (
                    <Register setError={setError} setState={setState} />
                ) : null}
            </div>
            <div className="fixed bottom-0">
                <div className="flex justify-center mb-4">
                    <a
                        className="px-2 scale-110 hover:scale-125 duration-300 ease-in-out"
                        href="https://www.facebook.com/itgeltultra/"
                        target="_blank"
                    >
                        <FacebookIcon />
                    </a>
                    <a
                        className="px-2 scale-110 hover:scale-125 duration-300 ease-in-out"
                        href="https://github.com/itka0526"
                        target="_blank"
                    >
                        <GithubIcon />
                    </a>
                    <a
                        className="px-2 scale-110 hover:scale-125 duration-300 ease-in-out"
                        href="https://contacts.google.com/person/c8692183175649231489?hl=en"
                        target="_blank"
                    >
                        <GmailIcon />
                    </a>
                </div>
            </div>
        </div>
    );
}

function Login({ func }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [seePassword, setSeePassword] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-y-3 pl-8">
                <div className="w-full h-12  flex">
                    <input
                        autoFocus={1}
                        value={username}
                        className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                        placeholder="Нэвтрэх нэр"
                        onChange={(e) => setUsername(e.target.value)}
                    ></input>
                    <div className=" w-10"></div>
                </div>
                <div className="w-full h-12 flex">
                    <input
                        value={password}
                        className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                        placeholder="Нууц үг"
                        onChange={(e) => setPassword(e.target.value)}
                        type={seePassword === false ? "password" : "text"}
                    ></input>
                    <div className=" w-10 flex justify-center items-center">
                        <div
                            className="w-7 h-6 "
                            onClick={() => setSeePassword((prev) => !prev)}
                        >
                            <EyeIcon />
                        </div>
                    </div>
                </div>
            </div>
            <div className=" flex box-border justify-center h-12 px-3">
                <button
                    className="border-0 w-full rounded-xl  bg-gradient-to-r from-lime-300 to-lime-500 shadow-xl hover:scale-105 duration-300 ease-in-out"
                    onClick={() => {
                        const data = [{ username, password }];
                        func(data);
                    }}
                >
                    НЭВТРЭХ
                </button>
            </div>
        </>
    );
}
