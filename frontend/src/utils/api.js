import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken })
          localStorage.setItem('token', data.token)
          localStorage.setItem('refreshToken', data.refreshToken)
          original.headers.Authorization = `Bearer ${data.token}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
}

// ─── Users ──────────────────────────────────────────────────────────────────
export const userApi = {
  getMe:          ()       => api.get('/users/me'),
  updateProfile:  (data)   => api.put('/users/me', data),
  uploadAvatar:   (form)   => api.post('/users/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getDashboard:   ()       => api.get('/users/me/dashboard'),
  getProfile:     (id)     => api.get(`/users/${id}/profile`),
  becomeProvider: ()       => api.post('/users/me/become-provider'),
}

// ─── Services ───────────────────────────────────────────────────────────────
export const serviceApi = {
  getAll:        (params) => api.get('/services', { params }),
  getById:       (id)     => api.get(`/services/${id}`),
  getByCategory: (cat, params) => api.get(`/services/category/${cat}`, { params }),
  search:        (params) => api.get('/services/search', { params }),
  getMyServices: ()       => api.get('/services/my-services'),
  getProviderServices: (id) => api.get(`/services/provider/${id}`),
  create:        (data)   => api.post('/services', data),
  update:        (id, data) => api.put(`/services/${id}`, data),
  delete:        (id)     => api.delete(`/services/${id}`),
}

// ─── Bookings ───────────────────────────────────────────────────────────────
export const bookingApi = {
  create:          (data)       => api.post('/bookings', data),
  getMyBookings:   (params)     => api.get('/bookings/my-bookings', { params }),
  getProviderBookings: (params) => api.get('/bookings/provider-bookings', { params }),
  getById:         (id)         => api.get(`/bookings/${id}`),
  updateStatus:    (id, data)   => api.patch(`/bookings/${id}/status`, data),
}

// ─── Reviews ────────────────────────────────────────────────────────────────
export const reviewApi = {
  create:          (data)       => api.post('/reviews', data),
  getServiceReviews: (id, params) => api.get(`/reviews/service/${id}`, { params }),
  respond:         (id, data)   => api.post(`/reviews/${id}/respond`, data),
}

// ─── Messages ───────────────────────────────────────────────────────────────
export const messageApi = {
  send:             (data)   => api.post('/messages/send', data),
  getConversation:  (userId) => api.get(`/messages/conversation/${userId}`),
  getConversations: ()       => api.get('/messages/conversations'),
}
