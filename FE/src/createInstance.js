import axios from "axios";

export const createAxiosInstance = (user, dispatch, action) => {
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use((config) => {
        // Check if the user is logged in and has an access token
        if (user && user.accessToken) {
            // Set the Authorization header with the access token
            config.headers["Authorization"] = "Bearer " + user.accessToken;
        }
        return config;
    });

    // Add an interceptor for response errors
    axiosJWT.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            // Check if the error status is 401 (Unauthorized)
            if (error.response && error.response.status === 401) {
                // Dispatch action to clear the user data
                dispatch(action(null));
            }
            return Promise.reject(error);
        }
    );

    return axiosJWT;
};
