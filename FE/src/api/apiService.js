import axios from '../utils/axiosClient';

const getAllServices = () =>{
    return axios.get(`/api/services`);
}

export {getAllServices}