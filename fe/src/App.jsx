import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router"
import Home from './pages/Home.jsx'
import Restaurants from "./pages/Restaurants.jsx"
import Specific_Restaurant from './pages/Specific_Restaurant.jsx'
import Create_Restaurant from './pages/Create_Restaurant.jsx'
import ErrorPage from "./pages/ErrorPage.jsx"
import Layout from './components/Layout.jsx'
import Edit_Restaurant from "./pages/Edit_Restaurant.jsx"
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'

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
        element: <Login />,
        errorElement: <ErrorPage />
      },
      {
        path: "/signup",
        element: <SignUp />,
        errorElement: <ErrorPage />
      },
      {
        path: "/error",
        element: <ErrorPage />,
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
      <RouterProvider router={router} />
    </>
  )
}

export default App
