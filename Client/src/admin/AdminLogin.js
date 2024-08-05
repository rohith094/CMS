
import React, { useState, useEffect } from 'react';
import IT from '../Assets/ITBLOCK.png';
import gmrit from '../Assets/gmrit.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('admintoken');
    if (token) {
      navigate('/admindashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting login with email:', mobile, 'and password:', password);
      const response = await axios.post('http://localhost:3001/admin/login', { mobile, password });
      console.log(response);
      if (response.data.token) {
        Cookies.set('admintoken', response.data.token, { expires: 1 / 24 });
        toast.success('Login Successful');
        navigate('/admindashboard');
      } else {
        toast.error('Invalid Credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setMobile(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <section>
      <div className="h-[100vh] grid grid-cols-1 lg:grid-cols-2">
        <div className="relative hide-mobile flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <img
              className="h-[100vh] w-full rounded-br-full rounded-tr-full rounded object-cover"
              src={IT}
              alt=""
            />
          </div>
        </div>
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="w-auto mb-2">
              <img src={gmrit} height={130} width={130} alt="Logo" />
            </div>
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
              Admin Login
            </h2>
            <form onSubmit={handleSubmit} className="mt-1">
              <div className="space-y-5">
                <div>
                  <label htmlFor="mobile" className="text-base font-medium text-gray-900">
                    Mobile Number
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="number"
                      placeholder="7702XXXXXX"
                      value={mobile}
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className={`inline-flex w-full items-center justify-center rounded-full bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 ${isLoading ? 'cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        Login
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </>
                    )}
                  </button>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
