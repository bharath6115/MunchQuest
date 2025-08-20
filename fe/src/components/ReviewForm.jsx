import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router"
import Input from "./Input"
import ButtonStyles from "../utils/ButtonStyles"
import formStyles from "../utils/FormStyles"
import axios from "axios"
import { motion } from "framer-motion";
import { useAuth } from "../services/firebaseMethods"
import toast from "react-hot-toast"

export default function CreateReview({ rating, message, target, updateRestaurant, updateReviews, ownerID, title = "" }) {
    const nav = useNavigate();
    const { uid, isLoggedIn } = useAuth();
    const [data, setData] = useState({
        rating: rating,
        message: message,
    })
    const [error, setError] = useState({
        rating: "",
        message: "",
    })
    const isProcessing = useRef(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setData({ rating, message });
        setError({ rating: "", message: "" });
        isProcessing.current = false;
    }, [rating, message])

    const updData = (evt) => {
        const tgt = evt.target.name;
        const val = evt.target.value;
        setData(old => {
            return { ...old, [tgt]: val }
        })
    }

    const ValidateData = (e) => {
        e.preventDefault();

        if (isProcessing.current) return;
        isProcessing.current = true;

        const newErrors = {}

        if (!data.rating) {
            newErrors.rating = "Rating is required."
        } else {
            if (Number.isNaN(parseInt(data.rating)) || !Number.isInteger(parseFloat(data.rating))) {
                newErrors.rating = "Rating must be an integer."
            } else if (parseInt(data.rating) < 1) {
                newErrors.rating = "Rating cannot be less than 1."
            } else if (parseInt(data.rating) > 5) {
                newErrors.rating = "Rating cannot be more than 5."
            }
        }

        if (!data.message) {
            newErrors.message = "Message is required."
        }

        if (Object.keys(newErrors).length) {
            setError(newErrors);
            isProcessing.current = false;
            return;
        }
        HandleSubmit();
    }

    const HandleSubmit = async () => {
        const notifPayload = {
            from: uid,
            message: `New Review`,
            isRead: false,
        };
        const payload = { ...data };
        payload.rating = parseInt(payload.rating);
        payload["owner"] = uid;
        try {
            if(title) await axios.post(`/users/${ownerID}/notifications`, notifPayload);
            const res = await axios.post(target, payload);
            updateReviews();    //refetch the reviews
            updateRestaurant();
            toast.success(`Review ${title === "" ? "updated" : "posted"} sucessfully!`)
            if (title) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
        } catch (err) {
            const status = err.response?.status;
            toast.error(status || "Something went wrong! Please try again.");
            console.error("Submit error:", err);
            nav("/error");
        } finally {
            setData({ rating: "", message: "", });
            isProcessing.current = false;
            setIsSubmitting(false);
        }
    }
    return (
        <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >

            <form onSubmit={ValidateData} className={formStyles}>
                {isLoggedIn ?
                    <>
                        {title && <h1 className="text-3xl">{title}</h1>}
                        <Input fn={updData} name="rating" value={data.rating} error={error.rating} />
                        <Input fn={updData} name="message" value={data.message} error={error.message} />
                        <button className={ButtonStyles} >{isProcessing.current ? "Submitting..." : "Submit"}</button>
                    </>
                    :
                    <h1 className="font-medium text-lg">Please login to leave a review!</h1>
                }
            </form>
        </motion.div>
    )
}
