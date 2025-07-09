import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home.jsx'
import Restaurants from "./pages/Restaurants.jsx"
import Specific_Restaurant from './pages/Specific_Restaurant.jsx'
import Create_Restaurant from './pages/Create_Restaurant.jsx'
import ErrorPage from "./pages/ErrorPage.jsx"
import Layout from './components/Layout.jsx'
import Edit_Restaurant from "./pages/Edit_Restaurant.jsx"
import { Login_Signup } from './pages/Login_Signup.jsx'
import { AuthProvider } from './services/firebaseMethods.jsx'
import { Analytics } from "@vercel/analytics/next"
import FAQ from './pages/FAQ.jsx'

const router = createBrowserRouter([

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />
      },
      {
        path: "/login",
        element: <Login_Signup />,
        errorElement: <ErrorPage />
      },
      {
        path: "/error",
        element: <ErrorPage />,
        errorElement: <ErrorPage />
      },
      {
        path: "/faq",
        element: <FAQ />,
        errorElement: <ErrorPage />
      },
      {
        path: "/restaurants",
        element: <Restaurants />,
        errorElement: <ErrorPage />
      },
      {
        path: "/restaurants/new",
        element: <Create_Restaurant />,
        errorElement: <ErrorPage />
      },
      {
        path: "/restaurants/:id",
        element: <Specific_Restaurant />,
        errorElement: <ErrorPage />
      },
      {
        path: "/restaurants/:id/edit",
        element: <Edit_Restaurant />,
        errorElement: <ErrorPage />
      },
      {
        path: "*",
        element: <ErrorPage />
      }
    ]
  }
])


function App() {
  return (
    <>
      <AuthProvider >
        <RouterProvider router={router} />
      </AuthProvider>
      <Analytics />
    </>
  )
}

export default App
