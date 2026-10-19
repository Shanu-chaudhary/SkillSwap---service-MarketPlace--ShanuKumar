import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, MessageSquare, Briefcase, CheckCircle } from 'lucide-react'
import { userApi, serviceApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import ServiceCard from '../components/services/ServiceCard'
import StarRating from '../components/common/StarRating'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function ProviderProfilePage() {
  const { id }  = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [provider, setProvider]   = useState(null)
  const [services, setServices]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      userApi.getProfile(id),
      serviceApi.getProviderServices(id),
    ]).then(([uRes, sRes]) => {
      setProvider(uRes.data)
      setServices(sRes.data || [])
    }).catch(() => toast.error('Provider not found'))
      .finally(() => setLoading(false))
  }, [id])

  const isOwnProfile = user?.id === id

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  if (!provider) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center text-slate-400">Provider not found</div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="page-container py-8 flex-1">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="space-y-5">
            <div className="card p-6 text-center">
              <img
                src={provider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=6272f3&color=fff&size=100`}
                alt={provider.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 border-2 border-primary-100"
              />
              <h1 className="font-display text-xl font-bold text-slate-900">{provider.name}</h1>
              {provider.location && (
                <p className="flex items-center justify-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin size={12} /> {provider.location}
                </p>
              )}

              {provider.rating > 0 && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <StarRating rating={provider.rating} size={14} />
                  <span className="font-semibold text-slate-700">{provider.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({provider.reviewCount})</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="font-display font-bold text-slate-900">{services.length}</div>
                  <div className="text-xs text-slate-400">Services</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="font-display font-bold text-slate-900">{provider.completedBookings || 0}</div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
              </div>

              {!isOwnProfile && user && (
                <Link to={`/messages/${id}`} className="btn-primary w-full mt-5 gap-2 justify-center">
                  <MessageSquare size={15} /> Send Message
                </Link>
              )}
              {isOwnProfile && (
                <Link to="/profile" className="btn-secondary w-full mt-5">Edit Profile</Link>
              )}
            </div>

            {/* Bio */}
            {provider.bio && (
              <div className="card p-5">
                <h3 className="font-semibold text-sm text-slate-700 mb-2">About</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{provider.bio}</p>
              </div>
            )}

            {/* Skills */}
            {provider.skills?.size > 0 || provider.skills?.length > 0 ? (
              <div className="card p-5">
                <h3 className="font-semibold text-sm text-slate-700 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {[...(provider.skills || [])].map(skill => (
                    <span key={skill} className="badge badge-slate">{skill}</span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="card p-5">
              <h3 className="font-semibold text-sm text-slate-700 mb-2">Member Since</h3>
              <p className="text-sm text-slate-500">
                {provider.createdAt ? format(new Date(provider.createdAt), 'MMMM yyyy') : '—'}
              </p>
              {provider.emailVerified && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600">
                  <CheckCircle size={13} /> Email verified
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-5">
              {isOwnProfile ? 'My Services' : `Services by ${provider.name?.split(' ')[0]}`}
              <span className="text-base font-normal text-slate-400 ml-2">({services.length})</span>
            </h2>
            {services.length === 0 ? (
              <div className="card p-12 text-center">
                <Briefcase size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No services yet</p>
                {isOwnProfile && (
                  <Link to="/services/new" className="btn-primary btn-sm mt-4 inline-flex">Post Your First Service</Link>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(s => <ServiceCard key={s.id} service={s} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
