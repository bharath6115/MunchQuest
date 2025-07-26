import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { FaArrowCircleUp } from "react-icons/fa";

export default function Layout() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="my-auto flex flex-col flex-grow items-center justify-center">
        <Outlet />

        <button
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-5 right-5 p-1 rounded-full bg-yellow-400 text-black shadow-lg hover:bg-yellow-500 transition-opacity duration-300 ${showButton ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
          <FaArrowCircleUp size="25px" />
        </button>
      </div>
    </div>
  );
}
