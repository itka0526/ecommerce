export default function SideBarItem({
    func,
    icon,
    text,
    sideBarOpen,
    expand = true,
}) {
    return (
        <div
            className={
                expand
                    ? `flex flex-nowrap justify-start gap-x-4 h-12 select-none
                     items-center rounded-xl p-1 pl-0 
                    hover:bg-gray-300 cursor-pointer
                     dark:hover:bg-gray-700 dark:text-gray-300`
                    : `flex flex-nowrap justify-start gap-x-4 h-12 select-none
                     items-center rounded-xl p-1 pl-0 cursor-pointer
                    hover:bg-gray-300
                     dark:hover:bg-gray-700 dark:text-gray-300 max-md:pointer-events-none`
            }
            onClick={() => func()}
        >
            <div className="p-1">{icon}</div>
            <div
                className="transition-[opacity]"
                style={sideBarOpen ? { opacity: "100%" } : { opacity: "0%" }}
            >
                <span
                    className="whitespace-nowrap bg-gradient-to-t from-black to-black
                     bg-pre-underline bg-no-repeat bg-left-bottom transition-[background-size] duration-500 hover:bg-underline 
                "
                >
                    {text}
                </span>
            </div>
        </div>
    );
}
