import RestaurantForm from "../components/RestaurantForm"
import { useParams } from "react-router"
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Edit_Restaurant = () => {
    
    const {id} = useParams();
    const [data,setData] = useState({});
    const nav = useNavigate();
    
    useEffect(()=>{
        const fetchData = async ()=>{
            await axios.get(`/restaurants/${id}`)
            .then((res)=>{
                setData(res.data);
            })
            .catch(err=>{
                console.log(err)
                if(err.status === 404) nav("/error")
            })
        }
        fetchData();
    },[])

    return (
        <RestaurantForm Heading="Edit restaurant" title={data.title} location={data.location} description={data.description} target={`/restaurants/${id}?_method=PATCH`} />
    )
}

export default Edit_Restaurant