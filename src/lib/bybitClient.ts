import { RestClientV5 } from 'bybit-api';

// Configure the Bybit client for mainnet
const bybitClient = new RestClientV5({
  testnet: false, //set to false for mainnet
  key: process.env.BYBIT_API_KEY!,
  secret: process.env.BYBIT_API_SECRET!,
  recv_window: 10000,   
  enable_time_sync: true 
});

export default bybitClient;