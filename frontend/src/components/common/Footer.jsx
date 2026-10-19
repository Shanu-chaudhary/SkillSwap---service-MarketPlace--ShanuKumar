import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const CATEGORIES = ['Development', 'Design', 'Marketing', 'Writing', 'Video', 'Music', 'Business', 'Lifestyle']
const COMPANY    = [
  { label: 'About Us', to: '#' }, { label: 'Careers', to: '#' },
  { label: 'Press', to: '#' },    { label: 'Blog', to: '#' },
]
const SUPPORT    = [
  { label: 'Help Center', to: '#' },   { label: 'Contact Us', to: '#' },
  { label: 'Privacy Policy', to: '#' }, { label: 'Terms of Service', to: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-24">
      <div className="page-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl text-white">SkillSwap</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Connect with talented professionals or offer your skills to the world.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <Link to={`/services?category=${cat.toLowerCase()}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {COMPANY.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Support</h4>
            <ul className="space-y-2.5">
              {SUPPORT.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with ❤️ using React + Spring Boot + MongoDB</p>
        </div>
      </div>
    </footer>
  )
}
