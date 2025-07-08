import banner from "../../public/banner.jpg"
import { Link } from "react-router"
const Home = () => {
    return (
        <>
            <img src={banner} alt="Restaurant" className="opacity-60 object-cover mask-linear-to-200% w-screen  h-[calc(100vh-4rem)]" fetchPriority="high" />
            <div className=" absolute top-50 mx-auto text-white space-y-4 flex flex-col items-center">

                <h1 className="text-6xl">Welcome to <span className="text-yellow-300">MunchQuest</span></h1>
                <h1 className="text-2xl">Quest for the perfect meal</h1>
                <Link to='/restaurants' className="space-y-2 px-4 py-2 rounded-xl bg-yellow-300 text-zinc-900 hover:bg-yellow-400 font-semibold transition">Explore</Link>

            </div>
        </>
    )
}

export default Home