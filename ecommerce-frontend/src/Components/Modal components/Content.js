import { useState, useEffect, useCallback } from "react";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import SliderController from "./SliderController";
import SpinnerPlaceholder from "../SpinnerPlaceholder";

export default function Content({ product, url }) {
    const [seller, setSeller] = useState({});
    const [description, setDescription] = useState("");

    const [isMounted, setIsMounted] = useState(false);

    const [images, setImages] = useState([]);
    const [options, setOptions] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const [ref, slider] = useKeenSlider(options);

    const setPreviousImage = useCallback(() => slider.current.prev(), [slider]);
    const setNextImage = useCallback(() => slider.current.next(), [slider]);

    useEffect(() => {
        (async () => {
            const pending_response = await fetch(
                `/graphql?query={
                     getProduct(url: "${url}", product_id: "${product.id}") {
                          other_images {
                              base64
                          }
                          description
                          seller {
                            user_id
                            username
                            phone_number
                            facebook
                            email
                          }
                        }
                    }
                    `
            );
            const {
                data: {
                    getProduct: {
                        description,
                        other_images,
                        seller: info_seller,
                    },
                },
            } = await pending_response.json();
            setImages([product.main_image, ...other_images] || []);
            setOptions({
                loop: true,
                slides: { perView: 1 },
                slideChanged(s) {
                    const slideNumber = s.track.details.rel;
                    setCurrentSlide(slideNumber);
                },
            });
            setIsMounted(true);

            setSeller(info_seller || { username: "Anonymous" });
            setDescription(description);
        })();
    }, []);

    const selectedImage = (image_index) => {
        if (slider.current === undefined) return;
        slider.current.moveToIdx(image_index);
    };
    return (
        <div className="h-full pt-[45px] w-full ">
            <div className="overflow-y-scroll h-full w-full">
                <div className="w-full h-3/4 flex  px-2">
                    {isMounted ? (
                        <div
                            className="w-3/4 max-md:w-full h-full relative keen-slider"
                            ref={ref}
                        >
                            {
                                <SliderController
                                    setPreviousImage={setPreviousImage}
                                    setNextImage={setNextImage}
                                />
                            }
                            {images.map(({ base64: image }, ind) => {
                                return (
                                    <div
                                        className=" keen-slider__slide"
                                        key={`key_image_${ind}`}
                                    >
                                        <img
                                            alt="Error something went wrong :\"
                                            draggable="false"
                                            src={image}
                                            className="object-contain w-full h-full select-none"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <SpinnerPlaceholder />
                    )}
                    <div className="flex flex-col justify-center px-4 w-1/4 max-md:hidden gap-y-1">
                        <div className="h-12 border-[1px] border-[#333] flex justify-center items-center">
                            <span className="after:content-['₮']">
                                {`${product.price || "0"} `}
                            </span>
                        </div>
                        <div className="h-12 border-[1px] border-[#333] flex justify-center items-center">
                            <span className="before:content-['+976']">
                                {seller.phone_number
                                    ? ` ${seller.phone_number}`
                                    : " 99999999"}
                            </span>
                        </div>
                        <div className="h-12 border-[1px] border-[#333] flex justify-center items-center">
                            <a
                                href={"https://facebook.com/" + seller.facebook}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>
                {/**MAX 5 PHOTOS: 1 MAIN, 4 SUBMAIN */}
                <div className="w-full h-1/4 flex max-md:overflow-x-scroll p-2">
                    {images.map(({ base64: image }, index) => (
                        <div
                            key={`image-${index}`}
                            className={
                                index === currentSlide
                                    ? "h-full aspect-square flex md:mx-1 pb-[2px] border-[1px] border-[#333] bg-white scale-105"
                                    : "h-full aspect-square flex md:mx-1 pb-[2px] border-[1px] border-[#333]"
                            }
                        >
                            <img
                                alt="Error something went wrong :\"
                                draggable="false"
                                src={image}
                                onClick={() => selectedImage(index)}
                                className="object-contain w-full h-full select-none"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col  justify-center px-12 py-4 w-full md:hidden gap-y-1 ">
                    <div className="h-12 border-[1px] border-[#333] flex justify-center items-center">
                        <span className="after:content-['₮']">
                            {`${product.price || "0"} `}
                        </span>
                    </div>
                    <div className="h-12 border-[1px] border-[#333] flex justify-center items-center">
                        <span className="before:content-['+976']">
                            {seller.phone_number
                                ? ` ${seller.phone_number}`
                                : " 99999999"}
                        </span>
                    </div>
                    <div className="h-12 border-[1px] border-[#333] flex justify-center items-center">
                        <a
                            href={"https://facebook.com/" + seller.facebook}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span>Facebook</span>
                        </a>
                    </div>
                </div>
                <div className="p-4">
                    <p>{seller.username}</p>
                    <p className="p-4 whitespace-pre-wrap">{description}</p>
                </div>
            </div>
        </div>
    );
}
