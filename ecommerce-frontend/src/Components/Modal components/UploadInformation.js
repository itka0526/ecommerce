import { useState } from "react";
import FileBase64 from "react-file-base64";

import { ReactComponent as CameraIcon } from "../../assets/camera.svg";
import { ReactComponent as AddPhotoIcon } from "../../assets/add.svg";
import { ReactComponent as Xicon } from "../../assets/exit-x.svg";
import SpinnerPlaceholder from "../SpinnerPlaceholder";

import { useNavigate } from "react-router-dom";

export default function UploadInformation({ setAuth, setUpdateContent, hide }) {
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    const uploadProduct = async () => {
        if (files.length === 0 || thumbnail.length === 0) {
            setError("Please upload images");
            return;
        }
        setLoading(true);

        const pending_response = await fetch("/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                price,
                description,
                main_image: thumbnail[0],
                other_images: files,
            }),
        });

        const response = await pending_response.json();

        if (response.auth === false) {
            setAuth(false);
            return;
        } else if (response.status === "success") {
            setLoading(false);
            setFiles([]);
            setThumbnail([]);
            hide();

            navigate(0);
        }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-y-scroll relative">
            <AddText title={"Гарчиг: "} text={title} setText={setTitle} />
            <ThumbnailPhoto
                error={error}
                setError={setError}
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
            />
            <AddMorePhotos
                setError={setError}
                files={files}
                setFiles={setFiles}
            />
            <AddText
                title={"Үнэ: "}
                text={price}
                setText={setPrice}
                number={true}
            />
            <AddDescription
                title={"Тайлбар: "}
                text={description}
                setText={setDescription}
            />
            <div className=" flex justify-center h-12 relative my-1">
                <button
                    className="dark:text-white border-0 w-1/3 h-10 rounded-md  bg-gradient-to-r from-lime-300 to-lime-500 shadow-xl "
                    onClick={() => uploadProduct()}
                >
                    НЭМЭХ
                </button>
                {loading && (
                    <div className=" absolute m-auto inset-0 top-28 flex justify-center">
                        <SpinnerPlaceholder />
                    </div>
                )}
            </div>
        </div>
    );
}

function CancelButton({ image_index, thumbnail = false, func, array }) {
    return (
        <div
            className=" m-auto absolute inset-0  text-sm
                                                bottom-[calc(100%-25px)]
                                                max-md:bottom-[calc(100%-35px)]
                                                left-[calc(100%-30px)]
                                                cursor-pointer
                                                p-2
                                                h-fit w-fit z-20"
            onClick={() => {
                if (thumbnail === true) {
                    func([]);
                    return;
                }
                const rem_arr = array.filter(
                    (_, index) => index !== image_index
                );
                func(rem_arr);
                return;
            }}
        >
            <Xicon
                className="fill-black dark:fill-white "
                width={20}
                height={20}
            />
        </div>
    );
}
function AddText({ title, text, setText, number = false }) {
    return (
        <div className="flex py-2">
            <div className="flex w-1/3 justify-end pr-4">
                <span className=" text-base after:content-['*'] after:text-red-400 ">
                    {title}
                </span>
            </div>

            <div className="w-2/3">
                <input
                    className="border-[1px] rounded-sm pl-2 w-2/3 py-1 dark:bg-black dark:border-[#333] remove-default-styling"
                    value={text}
                    type={number ? "number" : "text"}
                    onChange={(e) => setText(e.target.value)}
                ></input>
            </div>
        </div>
    );
}

function AddDescription({ title, text, setText }) {
    return (
        <div className="flex py-2 ">
            <div className="flex pr-4 w-1/3 justify-end">
                <span className=" text-base after:content-['*'] after:text-red-400 whitespace-nowrap">
                    {title}
                </span>
            </div>

            <div className="w-2/3 ">
                <textarea
                    className="border-[1px] rounded-md pl-2 w-2/3 pt-1 dark:bg-black dark:border-[#333]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
            </div>
        </div>
    );
}

function ThumbnailPhoto({ error, setError, thumbnail, setThumbnail }) {
    const [loading, setLoading] = useState(false);
    async function checkIfSupported(file) {
        if (/image\//.test(file.type) === true) {
            if (file.type === "image/heic") {
                setLoading(true);
                const pending_response = await fetch(
                    "/convert_heic_base64_to_png_base64",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify([file]),
                    }
                );
                const response = await pending_response.json();
                if (response) {
                    setLoading(false);
                }
                setThumbnail((prev) => [...prev, response[0]]);
                return;
            }
            setThumbnail((prev) => [...prev, file]);
            return;
        } else {
            setError("Not supported");
        }
    }
    return (
        <div className="flex py-2">
            <div className="flex pr-4 w-1/3 items-end flex-col">
                <span className="text-base after:content-['*'] after:text-red-400">
                    Гол зураг:{" "}
                </span>
                <span className="text-red-500 text-[11px]">{error}</span>
            </div>
            {thumbnail.length === 0 ? (
                <div className="flex w-2/3 pr-1">
                    <div className="upload-images-input-container relative border-[1px] border-[#333] rounded-xl p-1">
                        <div
                            className="absolute pointer-events-none bg-gray-200 dark:bg-[#333] m-auto inset-0 rounded-[12px] flex flex-col justify-center items-center"
                            aria-disabled
                        >
                            <CameraIcon height={80} width={80} />
                        </div>
                        <FileBase64
                            onDone={(f) => checkIfSupported(f)}
                        ></FileBase64>
                    </div>
                </div>
            ) : (
                <div className="w-2/3 flex">
                    {loading ? (
                        <div className="h-36 w-44  aspect-square flex md:mx-1 pb-[2px] border-[1px] border-[#333] rounded-lg relative">
                            <SpinnerPlaceholder />
                        </div>
                    ) : (
                        <div className="h-36 w-44  aspect-square flex md:mx-1 pb-[2px] border-[1px] border-[#333] rounded-lg relative">
                            <CancelButton
                                thumbnail={true}
                                func={setThumbnail}
                            />
                            <img
                                alt="this will be converted to .jpeg"
                                draggable="false"
                                src={thumbnail[0].base64}
                                className="object-contain w-full h-full select-none"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function AddMorePhotos({ files, setFiles, setError }) {
    const [loading, setLoading] = useState(false);
    async function checkIfSupported(file) {
        if (/image\//.test(file.type) === true) {
            if (file.type === "image/heic") {
                setLoading(true);
                const pending_response = await fetch(
                    "/convert_heic_base64_to_png_base64",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify([file]),
                    }
                );
                const response = await pending_response.json();
                if (response) {
                    setLoading(false);
                }
                setFiles((prev) => [...prev, response[0]]);
                return;
            }
            setFiles((prev) => [...prev, file]);
            return;
        } else {
            setError("Not supported");
        }
    }

    return (
        <div className="flex py-2 ">
            <div className="flex pr-4 w-1/3 items-end flex-col ">
                <span className=" text-base after:content-['*'] after:text-red-400">
                    Өөр зураг оруулах:{" "}
                </span>
                <span className="text-[11px] before:content-['*'] ">
                    {" "}
                    4-өөс бага зураг оруулна уу
                </span>
            </div>
            <div className="w-2/3 h-32 flex overflow-x-scroll">
                {loading === true && (
                    <div className="h-28 w-28 aspect-square flex md:mx-1 pb-[2px] border-[1px] border-[#333] rounded-lg relative overflow-hidden">
                        <SpinnerPlaceholder />
                    </div>
                )}

                {files.map(({ base64: image }, index) => (
                    <div
                        key={`image-${index}`}
                        className="h-28 aspect-square flex md:mx-1 pb-[2px] border-[1px] border-[#333] rounded-lg relative "
                    >
                        <CancelButton
                            image_index={index}
                            func={setFiles}
                            array={files}
                        />
                        <img
                            alt="this will be converted to .jpeg"
                            draggable="false"
                            src={image}
                            className="object-contain w-full h-full select-none"
                        />
                    </div>
                ))}
                {files.length < 4 && (
                    <div className="upload-images-input-container relative border-[1px] border-[#333] rounded-xl p-1 h-28 w-28">
                        <div
                            className="absolute pointer-events-none bg-gray-200 dark:bg-[#333] m-auto inset-0 rounded-[12px] flex flex-col justify-center items-center"
                            aria-disabled
                        >
                            <AddPhotoIcon height={80} width={80} />
                        </div>
                        <FileBase64
                            onDone={(f) => checkIfSupported(f)}
                        ></FileBase64>
                    </div>
                )}
            </div>
        </div>
    );
}
