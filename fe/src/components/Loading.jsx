import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
export const Loading = () => {
    const [delayMessage, setDelayMessage] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => {
            setDelayMessage(true);
        }, 9000);
        return (() => { clearTimeout(id) })
    }, [])

    return (
        <div className='flex items-center justify-center gap-2 flex-col'>
            <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-yellow-400"></div>
            <div className='text-2xl'>Loading...</div>
            {delayMessage && <>
                <p className="text-yellow-300 mt-4 text-md italic">
                    Still loading... the server must be experiencing a cold start 🥶
                </p>
                <Link to='/faq#loading' className=" text-yellow-500 hover:underline underline-yellow-300"> Why is this happening?</Link>
            </>
            }
        </div>
    )
}
