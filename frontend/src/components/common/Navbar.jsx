import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Menu, X, ChevronDown, Bell, MessageSquare, LayoutDashboard,
  User, LogOut, Plus, Briefcase, Settings, Star
} from 'lucide-react'
import clsx from 'clsx'

const NAV_LINKS = [
  { to: '/services', label: 'Browse Services' },
  { to: '/services?category=development', label: 'Tech' },
  { to: '/services?category=design', label: 'Design' },
  { to: '/services?category=marketing', label: 'Marketing' },
]

export default function Navbar() {
  const { user, logout, isProvider } = useAuth()
  const navigate = useNavigate()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [dropOpen,    setDropOpen]    = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className={clsx(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white'
    )}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900">SkillSwap</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => clsx(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >{l.label}</NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Post a service */}
                <button onClick={() => navigate('/services/new')}
                  className="hidden md:flex btn-primary btn-sm gap-1.5">
                  <Plus size={14} /> Post Service
                </button>

                {/* Messages */}
                <Link to="/messages" className="btn-ghost p-2 rounded-xl relative">
                  <MessageSquare size={18} />
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(v => !v)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6272f3&color=fff`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-100"
                    />
                    <span className="hidden md:block text-sm font-semibold text-slate-700 max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', dropOpen && 'rotate-180')} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 animate-scale-in">
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      {[
                        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { to: '/profile',   icon: User,            label: 'My Profile' },
                        { to: '/bookings',  icon: Briefcase,       label: 'My Bookings' },
                        { to: '/messages',  icon: MessageSquare,   label: 'Messages' },
                        ...(isProvider ? [{ to: '/services/new', icon: Plus, label: 'Post Service' }] : []),
                      ].map(item => (
                        <Link key={item.to} to={item.to}
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <item.icon size={15} className="text-slate-400" />
                          {item.label}
                        </Link>
                      ))}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button onClick={() => { logout(); setDropOpen(false) }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-2xl">
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost btn-sm hidden md:flex">Sign In</Link>
                <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
              </>
            )}

            {/* Mobile toggle */}
            <button className="md:hidden btn-ghost p-2" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-slide-down">
          <nav className="page-container py-3 flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">Dashboard</NavLink>
                <NavLink to="/bookings"  onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">Bookings</NavLink>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left">Sign Out</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 pb-1">
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 btn-sm">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 btn-sm">Get Started</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
