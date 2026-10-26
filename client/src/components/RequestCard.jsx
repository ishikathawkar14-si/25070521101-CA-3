import React, { useState } from 'react';
import {
  Check,
  X,
  Clock,
  ArrowRightLeft,
  Mail,
  MessageSquare,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const RequestCard = ({
  request,
  type = 'incoming', // 'incoming' or 'outgoing'
  onAccept,
  onReject,
  onCancel,
  loadingId,
}) => {
  const [showResponseBox, setShowResponseBox] = useState(false);
  const [responseNote, setResponseNote] = useState('');
  const [exchangeLocation, setExchangeLocation] = useState('');

  const isIncoming = type === 'incoming';
  const partner = isIncoming ? request.sender : request.receiver;
  const partnerRole = isIncoming ? 'Requested by' : 'Sent to';

  const statusColors = {
    pending: { badge: 'badge-warning', text: 'Pending Proposal', icon: Clock },
    accepted: { badge: 'badge-success', text: 'Exchange Accepted', icon: Check },
    rejected: { badge: 'badge-danger', text: 'Declined', icon: X },
    completed: { badge: 'badge-secondary', text: 'Completed', icon: Check },
  };

  const currentStatus = statusColors[request.status] || statusColors.pending;
  const StatusIcon = currentStatus.icon;

  const handleAcceptSubmit = () => {
    onAccept(request._id, responseNote, exchangeLocation);
    setShowResponseBox(false);
  };

  return (
    <div
      className="card"
      style={{
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        marginBottom: '1rem',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Top Bar: Partner and Status */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={
              partner?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
            }
            alt={partner?.name || 'Student'}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e0e7ff',
            }}
          />
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {partnerRole}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              {partner?.name || 'Student'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {partner?.major || 'Campus'} • {partner?.year || 'Student'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${currentStatus.badge}`}>
            <StatusIcon style={{ width: '12px', height: '12px' }} />
            {currentStatus.text}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {new Date(request.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Exchange Details: Requested vs Offered */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.25rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', marginBottom: '2px' }}>
            Skill Requested
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
            {request.skillRequested?.title || 'Selected Skill'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {request.skillRequested?.category} • {request.skillRequested?.level}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '2px' }}>
            Offered in Return
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#065f46' }}>
            {request.skillOffered}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Proposed by {request.sender?.name || 'requester'}
          </div>
        </div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MessageSquare style={{ width: '14px', height: '14px' }} />
          Proposal Note:
        </div>
        <p style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.5, background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
          "{request.message}"
        </p>
      </div>

      {/* Exchange Mode Preference */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
        <MapPin style={{ width: '14px', height: '14px', color: '#8b5cf6' }} />
        <span>Preferred Mode: <strong>{request.preferredMode}</strong></span>
      </div>

      {/* Accepted State Details: Reveal Contact Info */}
      {request.status === 'accepted' && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
            <Check style={{ width: '16px', height: '16px' }} />
            Connected! Contact details unlocked:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#047857' }}>
            <div>
              Email: <strong>{partner?.email}</strong>
            </div>
            {partner?.contactInfo?.discord && (
              <div>
                Discord: <strong>{partner.contactInfo.discord}</strong>
              </div>
            )}
            {partner?.contactInfo?.telegram && (
              <div>
                Telegram: <strong>{partner.contactInfo.telegram}</strong>
              </div>
            )}
          </div>
          {request.responseNote && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#065f46', fontStyle: 'italic' }}>
              Note from {request.receiver?.name}: "{request.responseNote}"
            </div>
          )}
          {request.exchangeLocation && (
            <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#065f46' }}>
              Meeting Location/Link: <strong>{request.exchangeLocation}</strong>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons for Incoming Request */}
      {isIncoming && request.status === 'pending' && !showResponseBox && (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => onReject(request._id)}
            disabled={loadingId === request._id}
            className="btn btn-secondary btn-sm"
          >
            <X style={{ width: '14px', height: '14px' }} />
            Decline
          </button>
          <button
            type="button"
            onClick={() => setShowResponseBox(true)}
            className="btn btn-success btn-sm"
          >
            <Check style={{ width: '14px', height: '14px' }} />
            Accept Proposal
          </button>
        </div>
      )}

      {/* Accept Proposal with Response Note Box */}
      {isIncoming && request.status === 'pending' && showResponseBox && (
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '0.75rem',
          }}
        >
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
            Accept & Set Meeting Info
          </h4>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Message for {request.sender?.name} (e.g. your Discord tag, preferred library table, or Zoom link)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sounds great! Let's meet at Student Center 2nd floor on Thursday 4 PM."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Specific Location / Meeting Link (optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Library Study Pod 4 or https://zoom.us/j/..."
              value={exchangeLocation}
              onChange={(e) => setExchangeLocation(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowResponseBox(false)}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAcceptSubmit}
              disabled={loadingId === request._id}
              className="btn btn-success btn-sm"
            >
              <Check style={{ width: '14px', height: '14px' }} />
              Confirm & Connect
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons for Outgoing Request */}
      {!isIncoming && request.status === 'pending' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => onCancel(request._id)}
            disabled={loadingId === request._id}
            className="btn btn-secondary btn-sm"
          >
            <X style={{ width: '14px', height: '14px' }} />
            Cancel Request
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
