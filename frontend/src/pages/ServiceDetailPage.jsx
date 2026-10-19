import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Wifi, CheckCircle, MessageSquare, Star, ChevronLeft, Share2 } from 'lucide-react'
import { serviceApi, bookingApi, reviewApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/common/StarRating'
import ReviewCard from '../components/services/ReviewCard'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [service, setService]   = useState(null)
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [booking, setBooking]   = useState(false)
  const [scheduleDate, setDate] = useState('')
  const [notes, setNotes]       = useState('')
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    Promise.all([
      serviceApi.getById(id),
      reviewApi.getServiceReviews(id, { page: 0, size: 5 })
    ]).then(([sRes, rRes]) => {
      setService(sRes.data)
      setReviews(rRes.data.content || [])
    }).catch(() => toast.error('Service not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!scheduleDate) { toast.error('Please select a date'); return }
    setBooking(true)
    try {
      await bookingApi.create({ serviceId: id, scheduledAt: new Date(scheduleDate).toISOString(), notes })
      toast.success('Booking request sent!')
      navigate('/bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  const isOwner = user && service && user.id === service.providerId

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  if (!service) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-slate-400">Service not found</div>
    </div>
  )

  const images = service.images?.length ? service.images : [null]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="page-container py-8 flex-1">
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to Services
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="card overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary-50 to-primary-100">
                {images[activeImg] ? (
                  <img src={images[activeImg]} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-display font-bold text-primary-200">
                    {service.category?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === activeImg ? 'border-primary-500' : 'border-transparent'}`}>
                      {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary-50" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & provider */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <span className="badge badge-primary capitalize mb-2">{service.category}</span>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{service.title}</h1>
                </div>
                <button className="btn-ghost p-2 rounded-xl"><Share2 size={18} /></button>
              </div>

              <Link to={`/providers/${service.providerId}`} className="flex items-center gap-3 group">
                <img
                  src={service.providerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.providerName)}&background=6272f3&color=fff`}
                  alt={service.providerName}
                  className="w-11 h-11 rounded-full border-2 border-primary-100 object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">{service.providerName}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <StarRating rating={service.providerRating || 0} size={11} />
                    <span>{service.providerRating?.toFixed(1) || '—'}</span>
                    {service.reviewCount > 0 && <span>· {service.reviewCount} reviews</span>}
                  </div>
                </div>
              </Link>
            </div>

            {/* Tags */}
            {service.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="badge badge-slate">#{tag}</span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 mb-3">About this service</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {/* Features */}
            {service.features?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-slate-900 mb-4">What's included</h2>
                <ul className="space-y-2.5">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Reviews {service.reviewCount > 0 && `(${service.reviewCount})`}
                </h2>
                {service.reviewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-slate-900">{service.rating?.toFixed(1)}</span>
                    <StarRating rating={service.rating || 0} size={16} />
                  </div>
                )}
              </div>
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No reviews yet. Be the first!</p>
              ) : (
                <div>{reviews.map(r => <ReviewCard key={r.id} review={r} />)}</div>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-end gap-2 mb-1">
                <span className="font-display text-3xl font-bold text-slate-900">${service.price}</span>
                <span className="text-slate-400 text-sm mb-1">
                  / {service.priceType === 'HOURLY' ? 'hour' : service.priceType === 'DAILY' ? 'day' : 'project'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-5 pt-3 border-t border-slate-100">
                {service.deliveryTime && (
                  <span className="flex items-center gap-1"><Clock size={12} />{service.deliveryTime}</span>
                )}
                {service.isRemote ? (
                  <span className="flex items-center gap-1 text-emerald-600"><Wifi size={12} /> Remote</span>
                ) : service.location && (
                  <span className="flex items-center gap-1"><MapPin size={12} />{service.location}</span>
                )}
              </div>

              {isOwner ? (
                <Link to={`/services/${id}/edit`} className="btn-secondary w-full mb-3">Edit Service</Link>
              ) : (
                <>
                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="label">Schedule Date & Time</label>
                      <input type="datetime-local" value={scheduleDate}
                        onChange={e => setDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="input" />
                    </div>
                    <div>
                      <label className="label">Notes (optional)</label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)}
                        rows={3} placeholder="Describe your requirements…"
                        className="input resize-none" />
                    </div>
                  </div>

                  <button onClick={handleBook} disabled={booking || !user}
                    className="btn-primary w-full btn-lg mb-3">
                    {booking ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : user ? 'Book Now' : 'Sign In to Book'}
                  </button>

                  <Link to={`/messages/${service.providerId}`}
                    className="btn-secondary w-full justify-center gap-2">
                    <MessageSquare size={15} /> Message Provider
                  </Link>
                </>
              )}

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                {[['Total Bookings', service.totalBookings || 0], ['Rating', `${service.rating?.toFixed(1) || '—'} / 5`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-slate-400">{k}</span>
                    <span className="font-semibold text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
