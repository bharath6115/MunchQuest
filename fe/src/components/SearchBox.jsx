import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function LoadingCircle() {
    return (
        <div className="w-[17px] h-[17px] border-yellow-300 border-t-2 border-b-2 rounded-full animate-spin">

        </div>
    )
}

export default function SearchBox({ setSearchOpen }) {

    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSearchOpen(false);
                document.activeElement.blur();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => { window.removeEventListener("keydown", handleKeyDown); }

    }, [setSearchOpen]);

    //debounce -> wait till user gives a break from typing to prevent overwhileming server: works well for fast internet, tackle race conditions while loading data.
    useEffect(() => {

        if (!query.length) {
            setData([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);

        const source = axios.CancelToken.source();
        const id = setTimeout(() => {

            axios.get(`/restaurants/queries?query=${query}`, { cancelToken: source.token })
                .then((res) => {
                    setData(res.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        // Request canceled, ignore
                        console.log('Request canceled', err.message);
                    } else {
                        toast.error(err.response?.request?.response || "Error");
                    }
                });
        }, 250)

        return (() => { clearTimeout(id); source.cancel();})

    }, [query])


    return (
        <div
            className="absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-blur z-100 backdrop-blur-xs"
            onClick={() => setSearchOpen(false)}
        >
            <div className="w-9/10 sm:w-1/2 h-11/20 bg-zinc-750 rounded-xl" onClick={(e) => e.stopPropagation()}>

                {/* searchbar */}
                <form onSubmit={(e) => { e.preventDefault() }} className="flex items-center justify-center gap-2 px-3 py-1 border-b-2 border-zinc-600">
                    <label htmlFor="query" className="text-lg">{isLoading ? <LoadingCircle /> : <IoSearch />}</label>
                    <input type="text" name="query" id="query" placeholder="Search" className="w-full px-1 py-2 text-zinc-100 focus:outline-none transition" value={query} onChange={(e) => { setQuery(e.target.value) }} autoFocus />
                </form>

                {/* rendered data */}
                <div className="flex flex-col h-86 items-center justify-start text-left px-3 overflow-auto">
                    {data.map((val) => {
                        return (
                            <Link to={`/restaurants/${val._id}`} key={val._id} className="text-lg bg-zinc-700 hover:bg-zinc-800 w-full rounded-lg mt-2 py-1 px-1" onClick={() => { setSearchOpen(false) }}>
                                <h1>{val.title}</h1>
                            </Link>
                        )
                    })}
                    {data.length === 0 && <h1 className="font-thin text-2xl my-auto">No data available!</h1> }
                </div>
            </div>
        </div>
    )
}
