import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Reservation({ toggle, searchIn, id }) {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [restaurantsMap, setRestaurantsMap] = useState({});
    const [usersMap, setUsersMap] = useState({});
    const isProcessing = useRef(false);
    const firstFetch = useRef(true);    //the batchfetch needs to be done only once as after a single fetch even if entries are deleted/modified the mapped data doesnt change.

    const fetchReservations = async () => {
        try {
            const res = await axios.get(`/reservations/${searchIn}/${id}`);
            setData(res.data);

            if (firstFetch.current) {
                //Batch fetch the required details in a single request
                const ids = [...new Set(res.data.map(n => n.restaurantID))];
                if(searchIn == "restaurant") ids.push(id);
                if (ids.length) {
                    const restaurantsData = await axios.get(`/restaurants/batch/${ids.join(",")}`);
                    // console.log(ids);
                    // console.log(restaurantsData);
                    setRestaurantsMap(restaurantsData.data);
                }
                const uids = [...new Set(res.data.map(n => n.userID))];
                if (uids.length) {
                    const usersData = await axios.get(`/users/batch/${uids.join(",")}`);
                    setUsersMap(usersData.data);
                }
                firstFetch.current = false;
            }

        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            console.log(err);
            toast.error(msg);
        } finally {
            setIsLoading(false);
            isProcessing.current = false;
        }
    }

    useEffect(() => {
        setIsLoading(true);
        isProcessing.current = true;
        fetchReservations();
    }, []);

    const DeleteReservation = async (id) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        try {
            await axios.post(`/reservations/${id}?_method=DELETE`);
            await fetchReservations();
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            console.log(err);
            toast.error(msg);
        } finally {
            isProcessing.current = false;
        }
    }

    const CancelReservation = async (id) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        try {
            await axios.post(`/reservations/${id}?_method=PATCH`, { status: "cancelled" });
            await fetchReservations();
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            console.log(err);
            toast.error(msg);
        } finally {
            isProcessing.current = false;
        }
    }
    // console.log(id);
    // console.log(restaurantsMap);
    return (
        <div
            className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-blur z-100 backdrop-blur-xs"
            onClick={() => toggle(false)}
        >
            <div className="border-1 border-zinc-200/30 w-9/10 sm:w-1/2 h-11/20 bg-zinc-750 rounded-xl" onClick={(e) => e.stopPropagation()}>

                {
                    isLoading && <div className='flex items-center justify-center gap-2 flex-col h-full'>
                        <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-yellow-400"></div>
                        <div className='text-2xl'>Loading...</div>
                    </div>
                }
                {
                    !isLoading && <>
                        {/*All Reservations */}
                        <div className="flex flex-col gap-3 mt-2 h-95 items-center justify-start text-left px-3 overflow-auto scrollbar-thick">
                            <div className="text-center w-full border-b-2 border-zinc-500 shadow-lg">
                                <h1 className="text-3xl font-md mb-3">{searchIn == "user" ? "My Reservations" : `${restaurantsMap[id]?.title || "Unknown Restaurant"} Reservations`}</h1>
                            </div>
                            {data.map((val) => {
                                return (
                                    <div key={val._id} className={`flex flex-row justify-between items-center gap-2 p-4 w-full bg-zinc-800 rounded-2xl shadow-md hover:shadow-lg transition border-y-2 ${val.status == "active" ? "border-green-500/60" : "border-red-500/60"}`}>

                                        {/* Left: Reservation info */}
                                        <div>
                                            <h2 className="text-lg font-semibold text-zinc-100">
                                                {
                                                    searchIn == "user" ?
                                                        <Link to={`/restaurants/${val.restaurantID}`} className="hover:underline" onClick={() => toggle(old => !old)}> {restaurantsMap[val.restaurantID]?.title || "Unknown Restaurant"}</Link>
                                                        :
                                                        <Link to={`/profile/${val.userID}`} className="hover:underline" onClick={() => toggle(old => !old)}> {usersMap[val.userID]?.username || "Anonymous"}</Link>
                                                }
                                            </h2>
                                            <p className="text-sm text-zinc-400">{searchIn == "user" && "You"} reserved {val.seats} {val.seats > 1 ? "seats" : "seat"} on {new Date(val.reservationDate).toLocaleDateString("en-GB")}</p>
                                        </div>

                                        {/* Right: Status + Actions */}
                                        <div className="flex flex-col items-end gap-2 ">
                                            <span className={`px-1.5 py-0.5 text-sm rounded-lg font-lg ${val.status === "active" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-500"}`}>{val.status === "active" ? "Active" : "Cancelled"}</span>

                                            <button
                                                onClick={() => val.status === "active" ? CancelReservation(val._id) : DeleteReservation(val._id)}
                                                className="text-sm text-red-400 hover:text-red-500 transition hover:underline hover:underline-red"
                                                disabled={isProcessing.current}
                                            >
                                                {val.status === "active" ? "Cancel" : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            {data.length === 0 && <h1 className="font-thin text-2xl my-auto">No reservations made!</h1>}
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
