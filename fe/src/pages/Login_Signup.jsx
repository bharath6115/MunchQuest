import { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { useAuth } from '../services/firebaseMethods';
import { useNavigate } from 'react-router';

export const Login_Signup = () => {
    const {isLoggedIn} = useAuth();
    const nav = useNavigate();
    const [Login,setLogin] = useState(true);

    useEffect(()=>{
        if(isLoggedIn) nav("/")
    },[isLoggedIn])

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
