import { useState } from "react";
import '../Register/Register.css';
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';


import { assets } from "../../assets/assets";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const defaultTheme = createTheme();

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
            toast.success("Register successful!Pls confirm email");
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
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${assets.spa})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div className="text-center">
                            <h2 className="block antialiased tracking-normal font-sans text-4xl leading-[1.3] text-inherit font-bold mb-4">Join Us Today</h2>
                            <p className="block antialiased font-sans text-blue-gray-900 text-lg font-normal">Enter your email and password to register.</p>
                        </div>
                        <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="fullName"
                                        required
                                        fullWidth
                                        id="fullName"
                                        label="Full Name"
                                        autoFocus
                                        onChange={handleFullNameChange}
                                    />
                                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        onChange={handleEmailChange}
                                    />
                                    {errors.email && <p className="error-message">{errors.email}</p>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        onChange={handlePasswordChange}
                                    />
                                    {errors.password && <p className="error-message">{errors.password}</p>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        autoComplete="new-password"
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to='/login' variant="body2">
                                    <p className="block antialiased font-sans text-base leading-relaxed text-center text-blue-gray-500 font-medium mt-4">Already have an account?
                                        <a className="hover:text-blue-800 ml-1" >Sign in</a></p>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    
                </Grid>
            </Grid>
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
        </ThemeProvider>
    );
};

export default Register;
