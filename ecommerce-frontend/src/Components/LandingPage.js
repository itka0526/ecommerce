import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import App from "../App";
import LoginRegister from "./Admin Comps/LoginRegister";

export default function LandingPage({ auth, setAuth }) {
    const [showApp, setShowApp] = useState(false);
    const navigate = useNavigate();
    const { id: url } = useParams();

    useEffect(() => {
        (async () => {
            const pending_response = await fetch("/login");
            const response = await pending_response.json();
            if (response.auth === true) {
                navigate(`/admin/${response.url}`);
                setAuth(true);
            } else if (response.auth === false) {
                setAuth(false);
            }
        })();
    }, []);
    if (!auth && showApp === false)
        return (
            <div
                className="flex flex-col-reverse md:flex-row 
                       bg-gray-100
                       dark:bg-black
                       dark:text-gray-300"
            >
                <div className="flex grow h-screen justify-center items-center ">
                    <AllTheStores setShowApp={setShowApp} />
                </div>
                <div className=" flex grow h-screen justify-center px-2 items-center  text-black ">
                    <LoginRegister different_style={true} setAuth={setAuth} />
                </div>
            </div>
        );
    else if (!auth && showApp === true) return <App url={url} />;
    else if (auth) {
        return <div></div>;
    }
}

function AllTheStores({ setShowApp }) {
    const [listURLs, setListURLs] = useState([]);
    useEffect(() => {
        (async () => {
            const p = await fetch("/stores");
            let t = await p.json();
            setListURLs(t);
        })();
    }, []);
    return (
        <div className="w-full flex flex-col items-center h-1/2 px-4 select-none">
            <div
                className=" bg-white  shadow-2xl rounded-md h-full w-full dark:bg-[#191919] dark:border-[1px] dark:border-gray-700
                               dark:shadow-md dark:shadow-gray-900"
            >
                <div className="h-12 flex flex-col justify-end items-center gap-y-2">
                    <span className="text-base">
                        List of available stores:{" "}
                    </span>
                    <div className="border-b-2 border-black w-5/6"></div>
                </div>

                <ul className=" py-3 overflow-y-scroll gap-y-2 flex flex-col h-[calc(100%-3rem-2px)]">
                    {listURLs.map(({ url }, idx) => {
                        return (
                            <li
                                className=" flex justify-start pl-8 "
                                onClick={() => setShowApp(true)}
                            >
                                {`${idx + 1}). `}
                                <a href={`/${url}`}>
                                    <span className=" underline underline-offset-1">
                                        {url.toUpperCase()}
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
