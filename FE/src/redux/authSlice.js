import { createSlice } from "@reduxjs/toolkit";
const authSlice= createSlice({
    name:"auth",
    initialState:{
        login:{
            currentUser:null,
            isFetching: false,
            error:false
        },
        signup:{
            isFetching:false,
            error:false,
            success:false
        },
        logout:{
            isFetching:false,
            error:false
        }
    },
    reducers:{
        loginStart:(state)=>{
            state.login.isFetching = true;
        },
loginSuccess: (state,action)=>{
    state.login.isFetching =false;
    state.login.currentUser=action.payload;
    state.login.error= false;
},
loginFailed:(state)=>{
    state.login.isFetching = false;
    state.login.error = true;
},
signupStart:(state)=>{
    state.signup.isFetching = true;
},
signupSuccess: (state)=>{
state.signup.isFetching =false;
state.signup.error= false;
state.signup.success=true;
},
signupFailed:(state)=>{
state.signup.isFetching = false;
state.signup.error = true;
state.signup.success=false;
},
logoutSuccess: (state)=>{
    state.logout.isFetching =false;
    state.logout.currentUser=null;
    state.login.error= false;
},
logoutFailed:(state)=>{
    state.logout.isFetching = false;
    state.login.error = true;
},
logoutStart:(state)=>{
    state.logout.isFetching = true;
},
    }
});
export const{
    loginStart,
    loginFailed,
    loginSuccess,
    signupStart,signupFailed,signupSuccess,
    logoutStart,logoutSuccess,logoutFailed
} = authSlice.actions;

export default authSlice.reducer;
