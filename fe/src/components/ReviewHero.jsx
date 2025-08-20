import { useAuth } from "../services/firebaseMethods.jsx";
import { useState } from "react";

export default function ReviewHero({ UpdReview, DelReview, rating, message, id, RestaurantOwner, ReviewOwner }) {
    const { isLoggedIn, isAdmin, uid } = useAuth();
    const [shouldDisable,setShouldDisable] = useState(false);
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-300 font-semibold">⭐ {rating}/5</span>
                <span className="text-sm text-zinc-400">Anonymous</span>
            </div>
            <div className="flex">
                <p className="flex-grow text-zinc-200">"{message}"</p>

                {/* show the UD options only to admins, user who made the review. */}
                <div className="space-x-2 flex flex-row items-end">
                    {(isAdmin || uid == ReviewOwner) &&
                        <>
                            <button onClick={() => { UpdReview(id) }} className="text-sky-300 hover:text-sky-500 font-thin font-thin" disabled={shouldDisable}>Update</button>
                            <button onClick={() => { setShouldDisable(true); DelReview(id) }} className="text-red-400 hover:text-red-600 font-thin font-thin" disabled={shouldDisable}>Delete</button>
                        </>
                    }
                </div>
            </div>
        </>
    )
}