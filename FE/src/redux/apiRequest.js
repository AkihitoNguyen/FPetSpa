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


import {jwtDecode} from "jwt-decode";


export const loginUser = (user, dispatch, navigate) => {
  dispatch(loginStart());
  return axios.post(`https://fpetspa.azurewebsites.net/api/account/signin/customer`, user)
    .then((res) => {
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const fullName = res.data.fullName;

      const userData = {
        accessToken,
        refreshToken,
        userId,
        fullName,
      };

      dispatch(loginSuccess(userData));
      navigate("/");
      return userData;
    })
    .catch((error) => {
      dispatch(loginFailed());
      throw error;
    });
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
      console.error("Register error:", error); 
      dispatch(registerFailed());
      throw error;  
  }
};
//https://localhost:7055/api/account/signup/customer
// /https://fpetspa.azurewebsites.net/api/account/signup/customer


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


export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    const userListDom = document.querySelector(".home-userlist");
    dispatch(getUserStart());
    try {
        const res = await axiosJWT.get("/api/v1/users", {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (!res) {
            userListDom.innerHTML = `<h2>There is no user!</h2>`;
        } else {
            dispatch(getUserSuccess(res.data));
            console.log(res);
        }
    } catch (error) {
        userListDom.innerHTML = `<h2>${error.response.data}</h2>`;
        dispatch(getUserFailed());
    }
};

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete("/api/v1/users/delete/" + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (error) {
        dispatch(deleteUserFailed(error.response.data));
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
    return response.data; 
  } catch (error) {
    throw new Error('Failed to add item to cart');
  }
};

export const removeFromCart = async (cartId) => {
  try {
    const response = await axios.delete('https://localhost:7055/api/Cart', {
      data: {
        cartId
      }
    });
    return response.data; // Assuming the response contains the updated cart data
  } catch (error) {
    throw new Error('Failed to remove item from cart');
  }
};
