import { useEffect, useState } from "react"
import axios from "axios";


export const MenuForm = ({val,target,refresh}) => {
    const [Name,setName] = useState("");
    const [error,setError] = useState("");

    useEffect(()=>{
        setName(val);
        setError("");
    },[val]);

    const ValidateData = (e)=>{
        e.preventDefault();

        if(!Name){
            setError("Item name is required.")
            return;
        }

        HandleSubmit();
    }

    const HandleSubmit = async()=>{
        axios.post(target,{item:Name})
        .then((res)=>{
            console.log(res);
            setName("");
            refresh();
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const UpdName = (e)=>{
        setName(e.target.value)
    }

     const  BaseStyles = "w-50 px-2 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition flex-grow"
    
    const BorderStyles = (error.length===0 ? "" : " outline-2 outline-red-500");

    const InpStyles = BaseStyles + BorderStyles

    const ButtonStyles = "border-2 text-black rounded-lg max-w-100 bg-sky-300 hover:bg-sky-500 px-2 py-1 my-3 mx-auto transition-colors duration-150 text-md"

    return (
        <form onSubmit={ValidateData} className="flex items-center justify-between gap-2">
            {/* <label htmlFor="Name">Name: </label> */}
            <input className={InpStyles} onChange={UpdName} type="text" name="Name" id="Name" value={Name} />
            <button className={ButtonStyles}>Submit</button>
            {error && <span className="text-sm text-red-400">{error}</span>}
        </form>
    )
}
