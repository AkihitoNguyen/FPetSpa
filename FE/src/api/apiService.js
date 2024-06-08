import axios from '../utils/axiosClient';

const getAllServices = () =>{
    return axios.get(`https://fpetspa.azurewebsites.net/api/services`);
}

export {getAllServices}