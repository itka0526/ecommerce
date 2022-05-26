import { useState } from "react";
import { ReactComponent as SignOutIcon } from "../../assets/signOut.svg";
import { ReactComponent as EditUser } from "../../assets/user-friends-svgrepo-com.svg";
import { ReactComponent as ExpandIcon } from "../../assets/double-arrow-right-svgrepo-com.svg";
import { ReactComponent as UploadIcon } from "../../assets/upload-svgrepo-com.svg";
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";
import SideBarItem from "../Admin Comps/SideBarItem";

export default function SideBar({ setAuth, toggle, setOption }) {
    const [sideBarOpen, setSideBarOpen] = useState(false);

    return (
        <div
            className="h-screen transition-[width] flex flex-col overflow-x-hidden bg-gray-200 dark:bg-[#333] text-base p-1 border-[1px] border-b-0 border-[#333]"
            style={
                sideBarOpen
                    ? {
                          width: "27%",
                      }
                    : { width: "54px" }
            }
        >
            <SideBarItem
                func={() => setSideBarOpen(!sideBarOpen)}
                icon={<ExpandIcon width={32} height={32} />}
                text={"Нуух"}
                sideBarOpen={sideBarOpen}
                expand={false}
            />
            <SideBarItem
                func={() => {
                    setOption("addlisting");
                    toggle();
                }}
                icon={<UploadIcon width={32} height={32} />}
                text={"Бараа нэмэх"}
                sideBarOpen={sideBarOpen}
            />
            <SideBarItem
                func={() => {
                    setOption("delete");
                    toggle();
                }}
                icon={<DeleteIcon width={32} height={32} />}
                text={"Устгах"}
                sideBarOpen={sideBarOpen}
            />
            <SideBarItem
                func={() => {
                    setOption("settings");
                    toggle();
                }}
                icon={<EditUser width={32} height={32} />}
                text={"Тохиргоо"}
                sideBarOpen={sideBarOpen}
            />
            <SideBarItem
                func={() => {
                    fetch("/signout");
                    setAuth(false);
                }}
                icon={<SignOutIcon width={32} height={32} />}
                text={"Гарах"}
                sideBarOpen={sideBarOpen}
            />
        </div>
    );
}
