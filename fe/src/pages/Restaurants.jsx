import axios from "axios"
import { useState, useEffect } from "react";
import Card from "../components/card";
import { Loading } from "../components/Loading";
import { useNavigate } from "react-router";
import { useAuth } from "../services/firebaseMethods";
import toast from "react-hot-toast";


const Restaurants = () => {
    const [data, setData] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const nav = useNavigate();
    const {uid, isLoggedIn } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
            axios.get("/restaurants")
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

        fetchData();
    }, [])

    // console.log(data);
    if(isLoading) return <Loading/>;
    return (
        <>
        <h1 className="text-3xl my-7">All Restaurants</h1>
            {data.map((val) => {
                return <Card img={val.images[0]} key={val["_id"]} id={val._id} title={val.title} description={val.description} location={val.location} />
            })}
        </>
    )
}

export default Restaurants