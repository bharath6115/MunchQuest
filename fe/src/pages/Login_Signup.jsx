import { useState } from 'react'
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { useAuth } from '../services/firebaseMethods';
import { useNavigate } from 'react-router';

export const Login_Signup = () => {
    const {isLoggedIn} = useAuth();
    const nav = useNavigate();
    if(isLoggedIn) nav("/")
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
