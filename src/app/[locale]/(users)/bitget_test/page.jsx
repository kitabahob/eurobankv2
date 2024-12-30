// components/WithdrawButton.js
'use client'

export default function WithdrawButton() {
    const handleWithdraw = async () => {
      const withdrawalData = {
        coin: 'USDT',
        amount: "10",
        address: 'TSrqBqNgsUVHkjBcZc2GEDHTCUdPszgoQt',
        chain: 'TRC20',
        businessType: "SPOT"
      };
  
      try {
        console.log('Initiating withdrawal:', withdrawalData);
        
        const response = await fetch('/api/bitget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withdrawalData),
        });
  
        const data = await response.json();
        console.log('API Response:', data);
  
        if (response.ok) {
          alert('Withdrawal successful');
        } else {
          alert(`Withdrawal failed: ${data.error?.msg || data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during withdrawal');
      }
    };
  
    return (
      <button 
        onClick={handleWithdraw}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Withdraw 10 USDT (TRC20)
      </button>
    );
}