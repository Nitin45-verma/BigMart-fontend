import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await adminApi.getSupportTickets();
        setTickets(res.data.tickets || res.data);
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load tickets', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [addToast]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'resolved':
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading tickets...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No tickets found.</td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{t.ticketNumber || t._id.substring(0,8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{t.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(t.status)}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/support/tickets/${t._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
