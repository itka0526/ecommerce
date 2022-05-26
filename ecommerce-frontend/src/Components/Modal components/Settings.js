import { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";
import { useNavigate } from "react-router-dom";
import SpinnerPlaceholder from "../SpinnerPlaceholder";

export default function Settings() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        fetchConfig();
    }, []);

    const [{ username, phone_number, facebook }, setUserData] = useState({
        username: "",
        phone_number: "",
        facebook: "",
    });

    async function fetchConfig() {
        const pending_response = await fetch("/me");
        const response = await pending_response.json();
        setUserData(response);
    }

    const [updateUsername, setUpdateUsername] = useState("");
    const [updatePhone, setUpdatePhone] = useState("");
    const [updateFacebook, setUpdateFacebook] = useState("");
    const [loading, setLoading] = useState(false);

    const [logo, setLogo] = useState("");

    const updateData = async (e) => {
        e.preventDefault();
        setLoading(true);

        const pending_request = await fetch("/me", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username:
                    updateUsername !== "" && updateUsername.length >= 4
                        ? updateUsername
                        : username,
                phone_number:
                    updatePhone !== "" && updatePhone.length === 8
                        ? updatePhone
                        : phone_number,
                facebook: updateFacebook !== "" ? updateFacebook : facebook,
                logo: logo !== "" ? logo : false,
            }),
        });
        const response = await pending_request.json();

        if (response.status === "success") {
            setTimeout(() => navigate(0), 500);
        }
    };
    return (
        <form
            className="flex flex-col h-full w-full pt-[45px] gap-y-4 select-none"
            onSubmit={updateData}
        >
            <div
                className={
                    error === ""
                        ? "  py-2  flex opacity-0"
                        : "flex py-2 opacity-90 "
                }
            >
                <div className="flex w-1/3 justify-end pr-4 ">
                    <span className=" text-base text-red-400 after:content-['*'] after:text-red-400 ">
                        Алдаа:
                    </span>
                </div>

                <div className="w-2/3">
                    <span className="text-red-400">{error}</span>
                </div>
            </div>
            <div className="flex py-2 ">
                <div className="flex w-1/3 justify-end pr-4 ">
                    <span className=" text-base after:content-['*'] after:text-red-400 ">
                        Нэр:
                    </span>
                </div>

                <div className="w-2/3">
                    <input
                        onChange={(e) => setUpdateUsername(e.target.value)}
                        value={updateUsername}
                        placeholder={username + "   4 үсэгнээс дээш"}
                        className="max-md:placeholder:text-[11px] border-[1px] rounded-sm pl-2 w-2/3 py-1 dark:bg-black dark:border-[#333] remove-default-styling"
                    ></input>
                </div>
            </div>
            <div className="flex py-2">
                <div className="flex w-1/3 justify-end pr-4">
                    <span className=" text-base after:content-['*'] after:text-red-400 ">
                        Утас:
                    </span>
                </div>

                <div className="w-2/3">
                    <input
                        onChange={(e) => setUpdatePhone(e.target.value)}
                        value={updatePhone}
                        placeholder={phone_number + "  8-оронтой"}
                        className="max-md:placeholder:text-sm border-[1px] rounded-sm pl-2 w-2/3 py-1 dark:bg-black dark:border-[#333] remove-default-styling"
                    ></input>
                </div>
            </div>
            <div className="flex py-2">
                <div className="flex w-1/3 flex-col items-end pr-4">
                    <span className=" text-base after:content-['*'] after:text-red-400 ">
                        Facebook:
                    </span>
                    <span className=" text-[9px] text-red-400 ">
                        @username гэж оруулна уу.
                    </span>
                    <span className=" text-[9px] text-red-400 ">
                        Жишээ нь зөвхөн: @itgeltultra
                    </span>
                </div>

                <div className="w-2/3">
                    <input
                        onChange={(e) => setUpdateFacebook(e.target.value)}
                        value={updateFacebook}
                        placeholder={`https://facebook.com/${facebook}`}
                        className="max-md:placeholder:text-[11px] border-[1px] rounded-sm pl-2 w-2/3 py-1 dark:bg-black dark:border-[#333] remove-default-styling"
                    ></input>
                </div>
            </div>
            <div className="flex py-2">
                <div className="flex w-1/3 items-end pr-4 flex-col">
                    <span className=" text-base after:content-['*'] after:text-red-400 ">
                        Лого:
                    </span>
                    <span className=" text-[9px] text-red-400 after:content-['*'] after:text-red-400 ">
                        5mb бага зураг оруулна уу
                    </span>
                    <span className=" text-[9px] text-red-400 ">
                        (*.svg, *.png, *.jpeg, *.jpg){" "}
                    </span>
                </div>

                <div className="w-2/3">
                    <FileBase64
                        onDone={(f) => {
                            if (parseInt(f.size) > 7000) {
                                setError(`Файл том байна. ${f.size}`);
                                setLogo("");
                                return;
                            } else {
                                setError("");
                                return setLogo(f.base64);
                            }
                        }}
                    ></FileBase64>
                </div>
            </div>

            <div className=" flex justify-center h-12 relative my-1">
                <button
                    className="dark:text-white border-0 w-1/3 h-10 rounded-md  bg-gradient-to-r from-lime-300 to-lime-500 shadow-xl "
                    onClick={updateData}
                >
                    Шинэчлэх
                </button>
                {loading && (
                    <div className=" absolute m-auto inset-0 top-28 flex justify-center">
                        <SpinnerPlaceholder />
                    </div>
                )}
            </div>
        </form>
    );
}
