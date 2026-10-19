import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Star, CheckCircle, Clock, Plus, ArrowRight, TrendingUp, MessageSquare } from 'lucide-react'
import { userApi, serviceApi, bookingApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import ServiceCard from '../components/services/ServiceCard'
import BookingCard from '../components/booking/BookingCard'
import Navbar from '../components/common/Navbar'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, isProvider } = useAuth()
  const [stats, setStats]       = useState(null)
  const [myServices, setMyServices]     = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      userApi.getDashboard(),
      isProvider ? serviceApi.getMyServices() : Promise.resolve({ data: [] }),
      bookingApi.getMyBookings({ page: 0, size: 5 }),
    ]).then(([statsRes, servRes, bookRes]) => {
      setStats(statsRes.data)
      setMyServices(servRes.data?.content || servRes.data || [])
      setRecentBookings(bookRes.data?.content || [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [isProvider])

  const handleBookingAction = async (id, action) => {
    if (action === 'REVIEW') return // handle separately
    try {
      await bookingApi.updateStatus(id, { status: action })
      toast.success(`Booking ${action.toLowerCase()}`)
      const res = await bookingApi.getMyBookings({ page: 0, size: 5 })
      setRecentBookings(res.data?.content || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const STAT_CARDS = [
    { label: 'Total Bookings',     value: stats?.totalBookings    || 0, icon: Briefcase,    color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending',            value: stats?.pendingBookings  || 0, icon: Clock,        color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed',          value: stats?.completedBookings|| 0, icon: CheckCircle,  color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rating',             value: stats?.rating ? `${stats.rating.toFixed(1)}★` : '—', icon: Star, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="page-container py-8">
        {/* Welcome */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Here's what's happening with your account</p>
          </div>
          <div className="flex gap-2">
            <Link to="/messages" className="btn-secondary gap-2"><MessageSquare size={15} />Messages</Link>
            <Link to="/services/new" className="btn-primary gap-2"><Plus size={15} />Post Service</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-slate-900">{loading ? '—' : s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900">Recent Bookings</h2>
              <Link to="/bookings" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="card p-10 text-center text-slate-400">
                <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">No bookings yet</p>
                <p className="text-xs mt-1">Browse services to make your first booking</p>
                <Link to="/services" className="btn-primary btn-sm mt-4 inline-flex">Browse Services</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map(b => (
                  <BookingCard key={b.id} booking={b} isProvider={isProvider} onAction={handleBookingAction} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Profile card */}
            <div className="card p-5 text-center">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6272f3&color=fff&size=80`}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 border-2 border-primary-100"
              />
              <p className="font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              {user?.rating > 0 && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold">{user.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({user.reviewCount})</span>
                </div>
              )}
              <Link to="/profile" className="btn-secondary btn-sm w-full mt-4">Edit Profile</Link>
            </div>

            {/* Quick links */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-700 text-sm mb-3">Quick Actions</h3>
              <div className="space-y-1.5">
                {[
                  { to: '/services/new', label: '+ Post a Service', primary: true },
                  { to: '/bookings',     label: 'View All Bookings' },
                  { to: '/messages',     label: 'Open Messages' },
                  { to: '/profile',      label: 'Update Profile' },
                ].map(l => (
                  <Link key={l.to} to={l.to}
                    className={`block px-3 py-2 rounded-xl text-sm transition-colors ${l.primary ? 'bg-primary-50 text-primary-700 font-semibold hover:bg-primary-100' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My services */}
        {isProvider && myServices.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900">My Services</h2>
              <Link to="/services/new" className="btn-primary btn-sm gap-1.5"><Plus size={13} />Add New</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {myServices.slice(0, 4).map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        )}

        {!isProvider && (
          <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-1">Start earning on SkillSwap</h3>
              <p className="text-primary-200 text-sm">Share your skills and build your client base.</p>
            </div>
            <Link to="/services/new" className="btn bg-white text-primary-700 hover:bg-primary-50 gap-2">
              <Plus size={16} /> Post Your First Service
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
