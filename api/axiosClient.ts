import axios from 'axios';

const axiosClient = axios.create({
   baseURL: process.env.NEXT_PUBLIC_URL,
});

export default axiosClient;
