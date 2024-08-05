

// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Reset() {
//   const [reset, setReset] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [cpassword, setCpassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const [otp, setOtp] = useState(new Array(6).fill(""));

//   const handleChange = (element, index) => {
//     const value = element.value.replace(/[^0-9]/g, "");
//     if (value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 5) {
//         element.nextSibling.focus();
//       }
//     }
//   };

//   const handleKeyDown = (element, index, event) => {
//     if (event.key === "Backspace" && !otp[index] && index > 0) {
//       element.previousSibling.focus();
//     }
//   };

//   const handleReset = async () => {
//     if (!email) {
//       toast.error('Email is required');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.get(`http://localhost:3001/student/sendotp/${email}`);
//       if (response.status === 200) {
//         toast.success('Reset email sent. Please check your inbox');
//         setReset(false);
//       }
//     } catch (error) {
//       toast.error('Failed to send reset email, please try again');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp || !password || !cpassword) {
//       toast.error('Enter all input fields...');
//       return;
//     }

//     if (password !== cpassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     const otpString = otp.join('');
//     try {
//       const response = await axios.post('http://localhost:3001/student/verifyotp', { email, password, otp: otpString });

//       if (response.status === 200) {
//         toast.success('OTP verified successfully');
//         navigate('/login');
//       }
//     } catch (error) {
//       toast.error('Invalid OTP');
//     }
//   };

//   return (
//     <>
//       {reset && (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//           <div className="bg-white p-10 rounded-lg shadow-lg w-1/3 max-w-md">
//             <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
//             <input
//               type="email"
//               placeholder="Enter your registered email"
//               className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <button
//               type="button"
//               className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//               onClick={handleReset}
//               disabled={loading}
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 text-white mx-auto"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               ) : (
//                 "Reset"
//               )}
//             </button>
//           </div>
//         </div>
//       )}

//       {!reset && (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//           <div className="bg-white p-10 rounded-lg shadow-lg w-1/3 max-w-md">
//             <input
//               type="password"
//               placeholder="New Password"
//               className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//               value={cpassword}
//               onChange={(e) => setCpassword(e.target.value)}
//             />
//             <h2>Enter the OTP sent to your email:</h2>
//             <div className="flex space-x-2">
//               {otp.map((data, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength="1"
//                   className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
//                   value={data}
//                   onChange={(e) => handleChange(e.target, index)}
//                   onKeyDown={(e) => handleKeyDown(e.target, index, e)}
//                 />
//               ))}
//             </div>
//             <button
//               type="button"
//               className="block mt-[1rem] mx-auto w-40 text-white text-base bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//               onClick={handleVerifyOtp}
//             >
//               Verify OTP
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Reset;


import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Reset() {
  const [reset, setReset] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        element.nextSibling.focus();
      }
    }
  };

  const handleKeyDown = (element, index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      element.previousSibling.focus();
    }
  };

  const handleReset = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3001/student/sendotp/${email}`);
      if (response.status === 200) {
        toast.success('Reset email sent. Please check your inbox');
        setReset(false);
      }
    } catch (error) {
      toast.error('Failed to send reset email, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !password || !cpassword) {
      toast.error('Enter all input fields...');
      return;
    }

    if (password !== cpassword) {
      toast.error('Passwords do not match');
      return;
    }

    const otpString = otp.join('');
    setLoadingVerify(true);

    try {
      const response = await axios.post('http://localhost:3001/student/verifyotp', { email, password, otp: otpString });

      if (response.status === 200) {
        toast.success('Password changed successfully');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Invalid OTP');
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <>
      {reset && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-10 rounded-lg shadow-lg w-1/3 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Reset"
              )}
            </button>
          </div>
        </div>
      )}

      {!reset && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-10 rounded-lg shadow-lg w-1/3 max-w-md">
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
            <h2>Enter the OTP sent to your email:</h2>
            <div className="flex space-x-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e.target, index, e)}
                />
              ))}
            </div>
            <button
              type="button"
              className="block mt-[1rem] mx-auto w-40 text-white text-base bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleVerifyOtp}
              disabled={loadingVerify}
            >
              {loadingVerify ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Reset;

