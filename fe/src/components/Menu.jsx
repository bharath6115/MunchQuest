import { MenuForm } from "./MenuForm";
import { useEffect, useState } from "react";
import { MdExpandLess, MdExpandMore, MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { useAuth } from "../services/firebaseMethods";

export default function Menu({ owner, id }) {

    const { uid, isAdmin } = useAuth();
    const [data, setData] = useState([]);
    const [menuExpand, setMenuExpand] = useState(false);
    const [canAddNew, setCanAddNew] = useState(false);
    const [showEdit, setShowEdit] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const FetchMenu = async () => {
        axios.get(`/restaurants/${id}/menu`)
            .then((d) => {
                // console.log(d.data);
                setData(d.data);
                setShowEdit(Array(d.data.length).fill(false));
                setCanAddNew(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        FetchMenu();
        setIsProcessing(false);
    }, [id])

    const handleEdit = (id) => {
        setShowEdit(old => {
            const arr = [...old];
            arr[id] = true;
            return arr;
        })
    }

    const handleDelete = async (Itemid) => {
        
        if(isProcessing) return;
        setIsProcessing(true);

        axios.post(`restaurants/${id}/menu/${Itemid}?_method=DELETE`)
            .then(() => {
                console.log("deleted Item");
                setIsProcessing(false);
                FetchMenu();
            })
            .catch((err) => {
                console.log(err);
            })
            
    }


    return (
        <div>

            {/* Menu dropdown */}
            <div className="text-2xl cursor-pointer flex items-center justify-between pt-4 border-t-1 border-zinc-500" onClick={() => { setMenuExpand(old => !old) }}>
                <p>Menu</p>
                <p className="pt-2">{menuExpand ? <MdExpandLess /> : <MdExpandMore />}</p>
            </div>

            {/* MenuExpand */}
            {menuExpand &&
                <div className="text-left overflow-hidden flex flex-col gap-1 mt-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    {data.map((item, ItemID) => {
                        return (
                            <div key={ItemID} className="flex items-center justify-between px-2 py-1 hover:bg-zinc-700 rounded-md transition-colors">
                                {
                                    showEdit[ItemID]
                                        ?
                                        <MenuForm refresh={FetchMenu} val={item} target={`restaurants/${id}/menu/${ItemID}?_method=PATCH`} />
                                        :
                                        <div className="flex flex-row items-center gap-2 text-lg text-zinc-200">

                                            {
                                                (isAdmin || owner === uid)
                                                &&
                                                <>
                                                    <button className="px-1 text-red-400 hover:text-red-600 transition-colors" onClick={() => handleDelete(ItemID)}><MdDelete /></button>
                                                    <button className="px-1 text-sky-400 hover:text-sky-600 transition-colors" onClick={() => handleEdit(ItemID)}><TbEdit /></button>
                                                </>
                                            }

                                            <p>{item}</p>
                                        </div>
                                }
                            </div>
                        )
                    })}

                    {
                        (isAdmin || owner === uid)
                        &&
                        <>
                            <button className="text-md font-thin text-sky-300 hover:text-yellow-400 mt-3 self-start transition" onClick={() => { setCanAddNew(old => !old) }}> {canAddNew ? "X Cancel" : "+ Add new item"} </button>
                            {canAddNew && <MenuForm refresh={FetchMenu} val="" target={`restaurants/${id}/menu`} />}
                        </>
                    }


                </div>
            }
        </div>
    )
}