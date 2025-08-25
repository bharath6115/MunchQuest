import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useAuth } from "../services/firebaseMethods"
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { MdOutlineFileUpload, MdCancel } from "react-icons/md";

export default function RestaurantUpdate({ restaurantData, setEditRestaurant, id, fetchRestaurant }) {
    const { isAdmin, uid } = useAuth();
    const nav = useNavigate();
    const [data, setData] = useState({
        title: "",
        location: "",
        description: "",
        reserveSeat: "",
    });
    const [error, setError] = useState({
        title: "",
        location: "",
        description: "",
        reserveSeat: "",
        images: "",
    });
    const [currImages, setCurrImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const textareaRef = useRef(null);
    const [isProcessing,setIsProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useLayoutEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = "auto"; // reset
            textarea.style.height = `${textarea.scrollHeight}px`; // set to fit content
        }
    }, [data.description]);

    useEffect(() => {
        setData({
            title: restaurantData.title || "",
            location: restaurantData.location || "",
            description: restaurantData.description || "",
            reserveSeat: restaurantData.reserveSeat || "",
        });
        setError({
            title: "",
            location: "",
            description: "",
            reserveSeat: "",
            images: "",
        });
        setCurrImages(restaurantData.images);
        setNewImages([]);
        setRemovedImages([]);
        setIsProcessing(false);
        setIsSubmitting(false);
    }, [restaurantData]);

    const removeExistingFile = (ind) => {
        const removed = currImages[ind];
        // console.log(currImages, ind);
        // console.log(removed);
        setRemovedImages(old => [...old, removed]);
        setCurrImages(old => old.filter((_, index) => index != ind));
    }

    const removeNewFile = async (index) => {
        setNewImages((old) => {
            return old.filter((_, ind) => ind != index);
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
        if (!data.reserveSeat) {
            newErrors.reserveSeat = "Reserve seat message is required.";
        } else if (data.reserveSeat.length > 25) {
            newErrors.reserveSeat = "Reserve seat message is too long!";
        }
        if (newImages.length + currImages.length == 0) {
            newErrors.images = "Atleast one image must be present.";
        }else if(newImages.length + currImages.length > 6){
            newErrors.images = "Cannot have more than 6 images.";
        }

        if (Object.keys(newErrors).length) {
            setError(newErrors);
            setIsProcessing(false);
            for (let e in newErrors) {
                toast.error(newErrors[e]);
            }
            return;
        }
        setIsSubmitting(true);
        HandleSubmit();
    }

    const HandleSubmit = async () => {

        //UPLOAD Newly added images to cloudinary
        const urls = currImages;

        // Get signature from backend
        const sigRes = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/getSignature`);
        const { timestamp, signature, api_key, cloud_name, folder } = sigRes.data;

        // Build form data of newly added images only.
        for (let img of newImages){
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

        //DELETE removed images from cloudinary
        //send be req thats it
        try{
            if(removedImages.length) await axios.post("/deleteImageInCloudinary",{removedImages});
        }catch(err){
            const status = err.response?.status;
            toast.error("Something went wrong! Please try again.");
            console.error("Submit error:", err);
        }

        //UPDATE restaurant info
        const payload = { ...data, images:urls };
        try {
            const res = await axios.post(`/restaurants/${id}?_method=PATCH`, payload);
            setData(res.data);
            fetchRestaurant();
            toast.success(`Restaurant updated sucessfully!`)
        } catch (err) {
            const status = err.response?.status;
            toast.error("Something went wrong! Please try again.");
            console.error("Submit error:", err);
            if (status === 404) return nav("/error");
        } finally {
            setIsProcessing(false);
            setIsSubmitting(false);
            setEditRestaurant(false);
        }
    }
    const UpdData = (e) => {
        const tgt = e.target.name;
        const val = e.target.value;

        setData((old) => {
            return { ...old, [tgt]: val };
        });
    }

    const ButtonStyles = "border-2 text-black rounded-lg max-w-100 min-w-30 bg-sky-300 hover:bg-sky-500 px-3 py-1 my-3 transition-colors duration-150"
    const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")

    const BaseStyles = "w-full rounded-sm border border-zinc-600 bg-zinc-800 text-zinc-100  focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
    const InputError = " outline-2 outline-red-500";

    const getInputClass = (field) => {
        if (error[field] === undefined) return "";
        if (error[field].length > 0) return InputError;
        return "";
    };

    return (
        <form onSubmit={ValidateData} className="flex flex-col items-center lg:flex-row bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl gap-6" encType="multipart/form-data">

            {/* image */}
            <div className="flex flex-col w-full max-w-[450px] lg:min-w-[400px] overflow-hidden rounded-lg">
                {/* upload image part */}
                <div className="relative w-full max-w-[450px] lg:min-w-[400px] overflow-hidden rounded-lg">
                    <label htmlFor="images" className={`w-full h-[200px] flex items-center justify-center mb-2 rounded-xl border-2 ${error?.images ? "border-red-500" : "border-zinc-600"} bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition cursor-pointer`}>
                        <input id="images" name="images" type="file" accept="image/*" multiple onChange={(e) => setNewImages(Array.from(e.target.files))} className="hidden" disabled={isProcessing}/>
                        <span className="text-gray-300">
                            {newImages.length == 0 ? <div className="flex flex-col md:flex-row items-center justify-center gap-1"> <MdOutlineFileUpload className="text-4xl md:text-2xl" /> Click to upload / Drag & Drop </div> : `Selected ${newImages.length} image${newImages.length == 1 ? "" : "s"}`}
                        </span>
                    </label>
                </div>

                <div className="flex gap-2 overflow-x-scroll">
                    {/* newly added images display */}
                    {newImages.map((file, index) => (
                        <div key={index} className="relative flex-shrink-0 rounded-lg overflow-hidden border shadow-sm flex items-center justify-center" >
                            <img src={URL.createObjectURL(file)} alt={file.name} className="w-[120px] object-cover rounded-lg" />
                            <button type="button" onClick={() => removeNewFile(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full bg-red-500 transition" disabled={isProcessing}> <MdCancel className="text-zinc-700 text-xl"/> </button>
                        </div>
                    ))}

                    {/* alr available images display */}
                    {currImages.map((src, ind) => (
                        <div key={ind} className="relative flex-shrink-0 rounded-lg overflow-hidden border shadow-sm flex items-center justify-center" >
                            <img key={ind} src={src.url} alt={`restaurant_image_${ind}`} className="w-[120px] object-cover rounded-lg" />
                            <button type="button" onClick={() => removeExistingFile(ind)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full bg-red-500 transition" disabled={isProcessing}> <MdCancel className="text-zinc-700 text-xl"/> </button>
                        </div>

                    ))}
                </div>
            </div>


            {/* restaurant details */}
            <div className="flex flex-col space-y-2 text-zinc-300 text-left flex-grow w-full">

                <h1 className="self-end text-yellow-300">⭐{restaurantData.rating.toFixed(1)}/5 <span className="text-zinc-300">({restaurantData.reviews.length})</span></h1>


                <input
                    name="title"
                    className={`${BaseStyles} ${getInputClass("title")} text-4xl pb-2`}
                    value={data.title}
                    onChange={UpdData}
                />

                <input
                    name="location"
                    className={`${BaseStyles} ${getInputClass("location")}  text-md mb-6`}
                    value={data.location}
                    onChange={UpdData}
                />

                <textarea
                    name="description"
                    className={`${BaseStyles} ${getInputClass("description")} my-4 min-h-[5rem] resize-none overflow-hidden`}
                    value={data.description}
                    onChange={UpdData}
                    ref={textareaRef}
                />

                <input
                    name="reserveSeat"
                    className={`rounded-sm border-2 border-black text-black bg-sky-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition w-60 ${getInputClass("reserveSeat")} self-start`}
                    value={data.reserveSeat}
                    onChange={UpdData}
                />

                <div className="justify-end flex flex-row ">
                    <button className={ButtonStyles}>{isSubmitting ? "Submitting...." : "Submit"}</button>
                    <button type="button" className={DangerButton} onClick={() => { setEditRestaurant(false) }} disabled={isProcessing}>Cancel</button>
                </div>
            </div>
        </form>
    )
}
