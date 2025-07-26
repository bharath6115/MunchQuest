import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Loading } from "../components/Loading";
import { useAuth } from "../services/firebaseMethods";

export default function Profile() {
    const { uid } = useParams();
    const location = useLocation();
    const { isAdmin } = useAuth();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/users/${uid}`);
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            toast.error("Failed to load profile.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [location]);

    if (isLoading) return <Loading />;

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500 text-xl">User not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg min-w-md mx-auto my-auto p-6 bg-zinc-800 rounded-2xl shadow-xl border border-zinc-700 text-zinc-100">
            <div className="flex flex-col items-center gap-4">
                {/* Profile Image */}
                <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center text-3xl font-bold text-zinc-400">
                    {data.username?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* User details */}
                <h1 className="text-2xl font-semibold">{data.username}</h1>
                <p className="text-sm text-zinc-400">{data.email}</p>
            </div>

            {isAdmin &&
                <div className="mt-6 border-t border-zinc-700 pt-4 text-sm text-zinc-400 flex flex-col gap-1">
                    <p><span className="font-medium text-zinc-300">User ID:</span> {uid}</p>
                </div>
            }
        </div>

    );
}
