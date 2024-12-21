import { RestClientV5 } from 'bybit-api';

// Configure the Bybit client
const bybitClient = new RestClientV5({
  testnet: process.env.BYBIT_ENV === 'testnet',
  key: process.env.BYBIT_API_KEY!,
  secret: process.env.BYBIT_API_SECRET!,
});

export default bybitClient;
