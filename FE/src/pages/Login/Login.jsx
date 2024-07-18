import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from "../../assets/assets";
import './Login.css'; 
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'; // Import axios for API requests
import { loginStart, loginSuccess, loginFailed } from "../../redux/authSlice";
import jwtDecode from "jwt-decode";

const defaultTheme = createTheme();

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.login.currentUser);

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
        loginUser(newUser, dispatch)
            .then(() => {
                toast.success("Login successful!");
                navigate("/");
            })
            .catch((error) => {
                toast.error("Login failed. Please try again.");
                console.error("Login error:", error);
            });
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
                        <h3 className="text-center font-bold text-4x1 mb-4">Sign In</h3>
                        <p className="text-center text-blue-900 font-normal text-lg mb-4">Enter your email and password to Sign In.</p>
                        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={handleEmailChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={isShowPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                onChange={handlePasswordChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <span className="eye-icon" onClick={() => setIsShowPassword(!isShowPassword)}>
                                            {isShowPassword ? <VscEye /> : <VscEyeClosed />}
                                        </span>
                                    ),
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <RouterLink to="/forgot-password" variant="body2">
                                        Forgot password?
                                    </RouterLink>
                                </Grid>
                                <Grid item>
                                    <RouterLink to="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </RouterLink>
                                </Grid>
                            </Grid>
                            <button onClick={googleLogin} className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3.5 px-7 rounded-lg bg-white text-blue-gray-900 shadow-blue-gray-500/10 hover:shadow-lg hover:shadow-blue-gray-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none w-full flex items-center gap-2 justify-center shadow-md" type="button">
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_1156_824)">
                                    <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4"></path>
                                    <path d="M8.65974 16.0006C10.7687 16.0006 12.5588 15.2958 13.9604 14.0693L11.3824 12.0704C10.6554 12.5704 9.7401 12.8368 8.66258 12.8368C6.63494 12.8368 4.9101 11.4975 4.23699 9.66016H1.5127V11.7193C2.96235 14.1369 5.68882 16.0006 8.65974 16.0006Z" fill="#34A853"></path>
                                    <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04"></path>
                                    <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335"></path>
                                    </g><defs><clipPath id="clip0_1156_824"><rect width="16" height="16" fill="white" transform="translate(0.5)"></rect></clipPath></defs></svg><span>Sign in With Google</span></button>
                            <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Login;
