import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://crypto-jacking-preventaion.onrender.com',
});

export default Api;
