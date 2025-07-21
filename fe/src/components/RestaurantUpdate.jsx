import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useAuth } from "../services/firebaseMethods"
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function RestaurantUpdate({ restaurantData, setEditRestaurant, id, fetchRestaurant }) {
    const { isAdmin, uid } = useAuth();
    const nav = useNavigate();
    const [data, setData] = useState({
        title: "",
        location: "",
        description: "",
        reserveSeat: "",
    });
    const [error, setError] = useState({
        title: "",
        location: "",
        description: "",
        reserveSeat: "",
    });
    const textareaRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useLayoutEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = "auto"; // reset
            textarea.style.height = `${textarea.scrollHeight}px`; // set to fit content
        }
    }, [data.description]);

    useEffect(() => {
        setData({
            title: restaurantData.title || "",
            location: restaurantData.location || "",
            description: restaurantData.description || "",
            reserveSeat: restaurantData.reserveSeat || "",
        });
        setIsProcessing(false);
    }, [restaurantData]);

    const ValidateData = (e) => {
        e.preventDefault();

        if (isProcessing) return;
        setIsProcessing(true);

        const newErrors = {}

        if (!data.title) {
            newErrors.title = "Title is required.";
        } else if (data.title.length < 5) {
            newErrors.title = "Title must be longer than 5 characters";
        }
        if (!data.location) {
            newErrors.location = "Location is required.";
        } else if (data.location.length < 5) {
            newErrors.location = "Location must be longer than 5 characters";
        }
        if (!data.description) {
            newErrors.description = "Description is required.";
        } else if (data.description.length < 5) {
            newErrors.description = "Description must be longer than 5 characters";
        }
        if(!data.reserveSeat){
            newErrors.reserveSeat = "Reserve seat message is required.";
        }else if(data.reserveSeat.length > 25){
            newErrors.reserveSeat = "Reserve seat message is too long!";
        }

        if (Object.keys(newErrors).length) {
            setError(newErrors);
            setIsProcessing(false);
            for (let e in newErrors) {
                toast.error(newErrors[e]);
            }
            return;
        }

        HandleSubmit();
    }

    const HandleSubmit = async () => {
        const payload = { ...data };
        axios.post(`/restaurants/${id}?_method=PATCH`, payload)
            .then((res) => {
                setIsProcessing(false);
                setEditRestaurant(false);
                fetchRestaurant();
                toast.success(`Restaurant updated sucessfully!`)
            })
            .catch(err => {
                setIsProcessing(false);
                const status = err.response?.status;

                toast.error("Something went wrong! Please try again.");
                console.error("Submit error:", err);
                if (status === 404) return nav("/error");
            })
    }
    const UpdData = (e) => {
        const tgt = e.target.name;
        const val = e.target.value;

        setData((old) => {
            return { ...old, [tgt]: val };
        });
    }

    const ButtonStyles = "border-2 text-black rounded-lg max-w-100 min-w-30 bg-sky-300 hover:bg-sky-500 px-3 py-1 my-3 transition-colors duration-150"
    const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")

    const BaseStyles = "w-full rounded-sm border border-zinc-600 bg-zinc-800 text-zinc-100  focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
    const InputError = " outline-2 outline-red-500";

    const getInputClass = (field) => {
        if (error[field] === undefined) return "";
        if (error[field].length > 0) return InputError;
        return "";
    };




    return (
        <form onSubmit={ValidateData} className="flex flex-col items-center lg:flex-row bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl gap-6">
            <div className="lg:min-w-[400px]">
                <img className="rounded-lg object-cover" src={restaurantData.images[0]} alt="restaurant" />
            </div>
            <div className="flex flex-col space-y-2 text-zinc-300 text-left flex-grow w-full">

                <h1 className="self-end text-yellow-300">⭐{restaurantData.rating.toFixed(1)}/5 <span className="text-zinc-300">({restaurantData.reviews.length})</span></h1>


                <input
                    name="title"
                    className={`${BaseStyles} ${getInputClass("title")} text-4xl pb-2`}
                    value={data.title}
                    onChange={UpdData}
                />

                <input
                    name="location"
                    className={`${BaseStyles} ${getInputClass("location")}  text-md mb-6`}
                    value={data.location}
                    onChange={UpdData}
                />

                <textarea
                    name="description"
                    className={`${BaseStyles} ${getInputClass("description")} my-4 min-h-[5rem] resize-none overflow-hidden`}
                    value={data.description}
                    onChange={UpdData}
                    ref={textareaRef}
                />
                
                <input
                    name="reserveSeat"
                    className={`rounded-sm border-2 border-black text-black bg-sky-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition w-60 ${getInputClass("reserveSeat")} self-start`}
                    value={data.reserveSeat}
                    onChange={UpdData}
                />
{/* 
                <input className="border-2 text-black rounded-lg bg-sky-400 hover:bg-yellow-300 px-3 py-1 w-35" value={data.reserveSeat} > Reserve a seat </input> */}


                <div className="justify-end flex flex-row ">
                    <button className={ButtonStyles}>Submit</button>
                    <button type="button" className={DangerButton} onClick={() => { setEditRestaurant(false) }}>Cancel</button>
                </div>
            </div>
        </form>
    )
}
