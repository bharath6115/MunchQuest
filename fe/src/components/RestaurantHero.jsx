import { useAuth } from "../services/firebaseMethods"
import { MdOutlineVerified } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

export default function RestaurantHero({ restaurantData, UpdRestaurant, DelRestaurant, VerifyRestaurant }) {
    const { isAdmin, uid } = useAuth();
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const HandleReserve = async (e) => {
        e.preventDefault();
        if (!selectedDate) return toast.error("Date cannot be empty.");

        const payload = {
            from: uid,
            message: `Request to reserve seat`,
            reservationDate: `${selectedDate}`,
            isRead: false,
        };

        try {
            await axios.post(`/users/${restaurantData.owner}/notifications`, payload);
            toast.success("Reservation request sent!");
            setShowReservationForm(false);
            setSelectedDate("");
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            console.log(err);
            toast.error(msg);
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
                    <form onSubmit={HandleReserve} className="flex gap-1">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button type="submit" className="border-2 text-black rounded-lg bg-sky-300 hover:bg-sky-500 px-3 py-1 transition-colors duration-150">Reserve</button>
                        <button type="button" className="border-2 text-black rounded-lg bg-red-400 hover:bg-red-500 px-3 py-1 transition-colors duration-150" onClick={() => setShowReservationForm(false)}>Cancel</button>
                    </form>
                )}

                {/* admin controls */}
                <div className="self-end mt-auto flex flex-col xsm:flex-row justify-end">
                    {
                        (isAdmin && !restaurantData.isVerified)
                        &&
                        <button type="button" className={VerifyButton} onClick={VerifyRestaurant}>Verify</button>
                    }
                    {
                        (isAdmin || uid == restaurantData.owner)
                        &&
                        <>
                            <button className={ButtonStyles} onClick={UpdRestaurant}>Update</button>
                            <button className={DangerButton} onClick={DelRestaurant}>Delete</button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
