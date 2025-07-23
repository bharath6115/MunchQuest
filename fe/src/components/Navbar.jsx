import { NavLink } from "react-router"
import { useAuth } from "../services/firebaseMethods";
import logo from "../../public/logo.png"
import { IoMenuOutline, IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import ProfileCard from "./ProfileCard"
import NotificationsCard from "./NotificationsCard"
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import axios from "axios";

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

    const { isAdmin } = useAuth();

    return (
        <>
            <NavLink to="/" className={linkStyles} end> Home </NavLink>
            <NavLink to="/restaurants" className={linkStyles} > Restaurants</NavLink>
            {/* <NavLink to="/restaurants/new" className={linkStyles} end> Add Restaurant</NavLink> */}
            {isAdmin && <NavLink to="/verify" className={linkStyles}>Verify Panel</NavLink>}
            <NavLink to="/faq" className={linkStyles} end> FAQ </NavLink>
        </>
    )
}

export default function Navbar() {

    const { uid, isLoggedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [data, setData] = useState({});

    const fetchData = async () => {
        axios.get(`/users/${uid}`)
            .then((res) => {
                setData(res.data);
                setShowProfile(false);
                setShowNotifications(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        if (isLoggedIn) fetchData();
    }, [isLoggedIn])

    useEffect(() => {
        document.body.style.overflow = (menuOpen || searchOpen) ? "hidden" : "auto";
    }, [menuOpen, searchOpen]);

    // { console.log(data) };

    return (
        <nav className="relative z-50 bg-zinc-900 text-white border-b border-zinc-800 px-2 py-1 md:px-7 flex items-center justify-between shadow-md" >
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
            <div className="flex flex-grow items-center justify-center md:justify-start">
                <img className="h-[50px] w-[49px]" src={logo} alt="Website logo" />
                <NavLink to="/" className="text-white font-bold text-[20px]"> MunchQuest </NavLink>
            </div>
            {/* nav */}
            <div className=" hidden md:flex gap-4 items-center justify-between px-4">
                <NavLinks />
            </div>
            {/* search bar + login */}
            <div className="flex flex-grow items-center gap-4 justify-end">
                <div>
                    <button
                        className={"border-2 border-zinc-900 text-white rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1 transition-colors duration-150 flex items-center justify-center gap-1"}
                        onClick={() => { setSearchOpen(true) }}
                    >
                        <IoSearch />
                        <span className="hidden xsm:inline">Search</span>
                    </button>
                    {searchOpen && <SearchBox setSearchOpen={setSearchOpen} />}

                </div>
                {
                    isLoggedIn ?
                        <div className="gap-4 flex items-center justify-center">

                            <button aria-label="Notifications" className={`text-2xl ${showNotifications && "text-yellow-300"}`} onClick={() => { setShowProfile(false); setShowNotifications(old => !old) }}> <FaRegBell /> </button>
                            {/* {data.unreadNotificationsCount !== 0 && <div className="absolute top-4 right-17 w-[9px] h-[9px] bg-white rounded-full"></div>} */}
                            {showNotifications && <NotificationsCard />}

                            <button aria-label="User Details" className={`text-2xl ${showProfile && "text-yellow-300"}`} onClick={() => { setShowNotifications(false); setShowProfile(old => !old) }}> <CgProfile /> </button>
                            {showProfile && <ProfileCard data={data} />}

                        </div>
                        :
                        <NavLink to="/login" className={linkStyles} end> Login </NavLink>
                }
            </div>
        </nav>
    )
}
