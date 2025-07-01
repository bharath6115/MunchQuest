import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import Input from "./Input"
import ButtonStyles from "../utils/ButtonStyles"
import formStyles from "../utils/FormStyles"
import axios from "axios"
import { motion } from "framer-motion";
import { useAuth } from "../services/firebaseMethods"

export default function CreateReview({ rating, message, target, updateRestaurant, updateReviews, title = "" }) {
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

    useEffect(() => {
        setData({ rating, message });
        setError({ rating: "", message: "" });
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
        const newErrors = {}

        if (!data.rating) {
            newErrors.rating = "Rating is required."
        } else {
            if (parseInt(data.rating) < 1) {
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
            return;
        }
        HandleSubmit();
    }
    
    const HandleSubmit = async () => {
        data.rating = parseInt(data.rating);
        data["owner"] = uid;
        axios.post(target, data)
            .then(() => {
                setData({ rating: "", message: "", })
                updateReviews();    //refetch the reviews
                updateRestaurant();
                if (title) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }) //scroll to bottom to show new review.
            }).catch((err) => {
                console.log(err);
                nav("/error");
            })
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
                <button className={ButtonStyles} >Submit</button>
                </>
                :
                <h1 className="font-medium text-lg">Please login to leave a review!</h1>
                }
            </form>
        </motion.div>
    )
}
