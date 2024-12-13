import React from 'react'
import vid from '../../public/bgvid2.mp4'
import { useNavigate } from 'react-router-dom';


export const Landing = () => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: -1 }}
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to enhance text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

      {/* Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 px-4 md:px-16">
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Discover the Power of AI
        </h1>
        <p className="text-xl mb-6">
          Generate stunning images effortlessly with our AI-powered tool.
        </p>
        <button className="bg-[#6469ff] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#585dff] transition"
       onClick={() => {
        if (token) {
          navigate("/dashboard");
        } else {
          navigate("/signup");
        }
      }}
        >
          Start Creating
        </button>
      </div>
    </div>
  )
}
