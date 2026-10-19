import { Link } from 'react-router-dom'
import { MapPin, Clock, Star, Wifi } from 'lucide-react'
import StarRating from '../common/StarRating'
import clsx from 'clsx'

const CATEGORY_COLORS = {
  development: 'badge-primary',
  design:      'bg-purple-100 text-purple-700',
  marketing:   'bg-pink-100 text-pink-700',
  writing:     'bg-emerald-100 text-emerald-700',
  video:       'bg-red-100 text-red-700',
  music:       'bg-yellow-100 text-yellow-700',
  business:    'bg-blue-100 text-blue-700',
  default:     'badge-slate',
}

export default function ServiceCard({ service }) {
  const catColor = CATEGORY_COLORS[service.category?.toLowerCase()] || CATEGORY_COLORS.default

  return (
    <Link to={`/services/${service.id}`} className="card card-hover block group overflow-hidden">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
        {service.thumbnail ? (
          <img src={service.thumbnail} alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-primary-300">
              {service.category?.[0]?.toUpperCase() || 'S'}
            </span>
          </div>
        )}
        <span className={clsx('badge absolute top-3 left-3 capitalize', catColor)}>
          {service.category}
        </span>
        {service.isRemote && (
          <span className="badge badge-green absolute top-3 right-3">
            <Wifi size={10} /> Remote
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Provider */}
        <div className="flex items-center gap-2 mb-2.5">
          <img
            src={service.providerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.providerName || 'U')}&background=6272f3&color=fff&size=32`}
            alt={service.providerName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs font-medium text-slate-500 truncate">{service.providerName}</span>
          {service.providerRating > 0 && (
            <div className="flex items-center gap-0.5 ml-auto shrink-0">
              <Star size={10} className="star-filled fill-amber-400" />
              <span className="text-xs text-slate-500">{service.providerRating?.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors">
          {service.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          {service.deliveryTime && (
            <span className="flex items-center gap-1"><Clock size={11} />{service.deliveryTime}</span>
          )}
          {service.location && !service.isRemote && (
            <span className="flex items-center gap-1 truncate"><MapPin size={11} />{service.location}</span>
          )}
        </div>

        {/* Rating */}
        {service.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <StarRating rating={service.rating} size={11} />
            <span className="text-xs text-slate-500">{service.rating?.toFixed(1)} ({service.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">Starting at</span>
          <span className="font-bold text-slate-900">
            ${service.price}
            <span className="text-xs font-normal text-slate-400 ml-0.5">
              /{service.priceType === 'HOURLY' ? 'hr' : service.priceType === 'DAILY' ? 'day' : 'project'}
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
