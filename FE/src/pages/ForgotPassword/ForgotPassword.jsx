import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = ({ onBackToSignIn }) => {
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [timer, setTimer] = useState(45);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const inputRefs = useRef([]);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setEmailError(''); // Clear previous error
    
        if (!forgotPasswordEmail.trim()) {
            setEmailError("Email cannot be empty.");
            return;
        }
    
        if (!validateEmail(forgotPasswordEmail)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
    
        try {
            const response = await axios.post(`https://localhost:7055/api/account/SendCodeResetPassWord?email=${forgotPasswordEmail}`, { email: forgotPasswordEmail });
            if (response.status === 200) {
                toast.info("Forgot password. Please check your email.");
                setIsCodeSent(true);
                setTimer(45); // Reset the timer when the code is sent
            }
        } catch (error) {
            toast.error("Failed to send reset link. Please try again.");
        }
    };
    

    const handleForgotPasswordEmailChange = (e) => {
        const email = e.target.value;
        setForgotPasswordEmail(email);
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e, index) => {
            if (!/^[0-9]{1}$/.test(e.key) &&
                e.key !== 'Backspace' &&
                e.key !== 'Delete' &&
                e.key !== 'Tab' &&
                !e.metaKey) {
                e.preventDefault();
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (index > 0) {
                    setVerificationCode((prevCode) => {
                        const newCode = [...prevCode];
                        newCode[index - 1] = '';
                        return newCode;
                    });
                    inputRefs.current[index - 1]?.focus();
                }
            }
        };

        const handlePaste = (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!new RegExp(`^[0-9]{${verificationCode.length}}$`).test(text)) {
                return;
            }
            const digits = text.split('');
            setVerificationCode(digits);
            inputRefs.current[verificationCode.length - 1]?.focus();
        };

        inputRefs.current.forEach((input, index) => {
            input?.addEventListener('keydown', (e) => handleKeyDown(e, index));
            input?.addEventListener('paste', handlePaste);
        });

        return () => {
            inputRefs.current.forEach((input, index) => {
                input?.removeEventListener('keydown', (e) => handleKeyDown(e, index));
                input?.removeEventListener('paste', handlePaste);
            });
        };
    }, [verificationCode.length]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === '') {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
            if (value && index < verificationCode.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://localhost:7055/api/account/CheckCodeResetPassword?email=${forgotPasswordEmail}&&code=${verificationCode.join('')}`, { email: forgotPasswordEmail, code: verificationCode.join('') });
            if (response.status === 200) {
                toast.success("Code verified successfully. You can reset your password now.");
                setIsCodeVerified(true);
            }
        } catch (error) {
            toast.error("Failed to verify code. Please try again.");
        }
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);
        if (!validatePassword(pwd)) {
            setPasswordError("Password must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPwd = e.target.value;
        setConfirmPassword(confirmPwd);
        if (confirmPwd !== password) {
            setConfirmPasswordError("Confirm password does not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setPasswordError(""); // Clear previous error
        setConfirmPasswordError(""); // Clear previous error
        if (!password) {
            setPasswordError("Password cannot be empty.");
            return;
        }
        if (!confirmPassword) {
            setConfirmPasswordError("Confirm password cannot be empty.");
            return;
        }
        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.");
            return;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError("Confirm password does not match.");
            return;
        }

        try {
            const response = await axios.post(`https://localhost:7055/api/account/ForgetPassword?email=${forgotPasswordEmail}&&password=${password}`, { email: forgotPasswordEmail, password });
            if (response.status === 200) {
                toast.success("Password reset successfully. You can now sign in with your new password.");
                onBackToSignIn();
            }
        } catch (error) {
            toast.error("Failed to reset password. Please try again.");
        }
    };

    useEffect(() => {
        if (isCodeSent && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isCodeSent, timer]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                {!isCodeSent ? (
                    <form onSubmit={handleForgotPassword} noValidate className="space-y-4">
                        <header className="mb-8 text-center">
                            <h1 className="text-2xl font-bold mb-1">Forgot Password</h1>
                            <p className="text-[15px] text-slate-500">Enter your email address to receive a reset link.</p>
                        </header>
                        <div>
                            <input
                                type="email"
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                placeholder="Email Address"
                                value={forgotPasswordEmail}
                                onChange={handleForgotPasswordEmailChange}
                                onBlur={handleForgotPasswordEmailChange}
                                required
                            />
                            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                            >
                                Send Reset Link
                            </button>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                                onClick={onBackToSignIn}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </form>
                ) : !isCodeVerified ? (
                    <form onSubmit={handleVerifyCode} noValidate className="space-y-4">
                        <header className="mb-8 text-center">
                            <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
                            <p className="text-[15px] text-slate-500">Enter the 4-digit verification code that was sent to your phone number.</p>
                        </header>
                        <div className="flex items-center justify-center gap-3">
                            {verificationCode.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="w-16 h-16 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    value={value}
                                    onChange={(e) => handleChange(e, index)}
                                    onFocus={handleFocus}
                                    maxLength="1"
                                    ref={(el) => (inputRefs.current[index] = el)}
                                />
                            ))}
                        </div>
                        <div className="max-w-[260px] mx-auto mt-4">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                            >
                                Verify Code
                            </button>
                        </div>
                        <div className="text-sm text-slate-500 mt-4">
                            Didn't receive code? <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Resend</a>
                        </div>
                        <div className="text-sm text-slate-500 mt-4">
                            Time remaining: {timer}s
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                                onClick={onBackToSignIn}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} noValidate className="space-y-4">
                        <header className="mb-8 text-center">
                            <h1 className="text-2xl font-bold mb-1">Reset Password</h1>
                            <p className="text-[15px] text-slate-500">Enter your new password.</p>
                        </header>
                        <div>
                            <input
                                type="password"
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                placeholder="New Password"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordChange}
                                required
                            />
                            {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
                        </div>
                        <div>
                            <input
                                type="password"
                                className="w-full p-4 border border-gray-300 rounded-lg"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                onBlur={handleConfirmPasswordChange}
                                required
                            />
                            {confirmPasswordError && <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>}
                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                            >
                                Reset Password
                            </button>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                                onClick={onBackToSignIn}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;