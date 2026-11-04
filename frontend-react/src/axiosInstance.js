import axios from 'axios';


const baseURL= import.meta.env.VITE_BACKEND_BASE_API

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})


// request intercepter
axiosInstance.interceptors.request.use(
    function (config) {
        const access = localStorage.getItem('access_token')
        if (access){
            config.headers['Authorization'] = `Bearer ${access}`
        }
        return config;
    },

    function (error) {
         return Promise.reject(error);
    }
)

//response intercepter
axiosInstance.interceptors.response.use(
    function (response){
        return response;
    },

   async function (error) {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem('refresh_token')
            try {
                const response = await axiosInstance.post('/token/refresh/', {refresh: refresh})
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                return axiosInstance(originalRequest);
            }catch (refreshError){
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
   }
)

export default axiosInstance
