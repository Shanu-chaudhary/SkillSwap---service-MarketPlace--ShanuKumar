import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Plus, X, Save } from 'lucide-react'
import { userApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import toast from 'react-hot-toast'

const SKILL_SUGGESTIONS = ['React', 'Node.js', 'Python', 'Java', 'Figma', 'Photoshop', 'SEO', 'Content Writing', 'Video Editing', 'Flutter', 'AWS', 'MongoDB']

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [skills, setSkills]   = useState(user?.skills ? [...user.skills] : [])
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      phone: user?.phone || '',
    }
  })

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const res = await userApi.updateProfile({ ...data, skills: skills })
      updateUser(res.data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    const form = new FormData()
    form.append('file', file)
    setUploading(true)
    try {
      const res = await userApi.uploadAvatar(form)
      updateUser({ avatar: res.data.avatar })
      toast.success('Avatar updated!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const addSkill = (skill) => {
    const s = skill.trim()
    if (s && !skills.includes(s) && skills.length < 20) {
      setSkills(prev => [...prev, s])
      setNewSkill('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">My Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="card p-6 flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6272f3&color=fff&size=80`}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-100"
              />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-sm hover:bg-primary-700 transition-colors">
                {uploading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera size={12} />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF · Max 5MB</p>
            </div>
          </div>

          {/* Basic info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-slate-900">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input {...register('name', { required: 'Name is required' })}
                  className={`input ${errors.name ? 'input-error' : ''}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Phone</label>
                <input {...register('phone')} type="tel" placeholder="+1 (555) 000-0000" className="input" />
              </div>
            </div>
            <div>
              <label className="label">Location</label>
              <input {...register('location')} placeholder="City, Country" className="input" />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea {...register('bio')} rows={4}
                placeholder="Tell clients about yourself, your experience, and what makes you great…"
                className="input resize-none" />
            </div>
          </div>

          {/* Skills */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-slate-900 mb-1">Skills</h2>
            <p className="text-xs text-slate-400 mb-4">Add up to 20 skills that describe your expertise</p>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {skills.map(skill => (
                <span key={skill} className="badge badge-primary gap-1.5">
                  {skill}
                  <button type="button" onClick={() => setSkills(prev => prev.filter(s => s !== skill))}
                    className="hover:text-primary-900 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(newSkill) } }}
                placeholder="Add a skill…"
                className="input flex-1"
              />
              <button type="button" onClick={() => addSkill(newSkill)} className="btn-secondary px-4">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 8).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-500 rounded-full transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary gap-2 px-7">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
