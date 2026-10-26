import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

export const ExchangeRequestsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
  const [statusFilter, setStatusFilter] = useState('all');

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [counts, setCounts] = useState({ receivedPending: 0, receivedTotal: 0, sentTotal: 0, acceptedTotal: 0 });

  const [loading, setLoading] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  // Confirm cancel or reject modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getMyExchanges();
      if (res.success) {
        setReceivedRequests(res.received || []);
        setSentRequests(res.sent || []);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch exchange requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleAcceptRequest = async (requestId, responseNote, exchangeLocation) => {
    try {
      setLoadingActionId(requestId);
      const res = await api.updateExchangeStatus(requestId, 'accepted', responseNote, exchangeLocation);
      if (res.success) {
        setToastMessage('Proposal accepted! Contact details are now unlocked.');
        fetchExchanges();
      }
    } catch (err) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setLoadingActionId(null);
    }
  };

  const promptRejectRequest = (requestId) => {
    setActionToConfirm({
      type: 'reject',
      id: requestId,
      title: 'Decline Skill Exchange Proposal',
      message: 'Are you sure you want to decline this exchange request? You can always accept other requests.',
      confirmText: 'Decline Proposal',
      isDanger: true,
    });
    setConfirmModalOpen(true);
  };

  const promptCancelRequest = (requestId) => {
    setActionToConfirm({
      type: 'cancel',
      id: requestId,
      title: 'Cancel Outgoing Request',
      message: 'Are you sure you want to cancel your swap request to this student?',
      confirmText: 'Cancel Request',
      isDanger: true,
    });
    setConfirmModalOpen(true);
  };

  const handleExecuteConfirmAction = async () => {
    if (!actionToConfirm) return;
    const { type, id } = actionToConfirm;
    setConfirmModalOpen(false);

    try {
      setLoadingActionId(id);
      if (type === 'reject') {
        const res = await api.updateExchangeStatus(id, 'rejected');
        if (res.success) {
          setToastMessage('Proposal declined.');
          fetchExchanges();
        }
      } else if (type === 'cancel') {
        const res = await api.deleteExchange(id);
        if (res.success) {
          setToastMessage('Exchange request cancelled.');
          fetchExchanges();
        }
      }
    } catch (err) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setLoadingActionId(null);
      setActionToConfirm(null);
    }
  };

  // Filter requests based on tab and status
  const currentList = activeTab === 'incoming' ? receivedRequests : sentRequests;
  const filteredList = currentList.filter((req) => {
    if (statusFilter === 'all') return true;
    return req.status === statusFilter;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 0 4rem' }}>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Collaboration Hub
          </span>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginTop: '0.25rem' }}>
            Skill Exchange Requests
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Review incoming proposals from peers, accept exchanges, and track requests you've sent.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '12px',
              border: '1px solid #fecaca',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('incoming');
              setStatusFilter('all');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderBottom: activeTab === 'incoming' ? '3px solid #4f46e5' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'incoming' ? '#4f46e5' : '#64748b',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Inbox style={{ width: '18px', height: '18px' }} />
            Incoming Requests
            {counts.receivedPending > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  padding: '2px 8px',
                }}
              >
                {counts.receivedPending}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('outgoing');
              setStatusFilter('all');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderBottom: activeTab === 'outgoing' ? '3px solid #4f46e5' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'outgoing' ? '#4f46e5' : '#64748b',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Send style={{ width: '18px', height: '18px' }} />
            Outgoing Requests ({sentRequests.length})
          </button>
        </div>

        {/* Status Sub-Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'pending', 'accepted', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: statusFilter === st ? '#4f46e5' : '#e2e8f0',
                  backgroundColor: statusFilter === st ? '#4f46e5' : '#ffffff',
                  color: statusFilter === st ? '#ffffff' : '#64748b',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                }}
              >
                {st === 'all' ? 'All Statuses' : st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchExchanges}
            className="btn btn-secondary btn-sm"
            title="Refresh List"
          >
            <RotateCcw style={{ width: '14px', height: '14px' }} />
            Refresh
          </button>
        </div>

        {/* Request Cards List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Loader text="Loading your exchange proposals..." />
          </div>
        ) : filteredList.length > 0 ? (
          <div>
            {filteredList.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                type={activeTab}
                onAccept={handleAcceptRequest}
                onReject={promptRejectRequest}
                onCancel={promptCancelRequest}
                loadingId={loadingActionId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ArrowRightLeft}
            title={
              activeTab === 'incoming'
                ? 'No incoming requests found'
                : 'No outgoing requests found'
            }
            description={
              activeTab === 'incoming'
                ? 'When students want to learn what you offer, their proposals will show up here.'
                : 'Browse the Explore Skills catalog to find peers and send your first exchange proposal!'
            }
            actionText={activeTab === 'outgoing' ? 'Explore Campus Skills' : 'Post a Skill to Receive Requests'}
            actionLink={activeTab === 'outgoing' ? '/explore' : '/skills/new'}
          />
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title={actionToConfirm?.title || 'Confirm'}
        message={actionToConfirm?.message || 'Are you sure?'}
        confirmText={actionToConfirm?.confirmText || 'Confirm'}
        isDanger={actionToConfirm?.isDanger}
        onConfirm={handleExecuteConfirmAction}
        onCancel={() => {
          setConfirmModalOpen(false);
          setActionToConfirm(null);
        }}
      />
    </div>
  );
};

export default ExchangeRequestsPage;
