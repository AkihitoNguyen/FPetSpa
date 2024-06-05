// import axios from "axios";
// import { loginSuccess } from "./redux/authSlice";
// import jwt_decode from "jwt-decode"

// const refreshToken = async ()=>{
//     try {
//         const res = await axios.post("/v1/auth/refesh",{
//             withCredentials:true,
//         });
//         return res.data;
//     } catch (err) {
//         console.log(err);
//     }
// };


// export const creatAxios = (user,dispatch)=>{
//     const newInstance = axios.create();
//     newInstance.interceptors.request.use(
//         async (config)=> {
//             let date = new Date();
//             const decededToken = jwt_decode(user?.accessToken);
//             if(decededToken.exp < date.getTime()/1000){
//                 const data = await refreshToken();
//                 const refreshUser ={
//                     ...user,
//                     accessToken: data.accessToken,
//                 };
//                 dispatch(loginSuccess(refreshUser));
//                 config.headers["token"] = "Bearer " + data.accessToken;
//             }
//             return config;
//         },
//         (err) =>{
//         return Promise.reject(err);
//         }
//     );
// }