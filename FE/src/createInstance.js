
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const refreshToken = async () => {
    try {
        const res = await axios.post("/api/v1/users/refresh", {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.log(error.response.data);
    }
};

export const createAxiosInstance = (user, dispatch, action) => {
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        try {
            const date = new Date();
            const decodedToken = jwtDecode(user?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken,
                };
                dispatch(action(refreshUser));
                config.headers["token"] = "Bearer " + data.accessToken;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    });

    return axiosJWT;
};
