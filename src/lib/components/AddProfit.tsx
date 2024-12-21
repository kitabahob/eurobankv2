// /components/AddProfitButton.tsx
import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';

export default function AddProfitButton() {
  const user = useCurrentUser(); // Fetch the user's details
  const [isActive, setIsActive] = useState(false);

  const handleButtonClick = async () => {
    if (isActive || !user || !user.id) return;

    setIsActive(true);

    try {
      const response = await fetch('/api/deposit/add_profit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }), // Use the user ID from the hook
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Profit-adding process initialized:', result);
      } else {
        console.error('Error initializing profit-adding process:', result);
      }
    } catch (error) {
      console.error('Failed to initialize profit-adding process:', error);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsActive(false);
      console.log('Profit-adding process completed. Button reset.');
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    return () => clearTimeout(timer); // Clean up on component unmount or state change
  }, [isActive]);

  return (
    <button
      onClick={handleButtonClick}
      style={{
        padding: '10px 20px',
        backgroundColor: isActive ? 'green' : 'gray',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: isActive ? 'not-allowed' : 'pointer',
      }}
      disabled={isActive || !user || !user.id}
    >
      {isActive ? 'Active' : 'Add Profit'}
    </button>
  );
}
