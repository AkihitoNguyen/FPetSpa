import { useState } from "react";
import "../Login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
const Login = () => {
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = (e)=>{
        e.preventDefault();

        const emailError = validateEmail(email);
        if (emailError) {
            errors.email = emailError;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            errors.password = passwordError;
        }

        const newUser ={
            gmail:email,
            password:password
        };
        loginUser(newUser,dispatch,navigate)
    }


    const validateEmail = (email) => {
        if (email.startsWith(" ")) {
            return "First character cannot have space.";
        }
        if (!email) {
            return "Email must not be blank.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Email is not valid.";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) {
            return "Password must not be blank.";
        }
    
        return "";
    };
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);
        setErrors(prevErrors => ({
            ...prevErrors,
            email: validateEmail(email)
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

    return ( 
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={handleLogin}>
                <label>USERNAME</label>
                <input type="text" 
                placeholder="Enter your username" 
                onChange={handleEmailChange}
                />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                <label>PASSWORD</label>
                <div className="password-container">
                <input type={isShowPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                onChange={handlePasswordChange}
                />
                 {errors.password && <p className="error-message">{errors.password}</p>}
                <span className="eye-icon" onClick={() => setIsShowPassword(!isShowPassword)}>
            {isShowPassword ? <VscEye /> : <VscEyeClosed />}
          </span>
                </div>
                <button type="submit" className="button-continue"> Continue </button>
            </form>
            <div className="login-register"> Dont have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
            <button type="submit"> Continue </button>
        </section>
     );
}
 
export default Login;