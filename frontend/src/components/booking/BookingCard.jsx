import { Link } from 'react-router-dom'
import { Calendar, Clock, MessageSquare, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     color: 'badge-orange', icon: Clock },
  CONFIRMED:   { label: 'Confirmed',   color: 'badge-primary', icon: CheckCircle },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Loader },
  COMPLETED:   { label: 'Completed',   color: 'badge-green', icon: CheckCircle },
  CANCELLED:   { label: 'Cancelled',   color: 'badge-red', icon: XCircle },
  DISPUTED:    { label: 'Disputed',    color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
}

export default function BookingCard({ booking, isProvider = false, onAction }) {
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING
  const StatusIcon = cfg.icon

  return (
    <div className="card p-5 flex flex-col sm:flex-row gap-4">
      {/* Thumbnail */}
      <div className="w-full sm:w-20 h-20 rounded-xl bg-primary-50 overflow-hidden shrink-0">
        {booking.serviceThumbnail ? (
          <img src={booking.serviceThumbnail} alt={booking.serviceTitle}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary-300 font-display font-bold text-xl">
            {booking.serviceTitle?.[0] || 'S'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug">{booking.serviceTitle}</h3>
          <span className={clsx('badge', cfg.color)}>
            <StatusIcon size={10} />
            {cfg.label}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-2">
          {isProvider ? `Client: ${booking.clientName}` : `Provider: ${booking.providerName}`}
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
          {booking.scheduledAt && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {format(new Date(booking.scheduledAt), 'MMM d, yyyy h:mm a')}
            </span>
          )}
          <span className="font-semibold text-slate-700">${booking.amount}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link to={`/messages/${isProvider ? booking.clientId : booking.providerId}`}
            className="btn-ghost btn-sm gap-1.5 text-xs">
            <MessageSquare size={12} /> Message
          </Link>

          {isProvider && booking.status === 'PENDING' && (
            <>
              <button onClick={() => onAction(booking.id, 'CONFIRMED')}
                className="btn-primary btn-sm text-xs">Accept</button>
              <button onClick={() => onAction(booking.id, 'CANCELLED')}
                className="btn-danger btn-sm text-xs">Decline</button>
            </>
          )}

          {isProvider && booking.status === 'CONFIRMED' && (
            <button onClick={() => onAction(booking.id, 'COMPLETED')}
              className="btn-primary btn-sm text-xs">Mark Complete</button>
          )}

          {!isProvider && booking.status === 'PENDING' && (
            <button onClick={() => onAction(booking.id, 'CANCELLED')}
              className="btn-danger btn-sm text-xs">Cancel</button>
          )}

          {!isProvider && booking.status === 'COMPLETED' && !booking.reviewed && (
            <button onClick={() => onAction(booking.id, 'REVIEW')}
              className="btn-outline btn-sm text-xs">Leave Review</button>
          )}
        </div>
      </div>
    </div>
  )
}
