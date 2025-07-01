import { NavLink } from "react-router"
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router";
import { useAuth } from "../services/firebaseMethods";
import logo from "../../public/logo.png"

export default function Navbar() {

    const { isLoggedIn } = useAuth();

    const navStyle = "bg-zinc-900 text-white border-b border-zinc-800 px-2 md:px-7 flex items-center justify-between shadow-md";
    const linkStyles = ({ isActive = false }) => {
        return [
            isActive ? "text-bold" : "",
            isActive ? "text-yellow-300" : "text-zinc-300",
            isActive ? "" : "hover:text-white",
            isActive ? "border-double border-yellow-300 border-y-2" : "",
            "py-2"
        ].join(" ")
    }

    return (
        <nav className={navStyle}>
            <div className="flex items-center p-1 flex-grow">
                <img className="h-[50px] w-[49px]" src={logo} alt="logo" />
                <NavLink to="/" className="hidden md:block text-white font-bold text-[20px]"> MunchQuest </NavLink>
            </div>
            <div className="flex gap-4 items-center justify-between px-4">
                <NavLink to="/" className={linkStyles} end> Home </NavLink>
                <NavLink to="/restaurants" className={linkStyles} end> Restaurants</NavLink>
                <NavLink to="/restaurants/new" className={linkStyles} end> Add Restaurant</NavLink>
            </div>
            <div className="flex items-center gap-4 justify-end flex-grow">
                <button> (~) </button>
                {
                    isLoggedIn ?
                        <Link to="/" onClick={async () => { await signOut(auth) }} className="text-bold hover:text-yellow-300 text-white"> Sign out </Link>
                        :
                        <NavLink to="/login" className={linkStyles} end> Login </NavLink>
                }
            </div>
        </nav>
    )
}
