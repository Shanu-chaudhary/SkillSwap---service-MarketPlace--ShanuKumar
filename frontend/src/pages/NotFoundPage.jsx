import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center max-w-md animate-fade-in">
        <div className="font-display text-8xl font-bold text-primary-100 mb-2">404</div>
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-3">Page not found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/"        className="btn-primary">Go Home</Link>
          <Link to="/services" className="btn-secondary">Browse Services</Link>
        </div>
      </div>
    </div>
  )
}
