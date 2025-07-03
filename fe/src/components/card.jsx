import { Link } from "react-router"
import ButtonStyles from "../utils/ButtonStyles"

const cardStyles = "bg-zinc-800 max-w-[1280px] w-5/6 min-h-[200px] gap-2 p-5 m-3 border-1 border-solid rounded-xl border-zinc-700 shadow-xl hover:border-yellow-300 flex flex-col items-center"

//Use to show the index page

export default function Card({ img, id, title, location, description }) {
  return (
    <div className={cardStyles}>
      <div className="flex flex-col lg:flex-row text-left gap-5 items-center justify-between">

        <img className="object-cover max-w-[200px] rounded-lg" src={img} alt="restaurant" />

        <div className="flex flex-col flex-grow items-start gap-2">
          <h2 className="text-2xl font-medium">{title}</h2>
          <p className="text-zinc-400">{location}</p>
          <p className="text-zinc-200">
            {description.length > 200
              ? description.slice(0, 200) + "…"
              : description}
          </p>
          <Link to={`/restaurants/${id}`}>
            <button className={ButtonStyles}>Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
