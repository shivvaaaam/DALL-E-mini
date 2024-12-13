import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import loginvid from "../../public/loginvid.mp4";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://dall-e-mini-dl1e-fz0x36l80-shivam-guptas-projects-f99d138a.vercel.app/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

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
        <source src={loginvid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to enhance text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

      {/* Login Form */}
      <div className="absolute bg-black bg-opacity-50 py-10 px-6 rounded-lg shadow-lg w-full max-w-md right-1/2 transform translate-x-1/2 top-1/2 transform -translate-y-1/2 md:w-[508px]">
        <p className="text-white font-bold text-xl mb-5 text-center md:text-left">
          Unlock the future with AI—your journey starts here
        </p>
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
              Email Address <sup className="text-pink-500">*</sup>
            </p>
            <input
              required
              type="text"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className="w-full rounded-[0.5rem] bg-gray-100 border p-[12px] text-gray-900"
            />
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
              Password <sup className="text-pink-500">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full rounded-[0.5rem] bg-gray-100 border p-[12px] pr-12 text-gray-900"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            <Link to="/forgot-password">
              <p className="mt-1 ml-auto max-w-max text-xs text-blue-600">
                Forgot Password?
              </p>
            </Link>
          </label>
          <button
            type="submit"
            className="mt-6 rounded-[8px] bg-[#6469ff] py-[8px] px-[12px] font-medium text-white"
          >
            Log In
          </button>
          <button onClick={() => navigate("/signup")} 
            className="mt-6 rounded-[8px] bg-[#22c55e] py-[8px] px-[12px] font-medium text-white"
          >
            New here? Create Account
          </button>
        </form>
      </div>
    </div>
  );
};
