import { Link } from "react-router"

export default function ShowReview({UpdReview,DelReview,rating,message,id}) {
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-300 font-semibold">⭐ {rating}/5</span>
                <span className="text-sm text-zinc-400">Anonymous</span>
            </div>
            <div className="flex">
                <p className="flex-grow text-zinc-200">"{message}"</p>

                <div className="space-x-2 flex flex-row items-end">
                    <Link onClick={() => { UpdReview(id) }} className="text-sky-300 hover:text-sky-500 font-thin font-thin">Update</Link>
                    <Link onClick={() => { DelReview(id) }} className="text-red-400 hover:text-red-600 font-thin font-thin">Delete</Link>
                </div>
            </div>
        </>
    )
}