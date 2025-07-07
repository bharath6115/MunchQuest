import { NavLink } from "react-router"
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router";
import { useAuth } from "../services/firebaseMethods";
import logo from "../../public/logo.png"
import { IoMenuOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

const linkStyles = ({ isActive = false }) => {
    return [
        isActive ? "text-bold" : "",
        isActive ? "text-yellow-300" : "text-zinc-300",
        isActive ? "" : "hover:text-white",
        isActive ? "border-double border-yellow-300 border-y-2" : "",
        "py-2"
    ].join(" ")
}

const NavLinks = () => {

    return (
        <>
            <NavLink to="/" className={linkStyles} end> Home </NavLink>
            <NavLink to="/restaurants" className={linkStyles} end> Restaurants</NavLink>
            <NavLink to="/restaurants/new" className={linkStyles} end> Add Restaurant</NavLink>
        </>
    )
}

export default function Navbar() {

    const { isLoggedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
    }, [menuOpen]);

    return (
        <nav className="relative z-50 bg-zinc-900 text-white border-b border-zinc-800 px-2 md:px-7 flex items-center justify-between shadow-md" >
            {/* mobile nav */}
            <div className="block md:hidden flex flex-grow items-center justify-start pl-3 text-4xl">
                <IoMenuOutline className={`${menuOpen && "text-yellow-300"}`} onClick={() => { setMenuOpen(old => !old) }} />
                {menuOpen &&
                    <>
                        <div className={`fixed top-[58.8px] left-0 h-full w-screen bg-zinc-800 p-4 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-100 z-30`}>
                            <div onClick={() => { setMenuOpen(false) }} className="mt-[200px] my-4 flex flex-col items-center justify-center text-[18px] gap-2">
                                <NavLinks />
                            </div>
                        </div>
                    </>
                }
            </div>
            {/* Logo */}
            <div className="flex items-center p-1 flex-grow justify-center md:justify-start">
                <img className="h-[50px] w-[49px]" src={logo} alt="Website logo" />
                <NavLink to="/" className="text-white font-bold text-[20px]"> MunchQuest </NavLink>
            </div>
            {/* nav */}
            <div className=" hidden md:flex gap-4 items-center justify-between px-4">
                <NavLinks />
            </div>
            {/* login */}
            <div className="flex items-center gap-4 justify-end flex-grow">
                {
                    isLoggedIn ?
                        <Link to="/" onClick={async () => { await signOut(auth) }} className="text-bold hover:text-yellow-300 text-white "> Sign out </Link>
                        :
                        <NavLink to="/login" className={linkStyles} end> Login </NavLink>
                }
            </div>
        </nav>
    )
}
