import axios from 'axios';
import crypto from 'crypto';
import { HttpsProxyAgent } from 'https-proxy-agent';

const API_KEY = process.env.BITGET_API_KEY;
const SECRET_KEY = process.env.BITGET_SECRET_KEY;
const PASSPHRASE = process.env.BITGET_PASSPHRASE;
const BASE_URL = 'https://api.bitget.com';
const FIXIE_PROXY = 'http://fixie:1xRr9W89mBEYLGO@criterium.usefixie.com:80';

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

  // Create a new instance of HttpsProxyAgent for each request
  const proxyAgent = new HttpsProxyAgent(FIXIE_PROXY);

  try {
    const axiosConfig = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers,
      httpsAgent: proxyAgent,
    };

    // Add data or params based on the method
    if (method === 'GET') {
      axiosConfig.params = data;
    } else {
      axiosConfig.data = data;
    }

    const response = await axios(axiosConfig);
    console.log('utils/bitget API response:', response.data);
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
      startTime: params.startTime || Date.now() - (30 * 24 * 60 * 60 * 1000),
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
