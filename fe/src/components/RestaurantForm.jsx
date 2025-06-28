import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import Input from "./Input"
import axios from "axios"
import ButtonStyles from "../utils/ButtonStyles"
import formStyles from "../utils/FormStyles"

const RestaurantForm = ({ title = "", location = "", description = "", target, Heading }) => {
    const [data, setData] = useState({
        title: title,
        location: location,
        description: description,
    })

    //useEffect to sync the state with the props every time props change.
    useEffect(() => {
        setData({ title, location, description })
    }, [title, location, description])

    const navigate = useNavigate();

    const updData = (evt) => {
        const target = evt.target.name
        const val = evt.target.value
        setData(old => {
            return { ...old, [target]: val }
        })
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        axios.post(target, data)
            .then((res) => {
                navigate(`/restaurants/${res.data._id}`)
            })
            .catch(err => {
                console.log(err)
                if (err.status === 404) navigate("/error")
            })
    }


    return (
        <>
            <form onSubmit={HandleSubmit} className={formStyles}>
                <h1 className="text-3xl">{Heading}</h1>
                {Object.entries(data).map(([key, value]) => {
                    return <Input
                        key={key}
                        name={key}
                        value={value}
                        fn={updData}
                    />
                })}
                <button className={ButtonStyles}>Submit</button>
            </form>
        </>
    )
}

export default RestaurantForm