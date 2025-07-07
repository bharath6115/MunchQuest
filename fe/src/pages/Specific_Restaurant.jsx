import axios from "axios"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import ReviewForm from "../components/ReviewForm";
import ShowReview from "../components/ShowReview";
import { useAuth } from '../services/firebaseMethods';
import Menu from "../components/Menu";
import { Loading } from "../components/Loading";

const Specific_Restaurant = () => {

    const { id } = useParams();
    const { isLoggedIn, isAdmin, uid } = useAuth();
    const [restaurantData, setrestaurantData] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [editReview, setEditReview] = useState({});
    const [newReview, setNewReview] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const [isProcessing,setIsProcessing] = useState(false);
    const nav = useNavigate();

    const fetchReviews = async () => {
        axios.get(`/restaurants/${id}/reviews`)
            .then((res) => {
                setReviewsData(res.data);
                setNewReview(false);
                setIsLoading(false);
                setIsProcessing(false);
                setEditReview(old => {
                    const obj = { ...old }
                    res.data.forEach((review) => { obj[review._id] = false })   //Reset the edit status for each everytime we fetch reviews
                    return obj;
                })
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

    const UpdRestaurant = () => {
        nav(`/Restaurants/${id}/edit`);
    }
    const DelRestaurant = async () => {
        
        if(isProcessing) return;
        setIsProcessing(true);
        
        axios.post(`/restaurants/${id}?_method=DELETE`, {})
            .then((res) => {
                console.log("delted")
                setIsProcessing(false);
                nav("/restaurants")
            })
            .catch(err => console.log(err));
    }
    const UpdReview = async (review_id) => {
        setEditReview(old => { return { ...old, [review_id]: true } })
        fetchRestaurant();
    }
    const DelReview = (review_id) => {
        
        if(isProcessing) return;
        setIsProcessing(true);

        axios.post(`/restaurants/${id}/reviews/${review_id}?_method=DELETE`)
            .then(() => {
                console.log("Review Deleted!")
                fetchReviews();
                fetchRestaurant();
                setIsProcessing(false);
            })
            .catch((err) => {
                console.log(err);
                nav("/error")
            })
    }

    const reviewsStyle = "bg-zinc-800 p-5 rounded-lg border border-zinc-700 hover:border-yellow-300 transition-all"
    const ButtonStyles = "border-2 text-black rounded-lg max-w-100 min-w-30 bg-sky-300 hover:bg-sky-500 px-3 py-1 my-3 transition-colors duration-150"
    const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")

    // console.log(restaurantData);

    if(isLoading) return <Loading/>

    if (restaurantData) return (
        <>
            <div className="max-w-[1280px] w-5/6 text-white px-6 py-10 space-y-4">

                {/* Restaurant Card */}
                <div className="flex flex-col items-center lg:flex-row bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl gap-6">
                    <div className="lg:min-w-[400px]">
                        <img className="rounded-lg object-cover" src={restaurantData.images[0]} alt="restaurant" />
                    </div>
                    <div className="flex flex-col space-y-2 text-zinc-300 text-left flex-grow w-full">

                        <h1 className="self-end text-yellow-300">⭐{restaurantData.rating.toFixed(1)}/5 <span className="text-zinc-300">({restaurantData.reviews.length})</span></h1>
                        <h1 className="text-4xl">{restaurantData.title}</h1>
                        <h2 className="text-md mb-6">{restaurantData.location}</h2>
                        <h3 className="my-4">{restaurantData.description}</h3>
                        <button className="border-2 text-black rounded-lg bg-sky-400 hover:bg-yellow-300 px-3 py-1 w-35 transition-colors duration-150"> Reserve a seat </button>
                        <div className="mt-auto flex flex-row justify-end">
                            {
                                (isAdmin || uid == restaurantData.owner)
                                &&
                                <button className={ButtonStyles} onClick={UpdRestaurant}>Update</button>
                            }
                            {
                                (isAdmin || uid == restaurantData.owner)
                                &&
                                <button className={DangerButton} onClick={DelRestaurant}>Delete</button>
                            }
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <Menu owner={restaurantData.owner} id={id} />

                {/* Reviews Section */}
                <div className="border-t-1 border-zinc-600 space-y-4 pt-4">
                    <div className="flex items-center justify-between pt-4 pb-2">
                        <h2 className="text-4xl font-semibold text-yellow-300">✨Reviews</h2>
                        <button className="btn text-sky-300 hover:text-yellow-300 font-thin text-md" onClick={() => { setNewReview(old => !old) }}>{(newReview ? "X Cancel" : "+ Add Review")}</button>
                    </div>

                    {newReview && <ReviewForm title="Add a review" rating="" message="" target={`/restaurants/${id}/reviews/`} updateReviews={fetchReviews} updateRestaurant={fetchRestaurant} />}

                    {/* Review Card */}
                    {reviewsData.map((review) => {
                        return (
                            <div key={review._id} className={reviewsStyle}>{
                                !editReview[review._id] ? //currently not in EDIT state? then render the review else render the edit
                                    <ShowReview RestaurantOwner={restaurantData.owner} ReviewOwner={review.owner} UpdReview={UpdReview} DelReview={DelReview} rating={review.rating} message={review.message} id={review._id} />
                                    :
                                    <ReviewForm rating={review.rating} message={review.message} target={`/restaurants/${id}/reviews/${review._id}/?_method=PATCH`} updateReviews={fetchReviews} updateRestaurant={fetchRestaurant} />
                            }</div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Specific_Restaurant