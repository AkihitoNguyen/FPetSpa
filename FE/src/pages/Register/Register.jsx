import { useState } from "react";
import '../Register/Register.css';
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const validateFullName = (fullName) => {
        if (fullName.startsWith(" ")) {
            return "First character cannot have space.";
        }
        if (!fullName) {
            return "Customer name must not be blank.";
        }
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(fullName)) {
            return "Numbers and special characters are not allowed.";
        }
        return "";
    };

    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const hasLowerCase = /[a-z]/;
        const hasUpperCase = /[A-Z]/;
        const hasNumber = /\d/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

        if (!minLength.test(password)) {
            return "Password must be at least 8 characters long.";
        }
        if (!hasLowerCase.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!hasUpperCase.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!hasNumber.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!hasSpecialChar.test(password)) {
            return "Password must contain at least one special character.";
        }
    
        return "";
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const errors = {};

        const emailError = validateEmail(email);
        if (emailError) {
            errors.email = emailError;
        }

        const fullNameError = validateFullName(fullName);
        if (fullNameError) {
            errors.fullName = fullNameError;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            errors.password = passwordError;
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const newUser = {
            gmail:email,
            password:password,
            fullName:fullName,
            confirmPassword:confirmPassword
        };
        registerUser(newUser, dispatch, navigate);
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
        <section className="register-container">
            <form onSubmit={handleRegister}>
            <div className="register-title">Sign up</div>
                <div className="input-container">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        onChange={handleFullNameChange}
                        autoComplete="name"
                    />
                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>
                <div className="input-container">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleEmailChange}
                        autoComplete="email"
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="input-container">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={handlePasswordChange}
                        autoComplete="new-password"
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <div className="input-container">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        onChange={handleConfirmPasswordChange}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
                <button className="button-submit" type="submit">Create account</button>
            </form>
        </section>
    );
};

export default Register;
