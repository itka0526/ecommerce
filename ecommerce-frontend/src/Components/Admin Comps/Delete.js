import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Xicon } from "../../assets/exit-x.svg";

export default function Delete() {
    const [list, setList] = useState([]);

    const { id: url } = useParams();
    useEffect(() => {
        (async () => {
            const pending_response = await fetch(
                `/graphql?query={
                     getProducts(url: "${url}"){
                         id
                         main_image {
                             name
                             size
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
            setList(list_of_products || [{ title: "No products available." }]);
        })();
    }, []);

    const remover = async (id) => {
        console.log(id);
        const pending_response = await fetch("/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        });
        const response = await pending_response.json();
        console.log(response);
        if (response.status === "success") {
            setList((prev) => prev.filter((el) => el.id !== response.removed));
        }
    };

    return (
        <div className="flex flex-col pt-[45px] px-4 overflow-x-scroll">
            <ul>
                {list.map(({ id, main_image, price, title, reviews }, idx) => {
                    return (
                        <li
                            key={id}
                            className="border h-12 rounded-md hover:bg-gray-300 border-[#333]
                               dark:hover:bg-gray-700 dark:text-gray-300 flex overflow-x-hidden"
                        >
                            <div className="w-[calc(100%-2.5rem)] flex gap-x-10 pl-4  items-center">
                                <span>{`${idx + 1}). `}</span>
                                <span className=" whitespace-nowrap">
                                    {title}
                                </span>
                                <span className="whitespace-nowrap">
                                    {price}
                                </span>
                                <span className="whitespace-nowrap">
                                    {reviews || 0}
                                </span>
                                <span className="whitespace-nowrap">
                                    main_image: {main_image.name}
                                </span>
                                <span className="whitespace-nowrap">
                                    {main_image.size}
                                </span>
                            </div>
                            <div
                                className="w-10 border-l border-[#333]  
                                    bg-white
                                    dark:bg-[#191919]"
                            >
                                <div
                                    onClick={() => {
                                        remover(id);
                                    }}
                                    className="     
                  
                                cursor-pointer
                                p-2
                                h-fit w-fit"
                                >
                                    <Xicon className="fill-black dark:fill-white " />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <span className="text-red-400 text-sm before:content-['*']">
                Гол зураг нь хэр том байна төдий чинээ вэбсайт чинь удаан
                уншина.
            </span>
        </div>
    );
}
