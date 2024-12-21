'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Search 
} from 'lucide-react';

// Define types for withdrawal requests
interface WithdrawalRequest {
  id: string;
  user_id?: string;
  username?: string;
  amount: number;
  status: 'pending' | 'delayed' | 'completed' | 'cancelled';
  requestDate: string;
  method: string;
  wallet_address:string;
}

const WithdrawalRequestCard = ({ request, onUpdateStatus }: {
  request: WithdrawalRequest;
  onUpdateStatus: (id: string, newStatus: 'completed' | 'delayed' | 'cancelled') => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg text-blue-800">#{request.user_id || 'N/A'}</span>
          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
            {request.status.toUpperCase()}
          </span>
        </div>
        <div className="text-gray-500 text-sm">{request.requestDate}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-gray-700">{request.username || 'Unknown User'}</div>
          <div className="text-gold-600 font-bold text-xl">${request.amount.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">{request.method}</div>
        </div>
        
        <div className="flex space-x-2">
          {request.status === 'pending' && (
            <>
              <button 
                onClick={() => onUpdateStatus(request.id, 'completed')}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                title="Complete Request"
              >
                <CheckCircle size={20} />
              </button>
              <button 
                onClick={() => onUpdateStatus(request.id, 'delayed')}
                className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
                title="Delay Request"
              >
                <Clock size={20} />
              </button>
              <button 
                onClick={() => onUpdateStatus(request.id, 'cancelled')}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                title="Cancel Request"
              >
                <XCircle size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminWithdrawalDashboard = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delayed' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/withdrawals/pending');
        const data = await response.json();
        if (response.ok) {
          setRequests(data.withdrawals);
        } else {
          setError(data.error || 'Failed to fetch withdrawals');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const updateRequestStatus = async (id: string, newStatus: 'completed' | 'delayed' | 'cancelled') => {
    try {
      const request = requests.find(req => req.id === id);
      if (!request) {
        throw new Error('Request not found');
      }

      const response = await fetch('/api/admin/withdrawals/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          userId: request.user_id,
          amount: request.amount,
          reason: newStatus === 'delayed' || newStatus === 'cancelled' ? 'Admin decision' : undefined,
          wallet_address:request.wallet_address
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update withdrawal status');
      }

      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to update request');
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch =
      (request.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.user_id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    delayed: requests.filter(r => r.status === 'delayed').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-900 flex items-center">
              <Award className="mr-3 text-gold-500" size={36} />
              Withdrawal Requests
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div 
                  key={status}
                  onClick={() => setFilter(status as typeof filter)}
                  className={`
                    p-4 rounded-lg text-center cursor-pointer transition 
                    ${filter === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-900 hover:bg-blue-100'}
                  `}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm uppercase">{status} Requests</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map(request => (
                <WithdrawalRequestCard 
                  key={request.id} 
                  request={request}
                  onUpdateStatus={updateRequestStatus}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawalDashboard;
