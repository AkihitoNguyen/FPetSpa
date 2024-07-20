import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from "../../assets/assets";
import './Login.css'; 
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailed } from "../../redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../../redux/apiRequest";
import ForgotPassword from '../ForgotPassword/ForgotPassword'; // Import ForgotPassword component

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State to manage forgot password modal
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleLogin = async (accessToken) => {
        dispatch(loginStart());
        try {
            const response = await axios.post(`https://fpetspa.azurewebsites.net/api/account/GoogleResponse?accessToken=${accessToken}`);
            const { fullName, accessToken: apiAccessToken, refreshToken } = response.data;
            const decodedToken = jwtDecode(apiAccessToken);
            const userId = decodedToken["jti"];
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            
            const userData = {
                accessToken: apiAccessToken,
                refreshToken,
                userId,
                fullName,
                role
            };

            dispatch(loginSuccess(userData));
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            dispatch(loginFailed());
            toast.error("Google login failed. Please try again.");
            console.error("Google login error:", error);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (googleResponse) => {
            console.log(googleResponse);
            const accessToken = googleResponse.access_token;
            await handleGoogleLogin(accessToken);
        },
    });

    const handleLogin = (e) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }
        const newUser = {
            gmail: email,
            password: password,
        };
        loginUser(newUser, dispatch, navigate)
            .then(() => {
                toast.success("Login successful!");
                navigate("/");
            })
            .catch((error) => {
                toast.error("Login failed. Please try again.");
                console.error("Login error:", error);
            });
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setIsForgotPassword(true); // Show the forgot password modal
    };

    const validateEmail = (email) => {
        if (!email.trim()) {
            return "Email must not be blank.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Email is not valid.";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password.trim()) {
            return "Password must not be blank.";
        }
        return "";
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: validateEmail(e.target.value),
        }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: validatePassword(e.target.value),
        }));
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${assets.spa})` }}>
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    
                        <form onSubmit={handleLogin} noValidate className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={handleEmailChange}
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type={isShowPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        onChange={handlePasswordChange}
                                    />
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)}>
                                        {isShowPassword ? <VscEye /> : <VscEyeClosed />}
                                    </span>
                                </div>
                                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign In
                            </button>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="text-sm text-indigo-600 hover:text-indigo-500"
                                    onClick={handleForgotPassword}
                                >
                                    Forgot Password?
                                </button>
                                <RouterLink to="/register" className="text-sm text-indigo-600 hover:text-indigo-500">Don't have an account? Sign Up</RouterLink>
                            </div>
                            <button
                                onClick={googleLogin}
                                type="button"
                                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white-600 hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                    <g clipPath="url(#clip0_1156_824)">
                                        <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4"></path>
                                        <path d="M8.65974 16.0006C10.7687 16.0006 12.5588 15.2958 13.9604 14.0693L11.3824 12.0704C10.6554 12.5704 9.7401 12.8368 8.66258 12.8368C6.63494 12.8368 4.9101 11.4975 4.23699 9.66016H1.5127V11.7193C2.96235 14.1369 5.68882 16.0006 8.65974 16.0006Z" fill="#34A853"></path>
                                        <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04"></path>
                                        <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335"></path>
                                    </g>
                                    <defs><clipPath id="clip0_1156_824"><rect width="16" height="16" fill="white" transform="translate(0.5)"></rect></clipPath></defs>
                                </svg>
                                <span>Sign in With Google</span>
                            </button>
                            <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                        </form>
                    
                </div>
                {isForgotPassword &&(
                        <ForgotPassword onBackToSignIn={() => setIsForgotPassword(false)} />
                    )}
            </div>
        </div>
    );
}

export default Login;
