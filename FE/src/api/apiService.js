import axios from '../utils/axiosClient';

const getAllServices = () =>{
    return axios.get(`/api/services`);
}

const getAllProduct =()=>{
    return axios.get(`/api/products`);
}

const postLogin = (userEmail,userPassword)=>{
    return axios.post(`api/login`,
    {email: userEmail,password: userPassword, delay:5000}
   
    )
}
const postSignup =(username,email,password) =>{
    return axios.post(`duong link`,
        {username,email,password}
    );
    }
export {getAllServices,postLogin,postSignup,getAllProduct}