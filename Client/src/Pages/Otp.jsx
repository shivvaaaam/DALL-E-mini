import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { GiBackwardTime } from "react-icons/gi";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [signupData, setSignupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDataMissing, setIsDataMissing] = useState(false); // State to track missing data
  const navigate = useNavigate();

  // Retrieve signupData from localStorage on component mount
  useEffect(() => {
    const storedSignupData = JSON.parse(localStorage.getItem("signupData"));
    if (!storedSignupData) {
      setIsDataMissing(true);  // Flag to show that signup data is missing
      return;  // Don't proceed with setting data if it's missing
    }
    setSignupData(storedSignupData);
  }, []);

  // Handle OTP submission
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!signupData) {
      alert("No signup data found. Redirecting to signup page.");
      navigate("/signup");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://dall-e-mini-dl1e-fz0x36l80-shivam-guptas-projects-f99d138a.vercel.app/api/v1/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           email: signupData.email,
           otp,
           firstName: signupData.firstName,
           lastName: signupData.lastName,
           password: signupData.password }),
      });

      // Check if the response is ok (status code 2xx)
      if (!response.ok) {
        // Handle non-2xx responses (e.g., 400 or 500 status codes)
        const errorText = await response.text(); // Get the raw text response
        alert(errorText || "Failed to verify OTP");
        return;
      }

      // Check if the response body is empty
      const responseBody = await response.text();
      let data = {};
      if (responseBody) {
        try {
          // Parse response as JSON if body is not empty
          data = JSON.parse(responseBody);
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
        }
      }

      console.log("Here is data", data);

      // Assuming successful verification if there's no error message
      alert("Email verified successfully");
      navigate("/login"); // Redirect to login after successful verification
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (!signupData) {
      alert("No signup data found. Redirecting to signup page.");
      navigate("/signup");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://dall-e-mini-dl1e-fz0x36l80-shivam-guptas-projects-f99d138a.vercel.app/api/v1/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData.email }),
      });

      // Parse the response directly as JSON
      const data = await response.json();

      if (response.ok) {
        alert("OTP resent successfully");
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("An error occurred while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // If data is missing, you can render a fallback message or loading state
  if (isDataMissing) {
    return (
      <div>
        <p>No signup data found. Please sign up first.</p>
        <Link to="/signup">Go to Signup</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the <br /> code
            below:
          </p>
          <form onSubmit={handleOnSubmit}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 1px -1px 1px rgba(0, 0, 0, 0.5)",

                  }}
                  className="w-[48px] lg:w-[60px] border-1 bg-white rounded-[0.5rem] text-black aspect-square text-center focus:border-0 focus:outline-2 focus:outline-black"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-[#6469ff] py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-white"
            >
              Verify Email
            </button>
          </form>

          <div className="flex justify-between">
            <Link
              to={"/login"}
              className="flex items-center text-black gap-x-2 mt-3"
            >
              <BiArrowBack className="text-white" /> Back To Login
            </Link>

            {/* Resend OTP handler */}
            <button
              onClick={handleResendOtp}
              className="text-black flex items-center mt-3 gap-x-1"
            >
              <GiBackwardTime className="text-2xl" /> Resend OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Otp;
