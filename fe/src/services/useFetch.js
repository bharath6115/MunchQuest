import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function useFetch(path) {
    const [data, setData] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const fetchD = async () => {
            axios.get(path)
                .then((res) => {
                    console.log(res.data);
                    setData(res.data)
                })
                .catch(err => {
                    console.log(err)
                    if (err.status === 404) nav("/error")
                })
        }
        fetchD();
    }, [path])

    return data;
}