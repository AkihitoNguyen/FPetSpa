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
  return axios.post('https://fpetspa.azurewebsites.net/api/account/signin/customer', user)
    .then((res) => {
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const fullName = res.data.fullName;
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userData = {
        accessToken,
        refreshToken,
        userId,
        fullName,
        role
      };

      dispatch(loginSuccess(userData));
      navigate("/");
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
      await axios.post(`https://fpetspa.azurewebsites.net/api/account/signup/customer`, user);
      dispatch(registerSuccess());
      navigate("/login", { state: { message: "Please check your email to confirm your registration." } });
  } catch (error) {
      console.error("Register error:", error); 
      dispatch(registerFailed());
      throw error;  
  }
};
//https://localhost:7055/api/account/signup/customer
//https://fpetspa.azurewebsites.net/api/account/signup/customer

export const signInWithGoogle = async (googleUser, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.get("https://fpetspa.azurewebsites.net/api/account/login-google", googleUser, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (error) {
        console.log(error);
        dispatch(loginFailed());
    }
  };


export const logoutUser = async (
    accessToken,
    userId,
    dispatch,
    navigate,
    axiosJWT
) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post(`https://fpetspa.azurewebsites.net/api/account/log-out`, userId, {
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

