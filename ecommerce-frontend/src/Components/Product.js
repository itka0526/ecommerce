import useModal from "./hooks/useModal";
import Modal from "./Modal";

export default function Product({ product, url }) {
    const { isShowing, toggle } = useModal();
    return (
        <>
            <Modal
                isShowing={isShowing}
                hide={toggle}
                product={product}
                option={"preview"}
                url={url}
            />
            <div
                className="px-4 py-2  box-border select-none "
                onClick={toggle}
            >
                <div
                    className="rounded-md shadow-xl px-4 py-2 flex flex-col justify-center 
                             bg-white dark:bg-[#191919] dark:border-[1px] dark:border-gray-700 
                               dark:shadow-sm dark:shadow-gray-900   "
                >
                    <div className="cursor-pointer dark:brightness-[.95] m-0 p-0 overflow-hidden flex justify-center h-64 w-64">
                        <img
                            className="xl:hover:scale-105 duration-500 ease-in-out object-contain w-full h-full select-none"
                            src={product.main_image.base64}
                            draggable="false"
                        />
                    </div>
                    <div className="flex justify-between px-3 py-2">
                        <span className="h-8">{product.title}</span>
                        <span>{product.reviews}</span>
                    </div>
                    <div className=" px-3 ">
                        <span className="font-bold after:content-['₮']">
                            {`${product.price || "0"} `}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
