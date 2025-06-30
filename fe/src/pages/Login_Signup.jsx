import { useState } from 'react'
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { useAuth } from '../services/firebaseMethods';

export const Login_Signup = () => {
    const {isLoggedIn} = useAuth();
    if(isLoggedIn) return <h1>Horray you have logged in sucessfully!</h1>
    const [Login,setLogin] = useState(true);

    const toggleForm = ()=>{
        setLogin(old=>!old);
    }

    return (
        <>
        {Login && <LoginForm toggle = {toggleForm}/>}
        {!Login && <SignUpForm toggle = {toggleForm}/>}
        </>
    )
}
