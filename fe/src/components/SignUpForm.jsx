import Input from "./Input"
import { useState } from "react"
import ButtonStyles from "../utils/ButtonStyles"
import { InpStyles, DivStyles } from "../utils/InpStyles"
import { Link } from "react-router"
import { createUserWithEmailAndPassword} from "firebase/auth"
import { auth } from "../firebase"

const formStyles = "flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-700 w-full max-w-xl mx-auto"
const redirectStyles = "text-sky-300 hover:text-yellow-300 font-thin"

export default function SignUpForm({toggle}) {
    const [data, setData] = useState({
        Name:"",
        Username: "",
        Password: ""
    })
    const [showPass,setShowPass] = useState(false);

    const TogglePassword = ()=>{
        setShowPass(showPass => !showPass);
    }

    const UpdData = (evt)=>{
        const tgt = evt.target.name;
        const val = evt.target.value;

        setData(old=>{
            return {...old,[tgt]:val};
        })
    }

    const HandleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, data.Username, data.Password);
            console.log("User signed up:", res.user);
            // nav("/"); // redirect after signup
        } catch (err) {
            console.error("Signup error:", err.message);
        }
    }

    return (
        <>
            <form className={formStyles} onSubmit={HandleSubmit}>
                <h1 className="text-4xl">Welcome</h1>
                <h1 className="text-lg text-grey-100 mb-5">Please enter your details: </h1>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={InpStyles} placeholder="Name" type="text" name="Name" id="Name" value={data.Name} />
                </div>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={InpStyles} placeholder="Email" type="text" name="Username" id="Username" value={data.Username} />
                </div>
                <div className={DivStyles}>
                    <input onChange={UpdData} className={InpStyles} placeholder="Password" type={showPass ? "text":"password"} name="Password" id="Password" value={data.Password} />
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
                <button className={ButtonStyles}>Sign Up</button>

                <p>Already have an account? <button onClick={()=>{toggle()}} className={redirectStyles}>Log in</button></p>

            </form>
        </>
    )
}
