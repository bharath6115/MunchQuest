import { useState, useRef  } from "react"
import ButtonStyles from "../utils/ButtonStyles"
import { Link, useNavigate } from "react-router"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import toast from "react-hot-toast"
import axios from "axios"

const formStyles = "flex flex-col gap-4 p-6 rounded-2xl bg-zinc-900 shadow-md border border-zinc-700 w-full max-w-xl mx-auto"
const redirectStyles = "text-sky-300 hover:text-yellow-300 font-thin"
const BaseStyles = "w-full px-4 py-2 rounded-xl border border-zinc-600 bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
const DivStyles = "flex flex-col gap-2 items-start"

export default function SignUpForm({ toggle }) {
    const [data, setData] = useState({
        Name: "",
        Email: "",
        Password: ""
    })
    const [showPass, setShowPass] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState({
        Name: "",
        Email: "",
        Password: ""
    });
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

        if (isProcessing) return;
        setIsProcessing(true);

        const newErrors = {}

        if (!data.Name) {
            newErrors.Name = "Name is required."
        }
        if (!data.Email) {
            newErrors.Email = "Email is required."
        } else if (!data.Email.includes("@gmail.com")) {
            newErrors.Email = "Email must contain the suffix '@gmail.com'"
        }
        if (!data.Password) {
            newErrors.Password = "Password is required."
        } else if (!/[A-Z]/.test(data.Password)) {
            newErrors.Password = "Password must have atleast 1 capital letter!"
        } else if (data.Password.length < 6) {
            newErrors.Password = "Password must be atleast 6 characters long!"
        }

        if (Object.keys(newErrors).length) {
            setError(newErrors);
            setIsProcessing(false);
            return;
        }

        HandleSubmit();
    }

    const HandleSubmit = async () => {
        try {
            const res = await createUserWithEmailAndPassword(auth, data.Email, data.Password);
            const user = res.user;

            await axios.post("/users", {
                username: data.Name,
                email: data.Email,
                uid: user.uid,
            });

            nav("/");
            toast.success("Successfully Signed Up!");
        } catch (err) {
            console.error("Signup error:", err.message);
            toast.error(err.message);
        } finally {
            setIsProcessing(false);
        }
    };




    const NameStyles = BaseStyles + (error.Name === undefined ? "" : (error.Name.length === 0 ? "" : " outline-2 outline-red-500"));
    const EmailStyles = BaseStyles + (error.Email === undefined ? "" : (error.Email.length === 0 ? "" : " outline-2 outline-red-500"));
    const PasswordStyles = BaseStyles + (error.Password === undefined ? "" : (error.Password.length === 0 ? "" : " outline-2 outline-red-500"));
    const errorStyles = "text-sm text-red-400"




    return (
        <>
            <form className={formStyles} onSubmit={ValidateData}>
                <h1 className="text-4xl">Welcome</h1>
                <h1 className="text-lg text-grey-100 mb-5">Please enter your details: </h1>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={NameStyles} placeholder="Name" type="text" name="Name" id="Name" value={data.Name} />
                    {error.Name && <span className={errorStyles}>{error.Name}</span>}
                </div>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={EmailStyles} placeholder="Email" type="text" name="Email" id="Email" value={data.Email} />
                    {error.Email && <span className={errorStyles}>{error.Email}</span>}
                </div>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={PasswordStyles} placeholder="Password" type={showPass ? "text" : "password"} name="Password" id="Password" value={data.Password} />
                    {error.Password && <span className={errorStyles}>{error.Password}</span>}
                </div>
                <div className="mt-3 flex items-center">
                    <div className="gap-1 flex flex-grow justify-start items-center">
                        <input onClick={TogglePassword} type="checkbox" name="ShowPassword" id="ShowPassword" />
                        <label htmlFor="ShowPassword">Show Password</label>
                    </div>
                    <div className="flex justify-end items-center">
                        {/* <Link to="#" className={redirectStyles}>Forgot Password?</Link> */}
                    </div>
                </div>
                <button className={ButtonStyles}>{isProcessing ? "Signing you up...":"Sign Up"}</button>

                <p>Already have an account? <button onClick={() => { toggle() }} className={redirectStyles}>Log in</button></p>

            </form>
        </>
    )
}
