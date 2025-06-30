import { useState } from "react"
import ButtonStyles from "../utils/ButtonStyles"
import { InpStyles, DivStyles } from "../utils/InpStyles"
import { Link, useNavigate } from "react-router"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

const formStyles = "flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-700 w-full max-w-xl mx-auto"
const redirectStyles = "text-sky-300 hover:text-yellow-300 font-thin"

export default function LoginForm({toggle}) {
    const [data, setData] = useState({
        Username: "",
        Password: ""
    })
    const [showPass, setShowPass] = useState(false);
    const nav = useNavigate();

    const TogglePassword = () => {
        setShowPass(showPass => !showPass);
    }

    const UpdData = (evt) => {
        const tgt = evt.target.name;
        const val = evt.target.value;

        setData(old => {
            return { ...old, [tgt]: val };
        })
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.Username, data.Password);
            console.log("Logged in:", userCredential.user.uid);
            nav("/");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <form className={formStyles} onSubmit={HandleSubmit}>
                <h1 className="text-4xl">Welcome Back!</h1>
                <h1 className="text-lg text-grey-100 mb-5">Please login into your account</h1>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={InpStyles} placeholder="Email" type="text" name="Username" id="Username" value={data.Username} />
                </div>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={InpStyles} placeholder="Password" type={showPass ? "text" : "password"} name="Password" id="Password" value={data.Password} />
                </div>
                <div className="mt-3 flex items-center">
                    <div className="gap-1 flex flex-grow justify-start items-center">
                        <input onClick={TogglePassword} type="checkbox" name="ShowPassword" id="ShowPassword" />
                        <label htmlFor="ShowPassword">Show Password</label>
                    </div>
                    <div className="flex justify-end items-center">
                        <Link to="#" className={redirectStyles}>Forgot Password?</Link>
                    </div>
                </div>
                <button className={ButtonStyles}>Login</button>

                <p>Dont have an account? <button onClick={()=>{toggle()}} className={redirectStyles}>Sign up</button></p>

            </form>
        </>
    )
}
