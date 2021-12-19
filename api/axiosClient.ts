import axios from 'axios';
import { server } from 'config/api';

const axiosClient = axios.create({
   baseURL: server,
});

export default axiosClient;
