import { useState, useRef } from "react"
import ButtonStyles from "../utils/ButtonStyles"
import { Link, useNavigate } from "react-router"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import toast from "react-hot-toast"

const formStyles = "flex flex-col gap-4 p-6 rounded-2xl bg-zinc-900 shadow-md border border-zinc-700 w-full max-w-xl mx-auto"
const redirectStyles = "text-sky-300 hover:text-yellow-300 font-thin"
const BaseStyles = "w-full px-4 py-2 rounded-xl border border-zinc-600 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
const DivStyles = "flex flex-col gap-2 items-start"

export default function LoginForm({ toggle }) {
    const [data, setData] = useState({
        Username: "",
        Password: ""
    })
    const [error, setError] = useState({ Username: "", Password: "" });
    const [showPass, setShowPass] = useState(false);
    const isProcessing = useRef(false)
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

    const ValidateData = (e) => {
        e.preventDefault();

        if (isProcessing.current) return;
        isProcessing.current = true;

        const newErrors = {}

        if (!data.Username) {
            newErrors.Username = "Username is required."
        }
        if (!data.Password) {
            newErrors.Password = "Password is required."
        }

        if (Object.keys(newErrors).length) {
            setError(newErrors);
            isProcessing.current = false;
            return;
        }

        HandleSubmit();
    }

    const HandleSubmit = async () => {

        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.Username, data.Password);
            // console.log("Logged in:", userCredential.user.uid);
            nav("/");
            toast.success("Login successful!")
        } catch (err) {
            console.error(err);
            toast.error("Invalid credentials");
            setError({ "Auth": "Incorrect Username/Password!" });
        } finally {
            isProcessing.current = false;
        }
    }


    const UsernameStyles = BaseStyles + (error.Username === undefined ? "" : (error.Username.length === 0 ? "" : " outline-2 outline-red-500"));
    const PasswordStyles = BaseStyles + (error.Password === undefined ? "" : (error.Password.length === 0 ? "" : " outline-2 outline-red-500"));
    const errorStyles = "text-sm text-red-400"



    return (
        <>
            <form className={formStyles} onSubmit={ValidateData}>
                <h1 className="text-4xl">Welcome Back!</h1>
                <h1 className="text-lg text-grey-100 mb-2">Please login into your account</h1>
                {error.Auth && <span className={errorStyles}> {error.Auth}</span>}
                <div className={DivStyles}>
                    <input onChange={UpdData} className={UsernameStyles} placeholder="Email" type="text" name="Username" id="Username" value={data.Username} />
                    {error.Username && <span className={errorStyles}>{error.Username}</span>}
                </div>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={PasswordStyles} placeholder="Password" type={showPass ? "text" : "password"} name="Password" id="Password" value={data.Password} />
                    {error.Password && <span className={errorStyles}>{error.Password}</span>}
                </div>
                <div className="mt-1 flex items-center">
                    <div className="gap-1 flex flex-grow justify-start items-center">
                        <input onClick={TogglePassword} type="checkbox" name="ShowPassword" id="ShowPassword" />
                        <label htmlFor="ShowPassword">Show Password</label>
                    </div>
                    <div className="flex justify-end items-center">
                        <Link to="#" className={redirectStyles}>Forgot Password?</Link>
                    </div>
                </div>
                <button className={ButtonStyles}>{isProcessing.current ? "Logging in..." : "Login"}</button>

                <p>Dont have an account? <button onClick={() => { toggle() }} className={redirectStyles}>Sign up</button></p>

            </form>
        </>
    )
}
