const cron = require('node-cron');
const axios = require('axios');

const APP_URL = process.env.API_URL;

const startCronJobs = () => {
  cron.schedule('*/5 * * * *', () => { // Every 5 minutes
    axios.get(APP_URL)
      .then(response => {
        console.log('Ping successful', new Date().toLocaleString());
      })
      .catch(error => {
        console.error('Ping failed:', new Date().toLocaleString(), error);
      });
  });
};

module.exports = startCronJobs;
