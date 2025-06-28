import axios from "axios"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import ButtonStyles from "../utils/ButtonStyles";

const Specific_Restaurant = () => {

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
                if(err.status===404){
                    nav("/error");
                }
            })
        }
        fetchData();
    },[])
    // console.log(data);

    const Upd = ()=>{
        nav(`/Restaurants/${id}/edit`);
    }
    const Del = async ()=>{
        axios.post(`/restaurants/${id}?_method=DELETE`,{})
        .then((res)=>{
            console.log("delted")
            nav("/restaurants")
        })
        .catch(err=>console.log(err));
    }

    const styles=" min-h-[400px] flex flex-col gap-3 items-center justify-center"
    const DangerButton = ButtonStyles.replace("bg-sky-300","bg-red-400").replace("hover:bg-sky-500","hover:bg-red-500")
    return (
        <div className={styles}>
            <h1>{data.title}</h1>
            <h2>{data.location}</h2>
            <h3>{data.description}</h3>
            <button className={ButtonStyles} onClick={Upd}>Update</button>
            <button className={DangerButton} onClick={Del}>Delete</button>
        </div>
    )
}

export default Specific_Restaurant