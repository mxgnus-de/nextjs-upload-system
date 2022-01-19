import { devenv } from './api';

const developmentData = {
   username: '',
   password: '',
   host: '',
   database: '',
};

const productionData = {
   username: '',
   password: '',
   host: '',
   database: '',
};

export default devenv ? productionData : developmentData;
