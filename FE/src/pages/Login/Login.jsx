import { useState} from "react";
import "../Login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleLogin } from "react-google-login";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message || "";
    const defaultTheme = createTheme();
    




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

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {message && <p>{message}</p>}
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
                        <div className="password-wrapper">
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
                            />
                            <span className="eye-icon" onClick={() => setIsShowPassword(!isShowPassword)}>
                                {isShowPassword ? <VscEye /> : <VscEyeClosed />}
                            </span>
                        </div>
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
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to='/register' variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <GoogleLogin
                            clientId="554094266789-iqc14jn9mv9rucu4gdkeuibltsko48t1.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            cookiePolicy={'single_host_origin'}
                        />
                    </Box>
                </Box>
                <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    transition={{
        bounce: 'bounce',
    }}
/>

            </Container>
        </ThemeProvider>
    );
}

export default Login;
