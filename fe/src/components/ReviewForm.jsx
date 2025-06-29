import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import Input from "./Input"
import ButtonStyles from "../utils/ButtonStyles"
import formStyles from "../utils/FormStyles"
import axios from "axios"
import { motion } from "framer-motion";

export default function CreateReview({ rating, message, target, updateReviews, title = "" }) {
    const nav = useNavigate();

    const [data, setData] = useState({
        rating: rating,
        message: message,
    })

    useEffect(() => {
        setData({ rating, message });
    }, [rating, message])

    const updData = (evt) => {
        const tgt = evt.target.name;
        const val = evt.target.value;
        setData(old => {
            return { ...old, [tgt]: val }
        })
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        data.rating = parseInt(data.rating);
        axios.post(target, data)
            .then(() => {
                setData({ rating: "", message: "", })
                updateReviews();    //refetch the reviews
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

            <form onSubmit={HandleSubmit} className={formStyles}>
                {title && <h1 className="text-3xl">{title}</h1>}
                <Input fn={updData} name="rating" value={data.rating} />
                <Input fn={updData} name="message" value={data.message} />
                <button className={ButtonStyles} >Submit</button>
            </form>
        </motion.div>
    )
}
