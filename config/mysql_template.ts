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

export default process.env.NODE_ENV === 'production'
   ? productionData
   : developmentData;
