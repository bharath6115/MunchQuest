import { useState, useEffect, useRef  } from "react"
import { useNavigate } from "react-router"
import Input from "./Input"
import axios from "axios"
import ButtonStyles from "../utils/ButtonStyles"
import formStyles from "../utils/FormStyles"
import { useAuth } from "../services/firebaseMethods"
import { images } from "../../../be/seeds/helper"
import toast from "react-hot-toast"
import { Loading } from "./Loading"
const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")

const rand = (x) => {
    return x[Math.floor(Math.random() * x.length)];
}

const RestaurantForm = ({ title = "", location = "", description = ""}) => {
    const { uid, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const nav = useNavigate();


    const [data, setData] = useState({
        title: title,
        location: location,
        description: description,
    })
    const [error, setError] = useState({
        title: "",
        location: "",
        description: "",
    });
    const [isProcessing, setIsProcessing] = useState(false);

    // const [images,setImages] = useState(null);

    //useEffect to sync the state with the props every time props change.
    useEffect(() => {
        setData({ title, location, description })
        setError({ title: "", location: "", description: "" })
        setIsProcessing(false);
        setIsLoading(false);
        // setImages(null);
    }, [title, location, description])

    const navigate = useNavigate();

    const updData = (evt) => {
        const target = evt.target.name
        const val = evt.target.value
        setData(old => {
            return { ...old, [target]: val }
        })
    }

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

        if (Object.keys(newErrors).length) {
            setError(newErrors);
            setIsProcessing(false);
            return;
        }

        HandleSubmit();
    }

    const HandleSubmit = async () => {
        const payload = { ...data };
        payload["owner"] = uid;
        payload["rating"] = 0;
        payload["images"] = [rand(images)];
        payload["reserveSeat"] = "Reserve a seat";
        payload["isVerified"] = false;
        axios.post("/restaurants", payload)
            .then((res) => {
                setIsProcessing(false);
                navigate(`/restaurants/${res.data._id}`)
                toast.success(`Restaurant added sucessfully!`)
            })
            .catch(err => {
                setIsProcessing(false);
                const status = err.response?.status;

                toast.error("Something went wrong! Please try again.");
                console.error("Submit error:", err);
                if (status === 404) return navigate("/error");
            })
    }

    if (isLoading) return <Loading />
    if (!isLoggedIn) return <h1>Must be logged in!</h1>
    return (
        <>
            <form onSubmit={ValidateData} className={formStyles} /*encType="multipart/form-data"*/>
                <button type="button" onClick={()=>{nav("/restaurants")}} className="p-0 m-0 self-end text-md hover:text-red-500" disabled={isProcessing}>Cancel</button>
                <h1 className="text-3xl">Add new restaurant</h1>
                {Object.entries(data).map(([key, value]) => {
                    return <Input
                        key={key}
                        name={key}
                        value={value}
                        fn={updData}
                        error={error[key]}
                    />
                })}
                {/* <input type="file" accept="image/*" multiple name="images" id="images" onChange={(e)=>{setImages(e.target.files)}}/> */}
                <button className={ButtonStyles} disabled={isProcessing}>{isProcessing ? "Submitting...":"Submit"}</button>
            </form>
        </>
    )
}

export default RestaurantForm