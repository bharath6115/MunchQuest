import { Link } from "react-router"
import ButtonStyles from "../utils/ButtonStyles"

const cardStyles = "bg-zinc-700 min-h-[200px] flex flex-col items-center gap-2 p-5 my-3 border-2 border-solid rounded-xl border-black"

//Use to show the index page

export default function Card({id,title,description,location}){
    return (
        <div className={cardStyles}>
            <h2>{title}</h2>
            <h4>{location}</h4>
            <h5>{description}</h5>
            <Link to={`/restaurants/${id}`} className={ButtonStyles} >Details</Link>
        </div>
    )
}