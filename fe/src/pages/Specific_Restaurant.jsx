import axios from "axios"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import ButtonStyles from "../utils/ButtonStyles";
import ReviewForm from "../components/ReviewForm";
import ShowReview from "../components/ShowReview";
import { useAuth } from '../services/firebaseMethods';

const Specific_Restaurant = () => {

    const { id } = useParams();
    const { isLoggedIn, isAdmin, uid } = useAuth();
    const [restaurantData, setrestaurantData] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [editReview, setEditReview] = useState({});
    const [newReview, setNewReview] = useState(false);
    const nav = useNavigate();

    const fetchReviews = async () => {
        axios.get(`/restaurants/${id}/reviews`)
            .then((res) => {
                setReviewsData(res.data);
                setNewReview(false);
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
        axios.post(`/restaurants/${id}?_method=DELETE`, {})
            .then((res) => {
                console.log("delted")
                nav("/restaurants")
            })
            .catch(err => console.log(err));
    }
    const UpdReview = async (review_id) => {
        setEditReview(old => { return { ...old, [review_id]: true } })
        fetchRestaurant();
    }
    const DelReview = (review_id) => {
        axios.post(`/restaurants/${id}/reviews/${review_id}?_method=DELETE`)
            .then(() => {
                console.log("Review Deleted!")
                fetchReviews();
                fetchRestaurant();
            })
            .catch((err) => {
                console.log(err);
                nav("/error")
            })
    }

    const reviewsStyle = "bg-zinc-800 p-5 rounded-lg border border-zinc-700 hover:border-yellow-300 transition-all"
    const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")

    if (restaurantData) return (
        <>
            <div className="max-w-[1280px] w-5/6 text-white px-6 py-10 space-y-4">

                {/* Restaurant Card */}
                <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl space-y-2">
                    <h1>{restaurantData.title}</h1>
                    <h1>⭐{restaurantData.rating}/5</h1>
                    <h2>{restaurantData.location}</h2>
                    <h3>{restaurantData.description}</h3>
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