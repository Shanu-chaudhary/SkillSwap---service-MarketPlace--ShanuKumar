import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { userApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function OAuth2RedirectPage() {
  const [params] = useSearchParams()
  const navigate  = useNavigate()
  const { updateUser } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      toast.error('OAuth login failed')
      navigate('/login', { replace: true })
      return
    }

    localStorage.setItem('token', token)
    userApi.getMe()
      .then(res => {
        updateUser(res.data)
        toast.success(`Welcome, ${res.data.name}!`)
        navigate('/', { replace: true })
      })
      .catch(() => {
        localStorage.clear()
        toast.error('Failed to load user profile')
        navigate('/login', { replace: true })
      })
  }, [navigate, params, updateUser])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Completing sign-in…</p>
    </div>
  )
}
