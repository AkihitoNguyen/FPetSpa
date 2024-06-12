import axios from "axios";

import {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed,
} from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(` https://fpetspa.azurewebsites.net/api/account/signin/customer`, user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (error) {
        console.log(error);
        dispatch(loginFailed());
    }
};
// https://localhost:7055/api/account/signin/customer
// https://fpetspa.azurewebsites.net/api/account/signin/customer



export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("https://fpetspa.azurewebsites.net/api/account/signup/customer", user);
        dispatch(registerSuccess());
        navigate("/check-email", { state: { message: "Please check your email to confirm your registration." } });
    } catch (error) {
        console.log(error);
        dispatch(registerFailed());
    }
};


export const signInWithGoogle = async (googleUser, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        // Pass the Google user's information to the backend
        const res = await axios.post("https://fpetspa.azurewebsites.net/api/account/login-google", googleUser);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (error) {
        console.log(error);
        dispatch(loginFailed());
    }
};




export const logoutUser = async (
    accessToken,
    id,
    dispatch,
    navigate,
    axiosJWT
) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post("https://fpetspa.azurewebsites.net/api/account/log-out", id, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(logoutSuccess());
        navigate("/");
    } catch (error) {
        dispatch(logoutFailed());
    }
};
// https://localhost:7055/api/account/log-out
// https://fpetspa.azurewebsites.net/api/account/log-out


export const addToCart = async (userId, productId, quantity) => {
  try {
    const response = await axios.post('https://localhost:7055/api/Cart', {
      userId,
      productId,
      quantity
    });
    return response.data; // Assuming the response contains the updated cart data
  } catch (error) {
    throw new Error('Failed to add item to cart');
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const response = await axios.delete('https://localhost:7055/api/Cart', {
      data: {
        userId,
        productId
      }
    });
    return response.data; // Assuming the response contains the updated cart data
  } catch (error) {
    throw new Error('Failed to remove item from cart');
  }
};
