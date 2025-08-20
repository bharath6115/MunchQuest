import { useAuth } from "../services/firebaseMethods"
import { MdOutlineVerified } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import Reservations from "./Reservations"
import { useEffect } from "react";
import { IoMdMore } from "react-icons/io";

export default function RestaurantHero({ id, restaurantData, UpdRestaurant, DelRestaurant, VerifyRestaurant }) {
    const { isAdmin, uid, isLoggedIn } = useAuth();
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showReservations, setShowReservations] = useState(false);
    const [showAdminActions, setShowAdminActions] = useState(false);
    const adminActionsRef = useRef(null);
    const adminActionsDivRef = useRef(null);
    const isReserving = useRef(false);

    useEffect(()=>{
        const func = (event)=>{
            if(adminActionsRef.current && !adminActionsRef.current.contains(event.target) && 
               adminActionsDivRef.current && !adminActionsDivRef.current.contains(event.target)) setShowAdminActions(false);
        }
        document.addEventListener("mousedown", func);
        return ()=>document.removeEventListener("mousedown", func);
    },[])

    const HandleReserve = async (e) => {
        e.preventDefault();
        if (isReserving.current) return;
        isReserving.current = true;
        if (!selectedDate) return toast.error("Date cannot be empty.");
        if (!isLoggedIn) return toast.error("Must be logged in!");

        const notifPayload = {
            from: uid,
            message: `New Reservation Request`,
            isRead: false,
        };

        const reservationPayload = {
            userID: uid,
            restaurantID: id,
            seats: selectedSeats,
            reservationDate: `${selectedDate}`,
        };

        try {
            await axios.post(`/users/${restaurantData.owner}/notifications`, notifPayload);
            await axios.post(`/reservations`, reservationPayload);
            toast.success("Reservation request sent!");
            setShowReservationForm(false);
            setSelectedDate("");
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            console.log(err);
            toast.error(msg);
        } finally {
            isReserving.current = false;
        }
    };

    const ButtonStyles = "border-2 text-black rounded-lg max-w-100 min-w-30 bg-sky-300 hover:bg-sky-500 px-3 py-1 my-1 xsm:my-3 transition-colors duration-150"
    const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")
    const VerifyButton = ButtonStyles.replace("bg-sky-300", "bg-violet-500").replace("hover:bg-sky-500", "hover:bg-violet-600")

    return (
        <div className="flex flex-col items-center lg:flex-row bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl gap-6">
            {/* image */}
            <div className="lg:min-w-[400px]">
                <img className="rounded-lg object-cover" src={restaurantData.images[0]} alt="restaurant" />
            </div>
            {/* restaurant details */}
            <div className="flex flex-col space-y-2 text-zinc-300 text-left flex-grow w-full">

                <h1 className="self-end text-yellow-300">⭐{restaurantData.rating.toFixed(1)}/5 <span className="text-zinc-300">({restaurantData.reviews.length})</span></h1>

                <h1 className="text-4xl flex flex-row gap-1">
                    {restaurantData.title}
                    {restaurantData.isVerified && <MdOutlineVerified className="text-yellow-300 text-[26px]" />}
                </h1>
                <h2 className="text-md mb-6">{restaurantData.location}</h2>

                <h3 className="my-4">{restaurantData.description}</h3>

                {/* reserve seat logic */}
                {!showReservationForm ? (
                    <button type="button" className="self-start inline-block border-2 text-black rounded-lg bg-sky-400 hover:bg-yellow-300 px-3 py-1 transition-colors duration-150" onClick={() => setShowReservationForm(true)}>
                        {restaurantData.reserveSeat}
                    </button>
                ) : (
                    <form onSubmit={HandleReserve} className="flex items-start sm:items-center flex-col xsm:flex-row gap-1">
                        <div className="flex gap-3 bg-zinc-750 rounded-lg justify-center items-center">
                            <button className="rounded-l-lg hover:bg-zinc-700 w-5 text-xl font-medium py-0.5 px-1" onClick={() => { selectedSeats > 1 && setSelectedSeats(old => old - 1) }} type="button">-</button>
                            <h1>{selectedSeats}</h1>
                            <button className="rounded-r-lg hover:bg-zinc-700 w-5 text-xl font-medium py-0.5 px-1" onClick={() => { setSelectedSeats(old => old + 1) }} type="button">+</button>
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-zinc-750 rounded-lg px-2 py-1"
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <div>
                            <button type="submit" className="border-2 text-black rounded-lg bg-sky-300 hover:bg-sky-500 px-3 py-1 transition-colors duration-150">Reserve</button>
                            <button type="button" className="border-2 text-black rounded-lg bg-red-400 hover:bg-red-500 px-3 py-1 transition-colors duration-150" onClick={() => setShowReservationForm(false)}>Cancel</button>
                        </div>
                    </form>
                )}

                {/* admin controls */}
                <div className="flex flex-row items-center justify-end">
                    {(isAdmin || uid === restaurantData.owner) && (
                        <div className="relative">
                            <button ref={adminActionsRef} className="border-1 border-zinc-200/15 flex items-center px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white" onClick={() => { setShowAdminActions(old => !old) }}> Admin Actions <IoMdMore className="text-2xl"/> </button>
                            {
                                showAdminActions &&
                                <div ref={adminActionsDivRef} className="absolute left-0 mt-2 max-w-37 bg-zinc-750 rounded-lg shadow-lg overflow-hidden z-10">
                                    <ul className="flex flex-col text-sm">

                                        {/* Update */}
                                        <li className="px-4 py-2 text-blue-300 hover:text-blue-600 hover:bg-blue-300 cursor-pointer" onClick={UpdRestaurant}> Update </li>

                                        {/* Delete */}
                                        <li className="px-4 py-2 text-red-600 hover:bg-red-300 cursor-pointer" onClick={() => { setIsDeleting(true); DelRestaurant(); }} > {isDeleting ? "Deleting.." : "Delete"} </li>

                                        {/* Reservations */}
                                        <li className="px-4 py-2 text-purple-600 hover:bg-purple-300 cursor-pointer" onClick={() => setShowReservations(true)} > View Reservations </li>

                                        {/* Verify (optional) */}
                                        {isAdmin && !restaurantData.isVerified && 
                                            <li className="px-4 py-2 text-green-600 hover:bg-green-300 cursor-pointer" onClick={VerifyRestaurant}> Verify </li>
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                    )}

                    {showReservations && (
                        <Reservations toggle={setShowReservations} id={id} searchIn="restaurant"/>
                    )}
                </div>

            </div>
        </div>
    )
}
