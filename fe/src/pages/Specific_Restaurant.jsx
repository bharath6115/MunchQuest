import axios from "axios"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import ButtonStyles from "../utils/ButtonStyles";
import { IoAddSharp } from "react-icons/io5";
import CreateReview from "../components/createReview";

const Specific_Restaurant = () => {

    const { id } = useParams();
    const [restaurantData, setrestaurantData] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [newReview,setNewReview] = useState(false);
    const nav = useNavigate();

    const fetchReviews = async () => {
        axios.get(`/restaurants/${id}/reviews`)
            .then((res) => {
                setReviewsData(res.data);
            })
            .catch(err => {
                console.log("Error fetching reviews", err)
                if (err.status === 404) {
                    nav("/error");
                }
            })
    }
    const fetchRestaurant = async () => {
        axios.get(`/restaurants/${id}`)
            .then((res) => {
                setrestaurantData(res.data);
            })
            .catch(err => {
                console.log("Error fetching restaurant", err)
                if (err.status === 404) {
                    nav("/error");
                }
            })
    }
    useEffect(() => {
        fetchRestaurant();
        fetchReviews();
    }, [])

    const Upd = () => {
        nav(`/Restaurants/${id}/edit`);
    }
    const Del = async () => {
        axios.post(`/restaurants/${id}?_method=DELETE`, {})
            .then((res) => {
                console.log("delted")
                nav("/restaurants")
            })
            .catch(err => console.log(err));
    }

    const reviewsStyle = "bg-zinc-800 p-5 rounded-lg border border-zinc-700 hover:border-yellow-300 transition-all"
    const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")
    const redirectStyles = "text-sky-300 hover:text-yellow-300 font-thin text-md"
    // console.log(newReview)
    if (restaurantData) return (
        <>
            <div className="max-w-[1280px] w-5/6 text-white px-6 py-10 space-y-4">

                {/* Restaurant Card */}
                <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl space-y-2">
                    <h1>{restaurantData.title}</h1>
                    <h2>{restaurantData.location}</h2>
                    <h3>{restaurantData.description}</h3>
                    <button className={ButtonStyles} onClick={Upd}>Update</button>
                    <button className={DangerButton} onClick={Del}>Delete</button>
                </div>

                {/* Reviews Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <h2 className="flex-grow text-3xl font-semibold text-yellow-300">Reviews</h2>
                        <p className={redirectStyles} to="#" onClick={()=>{setNewReview(old=>!old)}}>{(newReview ? "X Cancel" : "+ Add Review")}</p>
                    </div>
                    {newReview &&
                        <CreateReview updateReviews={fetchReviews} reset={setNewReview}/>
                    }

                    {/* Review Card */}
                    {reviewsData.map((review) => (
                        <div key={review._id} className={reviewsStyle}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-yellow-300 font-semibold">⭐ {review.rating}/5</span>
                                <span className="text-sm text-zinc-400">Anonymous</span>
                            </div>
                            <div className="flex">
                                <p className="flex-grow text-zinc-200">{review.message}</p>
                                <Link className="text-sky-300 hover:text-yellow-300 font-thin font-thin flex flex-col justify-end" to="#">&gt;More</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Specific_Restaurant