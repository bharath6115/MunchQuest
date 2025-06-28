import React from 'react'
import { Link } from 'react-router'

const ErrorPage = () => {
    return (
        <>
            <h1 className='text-6xl p-5'>Oops. Something went wrong.</h1>
            <h3>
                <Link to="/">Return to Home page.</Link>
            </h3>
        </>
    )
}

export default ErrorPage