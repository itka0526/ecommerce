import { memo } from "react";

import { ReactComponent as LeftIcon } from "../../assets/left-svgrepo-com.svg";
import { ReactComponent as RightIcon } from "../../assets/right-svgrepo-com.svg";

const SliderController = ({ setPreviousImage, setNextImage }) => (
    <div className="flex w-sreen h-fit justify-between absolute m-auto inset-0 z-10 select-nonitems-center ">
        <div
            className=" cursor-pointer flex justify-center"
            aria-label="Previous Image"
            onClick={setPreviousImage}
        >
            <LeftIcon className=" hover:brightness-110" />
        </div>
        <div
            className=" cursor-pointer"
            aria-label="Next Image"
            onClick={setNextImage}
        >
            <RightIcon className=" hover:brightness-110" />
        </div>
    </div>
);

export default memo(SliderController);
