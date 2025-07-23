import { Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useAuth } from "../services/firebaseMethods";

export default function ProfileCard({data}) {
    const {uid} = useAuth();
    return (
        <div className="absolute flex flex-col top-12 right-2 md:right-5 bg-zinc-750 rounded-lg px-3 py-2 ">
            <h1>Hello, <span className="text-yellow-300">{data.username}</span></h1>
            <Link to={`/profile/${uid}`}>Profile</Link>
            <Link to="/" onClick={async () => { await signOut(auth) }} className="text-bold hover:text-yellow-300 text-white "> Log out </Link>
        </div>
    )
}
