import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { FaArrowCircleUp } from "react-icons/fa";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="my-auto flex flex-col flex-grow items-center justify-center">
                <Outlet />

                <button
                    onClick={()=>{window.scrollTo({top:0, behavior:"smooth"})}}
                    className="fixed bottom-5 right-5 p-1 rounded-full bg-yellow-400 text-black shadow-lg hover:bg-yellow-500 transition-all"
                >
                <FaArrowCircleUp size="25px" />
                </button>
            </div>
        </div>
    )
}