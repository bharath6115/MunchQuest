import axios from "axios"
import { useState, useEffect } from "react";
import Card from "../components/card";
import ErrorPage from "../pages/ErrorPage"
import { Loading } from "../components/Loading";
import { useNavigate } from "react-router";
import { useAuth } from "../services/firebaseMethods";
import toast from "react-hot-toast";
import { Link } from "react-router";


export default function VerifyPanel(){
    const {isAdmin} = useAuth();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const nav = useNavigate();
    const { uid, isLoggedIn } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
            axios.get("/restaurants/notVerified")
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
    if (isLoading) return <Loading />;
    if(!isAdmin) return <ErrorPage/>
    return (
        <>
            <div className="w-full flex flex-col flex-grow justify-start items-center">
                <h1 className="text-3xl my-7">Unverified Restaurants</h1>
                {!data.length && <p className="text-lg">No data to show!</p> }
            {data.map((val) => {
                return <Card img={val.images[0]} key={val["_id"]} id={val._id} title={val.title} description={val.description} location={val.location} />
            })}
            </div>
        </>
    )
}

