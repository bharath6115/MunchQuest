import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="my-auto flex flex-col flex-grow items-center justify-center">
                <Outlet />
            </div>
        </div>
    )
}