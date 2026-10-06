import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { useSelector } from 'react-redux';

const SupportTicketDetails = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('open');
  const { addToast } = useToast();
  const { user } = useSelector(state => state.auth);

  const fetchTicket = async () => {
    try {
      const res = await adminApi.getSupportTicket(ticketId);
      setTicket(res.data.ticket || res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load ticket details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId, addToast]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setReplying(true);
    try {
      await adminApi.addSupportMessage(ticketId, { message: replyMessage });
      setReplyMessage('');
      fetchTicket();
      addToast('Reply sent', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send reply', 'error');
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.changeSupportStatus(ticketId, { status: newStatus });
      addToast('Status updated', 'success');
      setStatusModalOpen(false);
      fetchTicket();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleAction = async (action) => {
    try {
      if (action === 'status') {
        setNewStatus(ticket.status);
        setStatusModalOpen(true);
        return;
      } else if (action === 'assign') {
        if (!window.confirm('Assign ticket to yourself?')) return;
        await adminApi.assignSupportTicket(ticketId, { adminId: user._id });
      } else if (action === 'escalate') {
        if (!window.confirm('Escalate ticket?')) return;
        await adminApi.escalateSupportTicket(ticketId, { reason: 'Admin escalation' });
      } else if (action === 'resolve') {
        if (!window.confirm('Resolve ticket?')) return;
        await adminApi.changeSupportStatus(ticketId, { status: 'resolved' });
      }
      fetchTicket();
      addToast(`Action ${action} completed`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading ticket...</div>;
  }
  
  if (!ticket) return <div className="p-8 text-center text-gray-500">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.ticketNumber || ticket._id.substring(0,8)}</h1>
        <Link to="/admin/support/tickets" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          &larr; Back to Tickets
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{ticket.subject}</h2>
          <div className="mt-2 flex space-x-4 text-sm text-gray-500">
            <span>Status: <span className="font-medium text-gray-900 capitalize">{ticket.status.replace('_', ' ')}</span></span>
            <span>Priority: <span className="font-medium text-gray-900 capitalize">{ticket.priority}</span></span>
            <span>Category: <span className="font-medium text-gray-900 capitalize">{ticket.category}</span></span>
          </div>
          <div className="mt-4 flex space-x-3">
            <button onClick={() => handleAction('status')} className="text-sm bg-white border border-gray-300 px-3 py-1 rounded shadow-sm hover:bg-gray-50">Change Status</button>
            <button onClick={() => handleAction('assign')} className="text-sm bg-white border border-gray-300 px-3 py-1 rounded shadow-sm hover:bg-gray-50">Assign to Me</button>
            <button onClick={() => handleAction('escalate')} className="text-sm bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded shadow-sm hover:bg-red-100">Escalate</button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              {ticket.messages?.map((msg, idx) => (
                <div key={idx} className={`p-4 rounded-lg max-w-2xl ${msg.isAdmin ? 'bg-indigo-50 ml-auto border border-indigo-100' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span className="font-medium text-gray-900">{msg.isAdmin ? 'Admin Support' : 'Customer/Seller'}</span>
                    <span>{new Date(msg.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleReply} className="mt-8 border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reply to Ticket</label>
              <textarea 
                rows={4} 
                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                disabled={ticket.status === 'closed'}
              ></textarea>
              <div className="mt-3 flex justify-end">
                <button 
                  type="submit" 
                  disabled={replying || !replyMessage.trim() || ticket.status === 'closed'}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {replying ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setStatusModalOpen(false)}></div>
            <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Change Status</h3>
              <form onSubmit={handleStatusChangeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="escalated">Escalated</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
                  <button type="button" onClick={() => setStatusModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketDetails;
