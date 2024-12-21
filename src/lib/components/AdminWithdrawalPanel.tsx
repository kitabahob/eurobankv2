import { useState } from 'react';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'delayed' | 'canceled' | 'completed';
  reason?: string;
}

interface AdminWithdrawalPanelProps {
  withdrawal: Withdrawal;
}

const AdminWithdrawalPanel = ({ withdrawal }: AdminWithdrawalPanelProps) => {
  const [status, setStatus] = useState(withdrawal.status);
  const [reason, setReason] = useState(withdrawal.reason || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: 'pending' | 'delayed' | 'canceled' | 'completed') => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/admin/withdrawals/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: withdrawal.id,
          status: newStatus,
          reason: newStatus === 'delayed' || newStatus === 'canceled' ? reason : undefined,
          userId: withdrawal.userId,
          amount: withdrawal.amount,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Withdrawal status updated successfully');
        setStatus(newStatus);
      } else {
        setError(result.error || 'An error occurred while updating the status');
      }
    } catch (error) {
      setError('Failed to update withdrawal status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Withdrawal Details</h2>
      <p><strong>Amount:</strong> {withdrawal.amount}</p>
      <p><strong>Status:</strong> {status}</p>

      {['delayed', 'canceled'].includes(status) && (
        <div>
          <label>
            Reason:
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading || status !== 'delayed' && status !== 'canceled'}
            />
          </label>
        </div>
      )}

      <div>
        <button onClick={() => handleStatusChange('pending')} disabled={loading}>
          Set Pending
        </button>
        <button onClick={() => handleStatusChange('delayed')} disabled={loading}>
          Set Delayed
        </button>
        <button onClick={() => handleStatusChange('canceled')} disabled={loading}>
          Set Canceled
        </button>
        <button onClick={() => handleStatusChange('completed')} disabled={loading}>
          Set Completed
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AdminWithdrawalPanel;
