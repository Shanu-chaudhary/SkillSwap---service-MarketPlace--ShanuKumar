import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { serviceApi } from '../utils/api'
import ServiceCard from '../components/services/ServiceCard'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import clsx from 'clsx'

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'Video', 'Music', 'Business', 'Lifestyle']
const PRICE_TYPES = ['All', 'HOURLY', 'FIXED', 'DAILY']
const SORT_OPTIONS = [
  { label: 'Newest',    value: 'createdAt' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Booked', value: 'totalBookings' },
]

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [services, setServices]  = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading]    = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const query    = searchParams.get('search')   || ''
  const category = searchParams.get('category') || ''
  const page     = parseInt(searchParams.get('page') || '0')
  const sortBy   = searchParams.get('sort')     || 'createdAt'

  const [searchInput, setSearchInput] = useState(query)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (query) {
        res = await serviceApi.search({ keyword: query, category: category || undefined, page, size: 12 })
      } else if (category) {
        res = await serviceApi.getByCategory(category, { page, size: 12 })
      } else {
        res = await serviceApi.getAll({ page, size: 12, sortBy })
      }
      setServices(res.data.content || [])
      setTotalPages(res.data.totalPages || 0)
      setTotalElements(res.data.totalElements || 0)
    } catch {
      setServices([])
    } finally {
      setLoading(false)
    }
  }, [query, category, page, sortBy])

  useEffect(() => { fetchServices() }, [fetchServices])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setParam('search', searchInput.trim())
  }

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', p)
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-800 py-12">
        <div className="page-container text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Services` : 'Browse All Services'}
          </h1>
          <p className="text-primary-300 mb-7">{totalElements > 0 ? `${totalElements.toLocaleString()} services available` : 'Discover top professionals'}</p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4">
              <Search size={16} className="text-white/50 shrink-0" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search services…"
                className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm py-3 outline-none"
              />
              {searchInput && <button type="button" onClick={() => { setSearchInput(''); setParam('search', '') }}><X size={14} className="text-white/50 hover:text-white" /></button>}
            </div>
            <button type="submit" className="btn-primary rounded-xl px-5">Search</button>
          </form>
        </div>
      </div>

      <div className="flex-1 page-container py-8">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setParam('category', cat === 'All' ? '' : cat.toLowerCase())}
              className={clsx(
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
                (cat === 'All' ? !category : category === cat.toLowerCase())
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
              )}>
              {cat}
            </button>
          ))}
          <div className="ml-auto shrink-0 flex gap-2">
            <select
              value={sortBy}
              onChange={e => setParam('sort', e.target.value)}
              className="input py-1.5 text-xs w-36">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-px bg-slate-100" />
                  <div className="h-4 bg-slate-200 rounded w-1/4 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-slate-700 mb-2">No services found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}
                  className="btn-secondary p-2 rounded-xl disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  const p = totalPages <= 7 ? i : i // simplified
                  return (
                    <button key={i} onClick={() => setPage(i)}
                      className={clsx('w-9 h-9 rounded-xl text-sm font-semibold transition-all',
                        page === i ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300')}>
                      {i + 1}
                    </button>
                  )
                })}
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}
                  className="btn-secondary p-2 rounded-xl disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
