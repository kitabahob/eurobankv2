import axios from 'axios';

export async function checkIncomingTransactions(targetAddress='TMaLDP1gPgiPVr8aoKm1YFLA56b8Dihgpj') {
  const url = `https://api.tronscan.org/api/transaction?address=${targetAddress}`;

  const response = await axios.get(url);
  return response.data.data; 
}
