import { NavLink } from "react-router"

export default function Navbar() {

    const navStyle = "bg-zinc-900 text-white border-b border-zinc-800 px-7 py-1 flex items-center justify-between shadow-md";
    const linkStyles = ({ isActive }) => {
        return [
            isActive ? "text-bold" : "",
            isActive ? "text-yellow-300" : "text-zinc-300",
            isActive ? "":"hover:text-white",
            isActive ? "border-double border-yellow-300 border-y-2" : "",
            "py-2"
        ].join(" ")
    }

    const LogoStyles = "text-white font-bold text-lg"

    return (
        <nav className={navStyle}>
            <div className="flex items-center p-3 flex-grow">
                <NavLink to="/" className={LogoStyles}> MunchQuest </NavLink>
            </div>
            <div className="flex gap-4 items-center justify-between px-4">
                <NavLink to="/" className={linkStyles} end> Home </NavLink>
                <NavLink to="/restaurants" className={linkStyles} end> Restaurants</NavLink>
                <NavLink to="/restaurants/new" className={linkStyles} end> Add Restaurant</NavLink>
            </div>
            <div className="flex items-center gap-4 justify-end flex-grow">
                <button> (~) </button>
                <NavLink to="/login" className={linkStyles} end> Login </NavLink>
            </div>
        </nav>
    )
}
