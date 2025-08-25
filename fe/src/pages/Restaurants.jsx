import axios from "axios"
import { useState, useEffect } from "react";
import Card from "../components/card";
import { Loading } from "../components/Loading";
import { useNavigate } from "react-router";
import { useAuth } from "../services/firebaseMethods";
import toast from "react-hot-toast";
import { Link } from "react-router";


const Restaurants = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const nav = useNavigate();
    const { uid, isLoggedIn } = useAuth();

    const fetchData = async (target) => {
        axios.get(target)
            .then((res) => {
                setData(res.data)
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err)
                if (err.status === 404) {
                    nav("/error")
                    toast.error(err);
                }
            });
    }

    useEffect(() => {
        fetchData("/restaurants/verified");
    }, [])


    const SliderStyle = "border border-zinc-500 px-3 py-1"

    // console.log(data);
    if (isLoading) return <Loading />;
    return (
        <>
            <div className="w-5/6 max-w-[1280px] flex justify-between items-center mt-2">
                <div className="flex items-center justify-center text-sm sm:text-xl">
                    <button className={`${SliderStyle} rounded-l-lg ${showAll ? "" : "bg-zinc-700"}`} onClick={() => { fetchData("/restaurants/verified"); setShowAll(false); }} >Verified </button>
                    <button className={`${SliderStyle} rounded-r-lg ${showAll ? "bg-zinc-700" : ""}`} onClick={() => { fetchData("/restaurants"); setShowAll(true); }} >All </button>
                    <span className="ml-1 text-xl sm:text-2xl">Restaurants</span>
                </div>
                <Link to="/restaurants/new" className="text-lg text-sky-300 font-thin hover:text-yellow-400">+ Add New</Link>
            </div>
            {data.map((val) => {
                return <Card img={val.images[0]} key={val["_id"]} id={val._id} title={val.title} description={val.description} location={val.location} />
            })}
        </>
    )
}

export default Restaurants