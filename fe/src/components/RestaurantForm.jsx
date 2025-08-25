import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import Input from "./Input"
import axios from "axios"
import ButtonStyles from "../utils/ButtonStyles"
import formStyles from "../utils/FormStyles"
import { useAuth } from "../services/firebaseMethods"
import toast from "react-hot-toast"
import { Loading } from "./Loading"
import { MdCancel } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";

const RestaurantForm = ({ title = "", location = "", description = "" }) => {
    const { uid, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();


    const [data, setData] = useState({
        title: title,
        location: location,
        description: description,
    })
    const [error, setError] = useState({
        title: "",
        location: "",
        description: "",
        images: "",
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const removeFile = async (index)=>{
        setImages((old)=>{
            return old.filter((img,ind)=>ind!=index);
        })
    }


    //useEffect to sync the state with the props every time props change.
    useEffect(() => {
        setData({ title, location, description })
        setError({ title: "", location: "", description: "", images: "" })
        setIsProcessing(false);
        setIsLoading(false);
        (setImagesimg,ind)=>ind!=index
;    }, [title, location, description])

    const updData = (evt) => {
        const target = evt.target.name
        const val = evt.target.value
        setData(old => {
            return { ...old, [target]: val }
        })
    }

    const ValidateData = (e) => {
        e.preventDefault();

        if (isProcessing) return;
        setIsProcessing(true);

        const newErrors = {}

        if (!data.title) {
            newErrors.title = "Title is required.";
        } else if (data.title.length < 5) {
            newErrors.title = "Title must be longer than 5 characters";
        }
        if (!data.location) {
            newErrors.location = "Location is required.";
        } else if (data.location.length < 5) {
            newErrors.location = "Location must be longer than 5 characters";
        }
        if (!data.description) {
            newErrors.description = "Description is required.";
        } else if (data.description.length < 5) {
            newErrors.description = "Description must be longer than 5 characters";
        }
        if (!images.length) {
            newErrors.images = "Image(s) required.";
        } else if (images.length > 5) {
            newErrors.images = "Cannot uplaod more than 5 images.";
        }

        if (Object.keys(newErrors).length) {
            setError(newErrors);
            setIsProcessing(false);
            return;
        }

        HandleSubmit();
    }

    const HandleSubmit = async () => {

        //UPLOAD IMAGES TO CLOUDINARY
        const urls = [];

        // Get signature from backend
        const sigRes = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/getSignature`);
        const { timestamp, signature, api_key, cloud_name, folder } = sigRes.data;

        // Build form data
        for (let img of images) {
            const cloudinaryPayload = new FormData();
            cloudinaryPayload.append("file", img);
            cloudinaryPayload.append("api_key", api_key);
            cloudinaryPayload.append("timestamp", timestamp);
            cloudinaryPayload.append("signature", signature);
            cloudinaryPayload.append("folder", folder);

            // Upload to Cloudinary
            const cloudRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, cloudinaryPayload);
            urls.push({url:cloudRes.data.url, id:cloudRes.data.public_id});
        }

        const payload = { ...data };
        payload["owner"] = uid;
        payload["rating"] = 0;
        payload["images"] = urls;
        payload["reserveSeat"] = "Reserve a seat";
        payload["isVerified"] = false;
        axios.post("/restaurants", payload)
            .then((res) => {
                setIsProcessing(false);
                navigate(`/restaurants/${res.data._id}`)
                toast.success(`Restaurant added sucessfully!`)
            })
            .catch(err => {
                setIsProcessing(false);
                const status = err.response?.status;

                toast.error("Something went wrong! Please try again.");
                console.error("Submit error:", err);
                if (status === 404) return navigate("/error");
            })
    }

    if (isLoading) return <Loading />
    if (!isLoggedIn) return <h1>Must be logged in!</h1>
    const BaseStyles = "w-full px-4 py-2 rounded-xl border border-zinc-600 bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-zinc-100  focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
    const BorderStyles = (error["images"] === undefined ? " outline-2 outline-green-500" : (error["images"].length === 0 ? "" : " outline-2 outline-red-500"));
    const InpStyles = BaseStyles + BorderStyles
    return (
        <>
            <form onSubmit={ValidateData} className={formStyles} encType="multipart/form-data">
                <button type="button" onClick={() => { navigate("/restaurants") }} className="p-0 m-0 self-end text-md hover:text-red-500" disabled={isProcessing}>Cancel</button>
                <h1 className="text-3xl">Add new restaurant</h1>
                {Object.entries(data).map(([key, value]) => {
                    return <Input
                        key={key}
                        name={key}
                        value={value}
                        fn={updData}
                        error={error[key]}
                    />
                })}
                <div className="flex flex-col gap-1 w-full">
                    <h1 className="self-start font-medium mb-2">Image(s): </h1>
                    <label htmlFor="images" className={InpStyles} >
                        <input id="images" name="images" type="file" accept="image/*" multiple className="hidden" onChange={(e) => setImages(Array.from(e.target.files))} disabled={isProcessing}/>
                        <span className="text-gray-300">
                            {images.length == 0 ? <div className="flex items-center justify-center gap-2"> <MdOutlineFileUpload  className="text-2xl"/> Click to upload / Drag & Drop </div> : `Selected ${images.length} image${images.length == 1 ? "" : "s"}`}
                        </span>
                    </label>
                    {error["images"] && <span className="text-sm text-red-400 self-start">{error["images"]}</span>}
                    {images && images.length > 0 && (
                        <div className="mt-2 flex flex-row gap-2 overflow-x-scroll p-1">
                            {images.map((file, index) => (
                                <div key={index} className="relative flex-shrink-0 h-30 rounded-lg overflow-hidden border shadow-sm" >
                                    <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover w-full h-full" />
                                    <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full bg-red-500 transition" disabled={isProcessing}> <MdCancel className="text-zinc-700 text-xl"/> </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className={ButtonStyles} disabled={isProcessing} type="submit">{isProcessing ? "Submitting..." : "Submit"}</button>
            </form>
        </>
    )
}

export default RestaurantForm