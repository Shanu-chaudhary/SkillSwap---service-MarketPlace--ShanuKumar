import { format } from 'date-fns'
import StarRating from '../common/StarRating'
import { MessageSquare } from 'lucide-react'

export default function ReviewCard({ review, onRespond, isProvider }) {
  return (
    <div className="border-b border-slate-100 last:border-0 py-5">
      <div className="flex items-start gap-3">
        <img
          src={review.reviewerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName || 'U')}&background=6272f3&color=fff&size=40`}
          alt={review.reviewerName}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-slate-800 text-sm">{review.reviewerName}</span>
            <StarRating rating={review.rating} size={12} />
            <span className="text-xs text-slate-400 ml-auto">
              {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : ''}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>

          {review.providerResponse && (
            <div className="mt-3 bg-primary-50 rounded-xl p-3.5 border-l-4 border-primary-400">
              <p className="text-xs font-semibold text-primary-700 mb-1">Provider Response</p>
              <p className="text-sm text-slate-600">{review.providerResponse}</p>
            </div>
          )}

          {isProvider && !review.providerResponse && onRespond && (
            <button
              onClick={() => onRespond(review.id)}
              className="mt-2 btn-ghost btn-sm text-xs gap-1">
              <MessageSquare size={11} /> Respond
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
