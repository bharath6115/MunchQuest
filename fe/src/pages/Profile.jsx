import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router"
import { Loading } from "../components/Loading";
import axios from "axios";

export default function Profile() {
    const {uid} = useParams();
    const [data,setData] = useState({});
    const [isLoading,setIsLoading] = useState(true);
    const location = useLocation();

    const fetchData = async()=>{
        try{
            const res = await axios.get(`/users/${uid}`)
            setData(res.data);
            console.log(res.data)
        }catch(err){
            console.log(err);
            // toast.error(err);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchData();
    },[location])
    
    if(isLoading) return <Loading/>
    return (
        <h1>Hello, {data.username}</h1>
    )
}
