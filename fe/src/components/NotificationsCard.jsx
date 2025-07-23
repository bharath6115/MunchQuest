import { useState, useEffect } from "react";
import { useAuth } from "../services/firebaseMethods";
import toast from "react-hot-toast";
import axios from "axios";

export default function NotificationsCard() {

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { uid } = useAuth();
    const [readMore, setReadMore] = useState([])

    const fetchNotifications = async () => {
        axios.get(`/users/${uid}/notifications`)
            .then((res) => {
                setData(res.data);
                setIsLoading(false);
                setReadMore(Array(res.data.size).fill(false));
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error while fetching notifications..")
            })
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const ShowMore = (ind) => {
        setReadMore(old => {
            const new2 = [...old]
            new2[ind] = !new2[ind];
            return new2;
        })
    }

    const UpdNotif = (id) => {
        const payload = {isRead:true}
        axios.post(`/users/${uid}/notifications/${id}?_method=PATCH`,payload)
            .then((res) => {
                fetchNotifications();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err)
            })
    }

    const DeleteNotif = async (id) => {
        axios.post(`/users/${uid}/notifications/${id}?_method=DELETE`)
            .then((res) => {
                fetchNotifications();
                toast.success("Notification removed!")
            })
            .catch((err) => {
                console.log(err);
                toast.error(err)
            })
    }

    const Styles="bg-zinc-750 rounded-lg px-1 text-sm self-start"

    return (
        <div className="absolute top-12 right-12 md:right-15 bg-zinc-750 rounded-lg px-1 ">
            {
                data.length === 0 &&
                <h1 className="my-2 mx-1 px-3 py-1">No notifications</h1>
            }
            {!isLoading && data.map((notif, ind) => {
                return (
                    <div className={`flex flex-col items-center justify-center font-zinc-200 bg-zinc-800 rounded-lg my-2 mx-1 px-3 py-1 border-1 ${!notif.isRead ? "border-yellow-300" : "border-zinc-800"} `} key={notif._id}>
                        <button onClick={() => { DeleteNotif(notif._id) }} className="self-end text-[12px]">X</button>
                        {
                            !readMore[ind] &&
                            <>
                                <h1>{notif.message}</h1>
                                <div className="flex w-full items-center justify-between">
                                    <button className={Styles} onClick={() => { ShowMore(ind) }}>Show More</button>
                                    <button className={Styles} onClick={() => { UpdNotif(notif._id) }}>Mark as read</button>
                                </div>
                            </>
                        }
                        {
                            readMore[ind] &&
                            <>
                                <h1>{notif.from}</h1>
                                <h1>{notif.message}</h1>
                                <div className="flex w-full items-center justify-between">
                                    <button className={Styles} onClick={() => { ShowMore(ind) }}>Show Less</button>
                                    <button className={Styles} onClick={() => { UpdNotif(notif._id) }}>Mark as read</button>
                                </div>
                            </>
                        }
                    </div>
                )
            })}
        </div>
    )
}
