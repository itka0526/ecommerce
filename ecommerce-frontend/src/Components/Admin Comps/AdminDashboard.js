import { useEffect, useState } from "react";
import App from "../../App";
import useModal from "../hooks/useModal";
import Modal from "../Modal";
import LoginRegister from "./LoginRegister";
import SideBar from "./SideBar";

export default function AdminDashboard({ auth, setAuth }) {
    const { isShowing, toggle } = useModal();

    const [option, setOption] = useState("");

    useEffect(() => {
        (async () => {
            const pending_response = await fetch("/login");
            const response = await pending_response.json();
            if (response.auth === true) {
                setAuth(true);
            } else if (response.auth === false) {
                setAuth(false);
            }
        })();
    }, []);
    return (
        <div className="relative h-screen w-screen flex">
            {auth === false && <LoginRegister setAuth={setAuth} />}
            {auth === true && (
                <SideBar
                    setAuth={setAuth}
                    toggle={toggle}
                    setOption={setOption}
                />
            )}
            <Modal
                isShowing={isShowing}
                hide={toggle}
                setAuth={setAuth}
                option={option}
            />
            <App />
            <div className="border-l-[1px] dark:bg-black w-[1.5px] h-full border-[#333]" />
        </div>
    );
}
