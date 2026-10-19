import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, X, ChevronLeft } from 'lucide-react'
import { serviceApi } from '../utils/api'
import Navbar from '../components/common/Navbar'
import toast from 'react-hot-toast'

const CATEGORIES = ['development', 'design', 'marketing', 'writing', 'video', 'music', 'business', 'lifestyle']
const PRICE_TYPES = [{ value: 'FIXED', label: 'Fixed Price' }, { value: 'HOURLY', label: 'Per Hour' }, { value: 'DAILY', label: 'Per Day' }]

export default function CreateServicePage() {
  const navigate = useNavigate()
  const [tags, setTags]         = useState([])
  const [features, setFeatures] = useState([''])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving]     = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { priceType: 'FIXED', isRemote: true }
  })

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await serviceApi.create({
        ...data,
        price: parseFloat(data.price),
        tags,
        features: features.filter(f => f.trim()),
        isRemote: data.isRemote === 'true' || data.isRemote === true,
      })
      toast.success('Service created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create service')
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 10) { setTags(p => [...p, t]); setTagInput('') }
  }

  const updateFeature = (i, val) => setFeatures(prev => prev.map((f, idx) => idx === i ? val : f))
  const addFeature = () => { if (features.length < 10) setFeatures(p => [...p, '']) }
  const removeFeature = (i) => setFeatures(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Post a New Service</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">Service Details</h2>
            <div>
              <label className="label">Title <span className="text-red-500">*</span></label>
              <input {...register('title', { required: 'Title is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                placeholder="e.g. I will build a responsive React website"
                className={`input ${errors.title ? 'input-error' : ''}`} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Category <span className="text-red-500">*</span></label>
                <select {...register('category', { required: 'Category is required' })}
                  className={`input ${errors.category ? 'input-error' : ''}`}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <label className="label">Subcategory</label>
                <input {...register('subcategory')} placeholder="e.g. Frontend, Logo Design" className="input" />
              </div>
            </div>

            <div>
              <label className="label">Description <span className="text-red-500">*</span></label>
              <textarea {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'At least 50 characters' } })}
                rows={5} placeholder="Describe your service in detail. What will you deliver? What's your process?"
                className={`input resize-none ${errors.description ? 'input-error' : ''}`} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Price (USD) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input {...register('price', { required: 'Price is required', min: { value: 1, message: 'Minimum $1' } })}
                    type="number" step="0.01" placeholder="0.00"
                    className={`input pl-8 ${errors.price ? 'input-error' : ''}`} />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="label">Price Type <span className="text-red-500">*</span></label>
                <select {...register('priceType')} className="input">
                  {PRICE_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Delivery Time</label>
                <input {...register('deliveryTime')} placeholder="e.g. 3-5 business days" className="input" />
              </div>
              <div>
                <label className="label">Location</label>
                <input {...register('location')} placeholder="e.g. New York, NY" className="input" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input {...register('isRemote')} type="checkbox" id="isRemote" value="true"
                className="w-4 h-4 rounded accent-primary-600" defaultChecked />
              <label htmlFor="isRemote" className="text-sm font-medium text-slate-700">Available remotely (online)</label>
            </div>
          </div>

          {/* Features */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">What's Included</h2>
            <p className="text-xs text-slate-400">List the key deliverables or features of your service</p>
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input value={f} onChange={e => updateFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1}`} className="input flex-1" />
                  {features.length > 1 && (
                    <button type="button" onClick={() => removeFeature(i)} className="btn-ghost p-2 text-slate-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {features.length < 10 && (
              <button type="button" onClick={addFeature} className="btn-secondary btn-sm gap-1.5 text-xs">
                <Plus size={13} /> Add Feature
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">Tags</h2>
            <p className="text-xs text-slate-400">Add relevant keywords to help clients find your service (max 10)</p>
            <div className="flex flex-wrap gap-2 min-h-[36px]">
              {tags.map(tag => (
                <span key={tag} className="badge badge-primary gap-1.5">
                  {tag}
                  <button type="button" onClick={() => setTags(p => p.filter(t => t !== tag))}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Type and press Enter" className="input flex-1" />
              <button type="button" onClick={addTag} className="btn-secondary px-4"><Plus size={16} /></button>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="card p-6 space-y-3">
            <h2 className="font-display font-bold text-slate-900">Media</h2>
            <div>
              <label className="label">Thumbnail URL</label>
              <input {...register('thumbnail')} type="url" placeholder="https://example.com/image.jpg" className="input" />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary px-8">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Publish Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
