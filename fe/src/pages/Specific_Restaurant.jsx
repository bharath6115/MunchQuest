import axios from "axios"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import ReviewForm from "../components/ReviewForm";
import ReviewHero from "../components/ReviewHero";
import Menu from "../components/Menu";
import { Loading } from "../components/Loading";
import RestaurantHero from "../components/RestaurantHero";
import toast from "react-hot-toast";
import RestaurantUpdate from "../components/RestaurantUpdate";

const Specific_Restaurant = () => {

    const { id } = useParams();
    const [restaurantData, setrestaurantData] = useState(null);
    const [editRestaurant, setEditRestaurant] = useState(false);
    const [reviewsData, setReviewsData] = useState([]);
    const [editReview, setEditReview] = useState({});
    const [newReview, setNewReview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isProcessing = useRef(false);
    const nav = useNavigate();

    const fetchReviews = async () => {
        axios.get(`/restaurants/${id}/reviews`)
            .then((res) => {
                setReviewsData(res.data);
                setNewReview(false);
                setIsLoading(false);
                isProcessing.current = false;
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
    }, [id])

    useEffect(() => {
        setIsLoading(false);
    }, [editRestaurant])

    const UpdRestaurant = () => {
        setEditRestaurant(true);
    }
    const VerifyRestaurant = () => {

        if (isProcessing.current) return;
        isProcessing.current = true;

        axios.post(`/restaurants/${id}?_method=PATCH`, { isVerified: true })
            .then((res) => {
                isProcessing.current = false;
                fetchRestaurant();
                console.log(res);
            })
            .catch(err => console.log(err));
    }

    const DelRestaurant = async () => {

        if (isProcessing.current) return;
        isProcessing.current = true;

        axios.post(`/restaurants/${id}?_method=DELETE`, {})
            .then((res) => {
                console.log("delted")
                isProcessing.current = false;
                nav("/restaurants")
                toast.success("Restaurant has been deleted.")
            })
            .catch(err => console.log(err));
    }
    const UpdReview = async (review_id) => {
        setEditReview(old => { return { ...old, [review_id]: true } })
        fetchRestaurant();
    }
    const DelReview = (review_id) => {

        if (isProcessing.current) return;
        isProcessing.current = true;

        axios.post(`/restaurants/${id}/reviews/${review_id}?_method=DELETE`)
            .then(() => {
                console.log("Review Deleted!")
                fetchReviews();
                fetchRestaurant();
                isProcessing.current = false;
                toast.success("Review has been deleted.")
            })
            .catch((err) => {
                console.log(err);
                nav("/error")
            })
    }

    const reviewsStyle = "bg-zinc-800 p-5 rounded-lg border border-zinc-700 hover:border-yellow-300 transition-all"
    const ButtonStyles = "border-2 text-black rounded-lg max-w-100 min-w-30 bg-sky-300 hover:bg-sky-500 px-3 py-1 my-3 transition-colors duration-150"
    const DangerButton = ButtonStyles.replace("bg-sky-300", "bg-red-400").replace("hover:bg-sky-500", "hover:bg-red-500")

    // console.log("Before editing:",editReview);

    if (isLoading) return <Loading />

    if (restaurantData) return (
        <>
            <div className="max-w-[1280px] w-5/6 text-white px-6 py-10 space-y-4">

                {
                    editRestaurant ?
                        <RestaurantUpdate restaurantData={restaurantData} setEditRestaurant={setEditRestaurant} id={id} fetchRestaurant={fetchRestaurant} />
                        :
                        <RestaurantHero restaurantData={restaurantData} UpdRestaurant={UpdRestaurant} DelRestaurant={DelRestaurant} VerifyRestaurant={VerifyRestaurant} id={id} />
                }

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
                                    <ReviewHero RestaurantOwner={restaurantData.owner} ReviewOwner={review.owner} UpdReview={UpdReview} DelReview={DelReview} rating={review.rating} message={review.message} id={review._id} />
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