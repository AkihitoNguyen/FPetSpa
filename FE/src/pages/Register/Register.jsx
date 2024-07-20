import { useState } from "react";
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        if (email.startsWith(" ")) return "First character cannot have space.";
        if (!email) return "Email must not be blank.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Email is not valid.";
        return "";
    };

    const validateFullName = (fullName) => {
        if (fullName.startsWith(" ")) return "First character cannot have space.";
        if (!fullName) return "Customer name must not be blank.";
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(fullName)) return "Numbers and special characters are not allowed.";
        return "";
    };

    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const hasLowerCase = /[a-z]/;
        const hasUpperCase = /[A-Z]/;
        const hasNumber = /\d/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

        if (!minLength.test(password)) return "Password must be at least 8 characters long.";
        if (!hasLowerCase.test(password)) return "Password must contain at least one lowercase letter.";
        if (!hasUpperCase.test(password)) return "Password must contain at least one uppercase letter.";
        if (!hasNumber.test(password)) return "Password must contain at least one number.";
        if (!hasSpecialChar.test(password)) return "Password must contain at least one special character.";
        return "";
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const errors = {};
    
        const emailError = validateEmail(email);
        if (emailError) errors.email = emailError;
    
        const fullNameError = validateFullName(fullName);
        if (fullNameError) errors.fullName = fullNameError;
    
        const passwordError = validatePassword(password);
        if (passwordError) errors.password = passwordError;
    
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
    
        setErrors(errors);
    
        if (Object.keys(errors).length > 0) {
            return;
        }
    
        const newUser = {
            gmail: email,
            password: password,
            fullName: fullName,
            confirmPassword: confirmPassword
        };
    
        registerUser(newUser, dispatch, navigate)
        .then(() => {
            toast.success("Register successful! Please confirm email.");
        })
        .catch((error) => {
            toast.error("Register failed. Please try again.");
            console.error("Register error:", error);
        });
    };
    

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);
        setErrors(prevErrors => ({
            ...prevErrors,
            email: validateEmail(email)
        }));
    };

    const handleFullNameChange = (e) => {
        const fullName = e.target.value;
        setFullName(fullName);
        setErrors(prevErrors => ({
            ...prevErrors,
            fullName: validateFullName(fullName)
        }));
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        setErrors(prevErrors => ({
            ...prevErrors,
            password: validatePassword(password)
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPassword = e.target.value;
        setConfirmPassword(confirmPassword);
        setErrors(prevErrors => ({
            ...prevErrors,
            confirmPassword: password !== confirmPassword ? "Passwords do not match" : ""
        }));
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${assets.spa})` }}>
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <div className="text-center">
                        <h2 className="block antialiased tracking-normal font-sans text-4xl leading-[1.3] text-inherit font-bold mb-4">Join Us Today</h2>
                        <p className="block antialiased font-sans text-blue-gray-900 text-lg font-normal">Enter your email and password to register.</p>
                    </div>
                    <form onSubmit={handleRegister} noValidate className="space-y-4 mt-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                onChange={handleFullNameChange}
                            />
                            {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
                        </div>
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
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                onChange={handlePasswordChange}
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                onChange={handleConfirmPasswordChange}
                            />
                            {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                        <div className="flex items-center">
                            <input
                                id="allowExtraEmails"
                                name="allowExtraEmails"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <label htmlFor="allowExtraEmails" className="ml-2 block text-sm text-gray-900">I want to receive inspiration, marketing promotions and updates via email.</label>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign Up
                        </button>
                        <div className="flex justify-between">
                            <Link to='/login' className="text-sm text-indigo-600 hover:text-indigo-500">Already have an account? Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default Register;
