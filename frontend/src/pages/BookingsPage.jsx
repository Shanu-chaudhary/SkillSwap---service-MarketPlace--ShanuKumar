import { useState, useEffect } from 'react'
import { bookingApi, reviewApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import BookingCard from '../components/booking/BookingCard'
import Navbar from '../components/common/Navbar'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const TABS = ['As Client', 'As Provider']

export default function BookingsPage() {
  const { isProvider } = useAuth()
  const [tab, setTab] = useState(isProvider ? 0 : 0)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]  = useState(true)
  const [page, setPage]        = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Review modal state
  const [reviewModal, setReviewModal] = useState(null) // bookingId
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      let res
      if (tab === 0) {
        res = await bookingApi.getMyBookings({ page, size: 10 })
      } else {
        res = await bookingApi.getProviderBookings({ page, size: 10 })
      }
      setBookings(res.data?.content || [])
      setTotalPages(res.data?.totalPages || 0)
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [tab, page])

  const handleAction = async (id, action) => {
    if (action === 'REVIEW') {
      setReviewModal(id)
      return
    }
    try {
      await bookingApi.updateStatus(id, { status: action })
      toast.success(`Booking ${action.toLowerCase()}`)
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const submitReview = async () => {
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return }
    setSubmittingReview(true)
    try {
      await reviewApi.create({ bookingId: reviewModal, rating: reviewRating, comment: reviewComment })
      toast.success('Review submitted!')
      setReviewModal(null)
      setReviewComment('')
      setReviewRating(5)
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="page-container py-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 w-fit mb-6">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => { setTab(i); setPage(0) }}
              className={clsx('px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                tab === i ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800')}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5 flex gap-4 animate-pulse">
                <div className="w-20 h-20 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display text-lg font-bold text-slate-700 mb-2">No bookings yet</h3>
            <p className="text-sm text-slate-400">
              {tab === 0 ? 'Browse services and make your first booking.' : 'Post a service to start receiving bookings.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <BookingCard key={b.id} booking={b} isProvider={tab === 1} onAction={handleAction} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={clsx('w-9 h-9 rounded-xl text-sm font-semibold border transition-all',
                  page === i ? 'bg-primary-600 text-white border-transparent' : 'bg-white text-slate-600 border-slate-200')}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-scale-in">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4">Leave a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setReviewRating(n)}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= reviewRating ? 'text-amber-400' : 'text-slate-200'}`}>
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Share your experience with this service…"
              rows={4}
              className="input resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={submitReview} disabled={submittingReview} className="btn-primary flex-1">
                {submittingReview ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
