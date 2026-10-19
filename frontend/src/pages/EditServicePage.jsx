import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, X, ChevronLeft, Trash2 } from 'lucide-react'
import { serviceApi } from '../utils/api'
import Navbar from '../components/common/Navbar'
import toast from 'react-hot-toast'

const CATEGORIES  = ['development', 'design', 'marketing', 'writing', 'video', 'music', 'business', 'lifestyle']
const PRICE_TYPES = [{ value: 'FIXED', label: 'Fixed Price' }, { value: 'HOURLY', label: 'Per Hour' }, { value: 'DAILY', label: 'Per Day' }]

export default function EditServicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tags, setTags]       = useState([])
  const [features, setFeatures] = useState([''])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    serviceApi.getById(id).then(res => {
      const s = res.data
      reset({
        title: s.title, description: s.description, category: s.category,
        subcategory: s.subcategory, price: s.price, priceType: s.priceType,
        deliveryTime: s.deliveryTime, location: s.location, isRemote: s.isRemote,
        thumbnail: s.thumbnail,
      })
      setTags(s.tags || [])
      setFeatures(s.features?.length ? s.features : [''])
    }).catch(() => toast.error('Service not found'))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await serviceApi.update(id, { ...data, price: parseFloat(data.price), tags, features: features.filter(f => f.trim()) })
      toast.success('Service updated!')
      navigate('/dashboard')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return
    setDeleting(true)
    try {
      await serviceApi.delete(id)
      toast.success('Service deleted')
      navigate('/dashboard')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 10) { setTags(p => [...p, t]); setTagInput('') }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900">Edit Service</h1>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger btn-sm gap-1.5">
            <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">Service Details</h2>
            <div>
              <label className="label">Title</label>
              <input {...register('title', { required: true })} className={`input ${errors.title ? 'input-error' : ''}`} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select {...register('category')} className="input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Subcategory</label>
                <input {...register('subcategory')} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea {...register('description', { required: true })} rows={5} className={`input resize-none ${errors.description ? 'input-error' : ''}`} />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Price ($)</label>
                <input {...register('price', { required: true, min: 1 })} type="number" step="0.01" className="input" />
              </div>
              <div>
                <label className="label">Price Type</label>
                <select {...register('priceType')} className="input">
                  {PRICE_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Delivery Time</label>
                <input {...register('deliveryTime')} className="input" />
              </div>
              <div>
                <label className="label">Location</label>
                <input {...register('location')} className="input" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input {...register('isRemote')} type="checkbox" id="isRemote" className="w-4 h-4 accent-primary-600" />
              <label htmlFor="isRemote" className="text-sm font-medium text-slate-700">Available remotely</label>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">What's Included</h2>
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input value={f} onChange={e => setFeatures(prev => prev.map((x, idx) => idx === i ? e.target.value : x))}
                    placeholder={`Feature ${i + 1}`} className="input flex-1" />
                  {features.length > 1 && (
                    <button type="button" onClick={() => setFeatures(prev => prev.filter((_, idx) => idx !== i))}
                      className="btn-ghost p-2 text-slate-400 hover:text-red-500"><X size={16} /></button>
                  )}
                </div>
              ))}
            </div>
            {features.length < 10 && (
              <button type="button" onClick={() => setFeatures(p => [...p, ''])} className="btn-secondary btn-sm gap-1.5 text-xs">
                <Plus size={13} /> Add
              </button>
            )}
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">Tags</h2>
            <div className="flex flex-wrap gap-2 min-h-[36px]">
              {tags.map(t => (
                <span key={t} className="badge badge-primary gap-1.5">{t}
                  <button type="button" onClick={() => setTags(p => p.filter(x => x !== t))}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Add tag" className="input flex-1" />
              <button type="button" onClick={addTag} className="btn-secondary px-4"><Plus size={16} /></button>
            </div>
          </div>

          <div className="card p-6 space-y-3">
            <h2 className="font-display font-bold text-slate-900">Thumbnail</h2>
            <input {...register('thumbnail')} type="url" placeholder="https://…" className="input" />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary px-8">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
