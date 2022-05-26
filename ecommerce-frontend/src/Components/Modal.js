import ReactDOM from "react-dom";

import { ReactComponent as Xicon } from "../assets/exit-x.svg";
import AddListing from "./Admin Comps/AddListing";
import Delete from "./Admin Comps/Delete";
import Content from "./Modal components/Content";
import Settings from "./Modal components/Settings";

export default function Modal({
    isShowing,
    hide,
    option,
    product,
    url,
    setAuth,
}) {
    return (
        <>
            {isShowing
                ? ReactDOM.createPortal(
                      <div className="fixed m-auto inset-0 z-10 flex justify-center items-center">
                          <div
                              className="xl:rounded-md shadow-xl flex flex-col 
                                         bg-white border-[1px] border-gray-100 dark:bg-[#191919] 
                                          dark:border-gray-700 
                                           dark:shadow-md dark:shadow-gray-900
                                           w-full h-full
                                           lg:w-4/5 lg:h-2/3 relative"
                          >
                              <div
                                  className=" m-auto absolute inset-0
                                                left-[calc(100%-45px)] bottom-[calc(100%-45px)]
                                                cursor-pointer
                                                p-2
                                                h-fit w-fit z-20"
                                  onClick={hide}
                              >
                                  <Xicon className="fill-black dark:fill-white " />
                              </div>
                              {/**! CONTENT ! */}
                              {option === "preview" ? (
                                  <Content product={product} url={url} />
                              ) : option === "addlisting" ? (
                                  <AddListing hide={hide} setAuth={setAuth} />
                              ) : option === "settings" ? (
                                  <Settings />
                              ) : option === "delete" ? (
                                  <Delete />
                              ) : null}
                          </div>
                      </div>,

                      document.getElementById("main")
                  )
                : null}
        </>
    );
}
