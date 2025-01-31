import axios from 'axios';
import crypto from 'crypto';

const API_KEY = process.env.BITGET_API_KEY;
const SECRET_KEY = process.env.BITGET_SECRET_KEY;
const PASSPHRASE = process.env.BITGET_PASSPHRASE;
const BASE_URL = 'https://api.bitget.com';
const FIXIE_PROXY = process.env.FIXIE_PROXY;

const getTimestamp = () => new Date().toISOString();

const signRequest = (method, endpoint, body = '') => {
  const timestamp = getTimestamp();
  const preSign = `${timestamp}${method}${endpoint}${body}`;
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(preSign)
    .digest('base64');
  
  return { signature, timestamp };
};

export const makeRequest = async (method, endpoint, data = {}) => {
  const body = method === 'GET' ? '' : JSON.stringify(data);
  const { signature, timestamp } = signRequest(method, endpoint, body);

  const headers = {
    'Content-Type': 'application/json',
    'ACCESS-KEY': API_KEY,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': PASSPHRASE,
  };

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data: method === 'GET' ? null : data,
      headers,
      proxy: false,  // Disable default proxy behavior
      httpsAgent: new (require("https").Agent)({ 
        proxy: FIXIE_PROXY
      })
    });

    return response.data;
  } catch (error) {
    console.error('Error in API call:', error.response?.data || error.message);
    throw error;
  }
};



export const getDepositRecords = async (params = {}) => {
  try {
    const endpoint = '/api/v2/spot/wallet/deposit-records';
    const queryParams = {
      startTime: params.startTime || Date.now() - (30 * 24 * 60 * 60 * 1000), // Last 30 days by default
      endTime: params.endTime || Date.now(),
      coin: params.coin || undefined,
      limit: params.limit || 50,
      ...params
    };

    const response = await makeRequest('GET', endpoint, queryParams);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching deposit records:', error);
    throw error;
  }
};