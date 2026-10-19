import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, max = 5, size = 14, showCount, count }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? 'star-filled fill-amber-400' : 'star-empty'}
        />
      ))}
      {showCount && (
        <span className="text-xs text-slate-500 ml-1">
          {rating?.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  )
}
