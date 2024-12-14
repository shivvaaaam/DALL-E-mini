import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import loginvid from '../../public/loginvid.mp4'; // Ensure this path is correct

export const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    localStorage.setItem("signupData", JSON.stringify(userData));

    try {
      const response = await fetch('https://dall-e-mini-dl1e-git-main-shivam-guptas-projects-f99d138a.vercel.app/api/v1/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData); // Log API error details
        throw new Error(errorData.message || 'Something went wrong');
      }

      console.log('OTP sent successfully'); // Check if this logs
      navigate('/verify-mail'); // This should now be triggered
    } catch (error) {
      console.error('Error:', error.message); 
      setError(error.message);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover -z-10"
        src={loginvid}
      ></video>

      {/* Form Container */}
      <div className="absolute bg-black bg-opacity-50 py-10 px-6 rounded-lg shadow-lg w-full max-w-md right-1/2 translate-x-1/2 top-1/2 transform -translate-y-1/2 md:w-[508px]">
        <p className="text-white font-bold text-xl mb-5 text-center md:text-left">
          Join us today and unlock the power of AI-driven insights!
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          {error && <p className="text-red-500">{error}</p>}

          {/* First and Last Name Input */}
          <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-4">
            <label className="w-full md:w-1/2">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                First Name <sup className="text-pink-500">*</sup>
              </p>
              <input
                required
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleOnChange}
                placeholder="Enter first name"
                className="w-full rounded-[0.5rem] bg-gray-100 border p-[12px] text-gray-900"
              />
            </label>
            <label className="w-full md:w-1/2">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                Last Name <sup className="text-pink-500">*</sup>
              </p>
              <input
                required
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleOnChange}
                placeholder="Enter last name"
                className="w-full rounded-[0.5rem] bg-gray-100 border p-[12px] text-gray-900"
              />
            </label>
          </div>

          {/* Email Input */}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
              Email Address <sup className="text-pink-500">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className="w-full rounded-[0.5rem] bg-gray-100 border p-[12px] text-gray-900"
            />
          </label>

          {/* Password & Confirm Password */}
          <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-4">
            <label className="relative w-full md:w-1/2">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                Create Password <sup className="text-pink-500">*</sup>
              </p>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="w-full rounded-[0.5rem] bg-gray-100 border p-[12px] pr-10 text-gray-900"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible fontSize={24} /> : <AiOutlineEye fontSize={24} />}
              </span>
            </label>

            <label className="relative w-full md:w-1/2">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
                Confirm Password <sup className="text-pink-500">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="w-full rounded-[0.5rem] bg-gray-100 border p-[12px] pr-10 text-gray-900"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} /> : <AiOutlineEye fontSize={24} />}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 rounded-[8px] bg-[#6469ff] py-[8px] px-[12px] font-medium text-white"
          >
            Create Account
          </button>

          <button onClick={()=>navigate("/login")} 
          className="mt-6 rounded-[8px] bg-[#22c55e] py-[8px] px-[12px] font-medium text-white"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};
