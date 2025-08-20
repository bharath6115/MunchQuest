import { Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useAuth } from "../services/firebaseMethods";
import Reservations from "./Reservations";
import { useState, useEffect, useRef } from "react";

export default function ProfileCard({ setShowProfile, data, profileRef }) {
    const { uid } = useAuth();
    const wrapperRef = useRef(null);
    const [displayReservations, setDisplayReservations] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target) &&
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="border-1 border-zinc-200/20 absolute top-12 right-2 md:right-5 w-40 bg-zinc-800 rounded-xl shadow-lg py-3 px-4 text-sm">

            {/* Greeting */}
            <h1 className="mb-3 text-white font-medium">Hello, <span className="text-yellow-300">{data.username}</span></h1>

            {/* Menu Links */}
            <div className="flex flex-col gap-2 text-gray-300 items-start">
                <Link to={`/profile/${uid}`} className="hover:text-yellow-300 transition-colors"> Profile </Link>
                <button onClick={() => setDisplayReservations(true)} className="text-left hover:text-yellow-300 transition-colors" > Reservations </button>
                <button onClick={async () => await signOut(auth)} className="text-left hover:text-yellow-300 transition-colors"> Log out </button>
            </div>

            {/* Reservations modal/drawer */}
            {displayReservations && <Reservations toggle={setDisplayReservations} id={uid} searchIn = {"user"}/>}
        </div>
    );
}
