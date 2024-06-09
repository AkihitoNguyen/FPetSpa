import { useLocation } from "react-router-dom";

const CheckEmail = () => {
    const location = useLocation();
    const message = location.state?.message || "Please check your email to confirm your registration.";

    return (
        <div>
            <h1>Check your email</h1>
            <p>{message}</p>
        </div>
    );
};

export default CheckEmail;
