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

import {
    getUserStart,
    getUserSuccess,
    getUserFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed,
} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("https://localhost:7055/api/account/signin/customer", user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (error) {
        console.log(error);
        dispatch(loginFailed());
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("https://localhost:7055/api/account/signup/customer", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (error) {
        console.log(error);
        dispatch(registerFailed());
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
        await axiosJWT.post("https://localhost:7055/api/account/log-out", id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logoutSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(logoutFailed());
    }
};