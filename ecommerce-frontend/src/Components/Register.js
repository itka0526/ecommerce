import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setError, setState }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewpassword] = useState("");
    const [newPassword2, setNewpassword2] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [url, setUrl] = useState("");

    const [phase, setPhase] = useState(0);

    const [failed, setFailed] = useState(false);

    const navigate = useNavigate();

    const firstPage = () => {
        if (username.length < 4) {
            setError("Нэр дэндүү богино байна");
            return;
        }
        if (newPassword !== newPassword2) {
            setError("Нууц үг таарахгүй байна");
            return;
        }
        if (/@/g.test(email) === false) {
            setError("Зөв e-mail хаяг оруулна уу");
            return;
        }
        setError("");
        setPhase(1);
    };
    const sendForm = async (e) => {
        e.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                phone_number: phoneNumber,
                password: newPassword,
                url,
            }),
        };
        const pending_response = await fetch("/register", options);
        const response = await pending_response.json();
        if (response.status === "failed") {
            setFailed(true);
            setError(response.message);
        } else if (response.status === "success") {
            navigate("/admin/" + url);
        }
    };

    const l = window.location.href;
    useEffect(() => {
        return () => setUrl("");
    }, []);
    if (phase === 0)
        return (
            <>
                <div className="flex flex-col gap-y-3 pl-8">
                    <div className="w-full h-12  flex">
                        <input
                            value={username}
                            className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                            placeholder="Нэвтрэх нэр"
                            onChange={(e) => setUsername(e.target.value)}
                        ></input>
                        <div className=" w-10"></div>
                    </div>
                    <div className="w-full h-12  flex">
                        <input
                            value={email}
                            className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                            placeholder="Е-mail хаяг"
                            type={"email"}
                            onChange={(e) => setEmail(e.target.value)}
                        ></input>
                        <div className=" w-10"></div>
                    </div>
                    <div className="w-full h-12  flex">
                        <input
                            value={phoneNumber}
                            className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                            placeholder="Утас"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        ></input>
                        <div className="w-10"></div>
                    </div>
                    <div className="w-full h-12  flex">
                        <input
                            value={newPassword}
                            className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                            placeholder="Нууц үг"
                            onChange={(e) => setNewpassword(e.target.value)}
                        ></input>
                        <div className=" w-10"></div>
                    </div>
                    <div className="w-full h-12  flex">
                        <input
                            value={newPassword2}
                            className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                            placeholder="Нууц үгээ дахин хийнэ үү"
                            onChange={(e) => setNewpassword2(e.target.value)}
                        ></input>
                        <div className=" w-10"></div>
                    </div>
                </div>
                <div className=" flex box-border justify-center h-12 px-3">
                    <button
                        className="border-0 w-full rounded-xl  bg-gradient-to-r from-lime-300 to-lime-500 shadow-xl hover:scale-105 duration-300 ease-in-out"
                        onClick={firstPage}
                    >
                        БҮРТҮҮЛЭХ
                    </button>
                </div>
            </>
        );
    else if (phase === 1)
        return (
            <div className="flex flex-col px-4 gap-y-2">
                <div className=" flex overflow-x-scroll">
                    <span className="text-base text-ellipsis dark:text-white">{`${l}${url}`}</span>
                    <div className=" animate-blinking border-black border-[0.5px]"></div>
                </div>
                <span className="text-sm text-red-500">
                    Энэ таны дэлгүүр лүүгээ нэвтрэх хаягийн нэр байх болно.
                    (өөрчлөх боломжгүй)
                </span>
                <form
                    className="w-full  flex flex-col gap-y-2"
                    onSubmit={sendForm}
                >
                    <input
                        value={url}
                        className={
                            failed
                                ? "border w-full rounded-sm pl-2 border-red-400"
                                : "border w-full rounded-sm pl-2 border-[#333]"
                        }
                        onChange={(e) => {
                            const filteredWhiteSpace =
                                e.target.value.replaceAll(" ", "");
                            setUrl(filteredWhiteSpace);
                        }}
                    ></input>
                    <button
                        onClick={sendForm}
                        className=" mx-2 rounded-md bg-gradient-to-r from-red-400 to-red-400"
                    >
                        За
                    </button>
                </form>
            </div>
        );
}
