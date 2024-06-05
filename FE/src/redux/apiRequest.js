import axios from "axios";
import { loginFailed, loginStart, loginSuccess, signupFailed, signupStart, signupSuccess } from "./authSlice";
import { getUsersFailed, getUsersStart, getUsersSuccess } from "./userSlice";

export const loginUser = async (user,dispatch,navigate)=>{
    dispatch(loginStart());
    try {
        const res = await axios.post(`http://localhost:5221/api/Accounts/login`,user);
        dispatch(loginStart(res.data));
        navigate("/");
    } catch (error) {
        dispatch(loginFailed())
    }
}
export const signupUser = async (user,dispatch,navigate) => {
    dispatch(signupStart());
    try {
        await axios.post("/signup",user);
        dispatch(signupSuccess());
        navigate('/login');
    } catch (error) {
        dispatch(signupFailed);
    }
}

export const getAllUsers = async (accessToken,dispatch)=>{
    dispatch(getUsersStart());
    try {
        const res = await axios.get("/as",{
            headers:{token:`Bearer ${accessToken}` },
        })
        dispatch(getUsersSuccess(res.data))
    } catch (error) {
        dispatch(getUsersFailed());
    }
}


export const logOut = async(dispatch,id,navigate,accessToken,axiosJWT)=>{
    dispatch(loginStart());
    try {
        await axiosJWT.post("/ss",id,{
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(loginSuccess());
    } catch (error) {
        dispatch(loginFailed());
    }
}
