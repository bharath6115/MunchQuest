import { useState, useEffect } from "react";
import { useAuth } from "../services/firebaseMethods";
import toast from "react-hot-toast";
import axios from "axios";

//optimisation:
//instead of refetching data always, update the data present after sending axios request. update the readMore according to size

export default function NotificationsCard() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const { uid } = useAuth();
    const [readMore, setReadMore] = useState([])

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/users/${uid}/notifications`);
            setData(res.data);
            setReadMore(Array(res.data.length).fill(false));
        } catch (err) {
            console.error(err);
            toast.error("Error while fetching notifications.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (uid) fetchNotifications();
    }, [uid]);

    const ToggleShowMore = (ind) => {
        setReadMore(old => {
            const new2 = [...old]
            new2[ind] = !new2[ind];
            return new2;
        })
    }

    const UpdNotif = async (id) => {
        if (isProcessing) return;
        setIsProcessing(true);
        const payload = { isRead: true }

        try {
            await axios.post(`/users/${uid}/notifications/${id}?_method=PATCH`, payload)
            // fetchNotifications();
            setData(old => {
                return old.map((val) => {
                    if (val._id == id) return { ...val, isRead: true }
                    return val;
                })
            })
        } catch (err) {
            console.log(err);
            toast.error(err)
        } finally {
            setIsProcessing(false);
        }
    }

    const DeleteNotif = async (id) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await axios.post(`/users/${uid}/notifications/${id}?_method=DELETE`)
            // fetchNotifications();
            setData(old => {
                const ind = old.findIndex(val => val._id === id);
                const upd = old.filter(val => val._id !== id);

                setReadMore(prev => {
                    const updatedReadMore = [...prev];
                    updatedReadMore.splice(ind, 1);
                    return updatedReadMore;
                });

                return upd;
            });

            toast.success("Notification removed!")
        } catch (err) {
            console.log(err);
            toast.error(err)
        } finally {
            setIsProcessing(false);
        }
    }

    const Styles = "hover:underline px-1 text-sm self-start"

    return (
        <div className="absolute top-12 right-12 md:right-15 min-w-80 bg-zinc-750 rounded-lg px-1 ">

            {isLoading ?
                <div className="flex flex-col items-center justify-center px-3 py-3 gap-2">
                    <div className="w-[25px] h-[25px] border-yellow-300 border-t-2 border-b-2 rounded-full animate-spin"></div>
                    <h1>Loading</h1>
                </div>
                :
                <>
                    {
                        data.length === 0 &&
                        <h1 className="my-2 mx-1 px-3 py-1">No notifications</h1>
                    }
                    {data.map((notif, ind) => {
                        return (
                            <div className={`flex flex-col gap-1 items-center justify-center font-zinc-200 bg-zinc-800 rounded-lg my-2 mx-1 px-3 py-1 border-1 ${!notif.isRead ? "border-yellow-300" : "border-zinc-800"} `} key={notif._id}>
                                <button onClick={() => DeleteNotif(notif._id)} className="self-end text-sm text-red-400 hover:text-red-600">✕</button>
                                {
                                    !readMore[ind] &&
                                    <>
                                        <h1>{notif.message}</h1>
                                    </>
                                }
                                {
                                    readMore[ind] &&
                                    <>
                                        <h1>{notif.from}</h1>
                                        <h1>{notif.message} on {notif.reservationDate}</h1>
                                    </>
                                }
                                <div className="flex w-full items-center justify-between">
                                    <button className={Styles} onClick={() => { ToggleShowMore(ind) }}>{readMore[ind] ? "Show Less":"Show More"}</button>
                                    {!notif.isRead && <button className={Styles} onClick={() => { UpdNotif(notif._id) }}>Mark as read</button>}
                                </div>
                            </div>
                        )
                    })}
                </>
            }
        </div>
    )
}
