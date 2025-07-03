import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import Input from "./Input"
import axios from "axios"
import ButtonStyles from "../utils/ButtonStyles"
import formStyles from "../utils/FormStyles"
import { useAuth } from "../services/firebaseMethods"

const RestaurantForm = ({ title = "", location = "", description = "", target, Heading , newForm=false }) => {
    const { uid, isLoggedIn } = useAuth();


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

    //useEffect to sync the state with the props every time props change.
    useEffect(() => {
        setData({ title, location, description })
        setError({ title:"", location:"", description:"" })
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

        if(Object.keys(newErrors).length){
            setError(newErrors);
            return;
        }

        HandleSubmit();
    }

    const HandleSubmit = async () => {
        if(newForm){
            data["owner"] = uid;
            data["rating"] = 0;
            data["images"] = ["https://picsum.photos/400?random"]
        }
        axios.post(target, data)
            .then((res) => {
                navigate(`/restaurants/${res.data._id}`)
            })
            .catch(err => {
                console.log(err)
                if (err.status === 404) navigate("/error")
            })
    }


    if (!isLoggedIn) return <h1>Must be logged in!</h1>
    return (
        <>
            <form onSubmit={ValidateData} className={formStyles}>
                <h1 className="text-3xl">{Heading}</h1>
                {Object.entries(data).map(([key, value]) => {
                    return <Input
                        key={key}
                        name={key}
                        value={value}
                        fn={updData}
                        error = {error[key]}
                    />
                })}
                <button className={ButtonStyles}>Submit</button>
            </form>
        </>
    )
}

export default RestaurantForm