// eslint-disable-next-line no-unused-vars
import React, { useState,useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
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
import { loginStart,loginSuccess,loginFailed } from "../../redux/authSlice";
const defaultTheme = createTheme();
import {jwtDecode} from "jwt-decode";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const googleLogin = () => { 
        window.location.href = 'https://fpetspa.azurewebsites.net/api/account/login-google';
    };

    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const fullName = urlParams.get('FullName');
    const refreshToken = urlParams.get('RefreshToken');

    if (token && fullName && refreshToken) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken["jti"];

        if (userId) {
          const googleUser = {
            fullName: fullName,
            accessToken: token,
            refreshToken: refreshToken,
            userId: userId
          };
          console.log("Google User:", googleUser); 

          dispatch(loginStart());
          dispatch(loginSuccess(googleUser));
          navigate('/');
        } else {
          console.error('Unable to decode user ID from token:', decodedToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      const error = urlParams.get('error');
      if (error) {
        toast.error('Failed to login with Google');
        dispatch(loginFailed());
      }
    }
  }, [dispatch, navigate]);


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
                                    <RouterLink to="/forgot-password" variant="body2" className="link">
                                        Forgot Password?
                                    </RouterLink>
                                </Grid>
                                <Grid item>
                                    <RouterLink to="/register" variant="body2" className="link">
                                        Dont have an account?<span className="text-blue-800 underline">Sign Up</span>
                                    </RouterLink>
                                </Grid>
                            </Grid>
                            <button onClick={googleLogin} className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3.5 px-7 rounded-lg bg-white text-blue-gray-900 shadow-blue-gray-500/10 hover:shadow-lg hover:shadow-blue-gray-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none w-full flex items-center gap-2 justify-center shadow-md" type="button">
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_1156_824)">
                                    <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4"></path>
                                    <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853"></path>
                                    <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04"></path>
                                    <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335"></path>
                                    </g><defs><clipPath id="clip0_1156_824"><rect width="16" height="16" fill="white" transform="translate(0.5)"></rect></clipPath></defs></svg><span>Sign in With Google</span></button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer />
        </ThemeProvider>
    );
}

export default Login;
