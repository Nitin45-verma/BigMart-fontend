import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { FiMessageSquare, FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi';

const SupportDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getSupportStats();
        setStats(res.data);
      } catch (err) {
        addToast('Failed to load support statistics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [addToast]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading support dashboard...</div>;
  }

  const cards = [
    { name: 'Total Tickets', value: stats?.totalTickets || 0, icon: FiMessageSquare, color: 'bg-blue-100 text-blue-600' },
    { name: 'Open Tickets', value: stats?.openTickets || 0, icon: FiClock, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Escalated', value: stats?.escalatedTickets || 0, icon: FiAlertCircle, color: 'bg-red-100 text-red-600' },
    { name: 'Resolved', value: stats?.resolvedTickets || 0, icon: FiCheckCircle, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support Helpdesk</h1>
        <Link to="/admin/support/tickets" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium text-sm shadow-sm">
          View All Tickets
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5 flex items-center">
              <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Support & Disputes Management</h2>
        <p className="text-gray-500 mb-4">
          The Support Helpdesk allows administrators to mediate disputes, assist customers, and support sellers.
        </p>
        <Link to="/admin/support/tickets" className="text-indigo-600 hover:text-indigo-800 font-medium">
          Manage Tickets &rarr;
        </Link>
      </div>
    </div>
  );
};

export default SupportDashboard;
