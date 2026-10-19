import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ArrowRight, Code, Palette, TrendingUp, PenTool, Video, Music, Briefcase, Sparkles, Shield, Zap, Users, Star } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const CATEGORIES = [
  { label: 'Development', slug: 'development', icon: Code,       color: 'bg-blue-50 text-blue-600' },
  { label: 'Design',      slug: 'design',      icon: Palette,    color: 'bg-purple-50 text-purple-600' },
  { label: 'Marketing',   slug: 'marketing',   icon: TrendingUp, color: 'bg-pink-50 text-pink-600' },
  { label: 'Writing',     slug: 'writing',     icon: PenTool,    color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Video',       slug: 'video',       icon: Video,      color: 'bg-red-50 text-red-600' },
  { label: 'Music',       slug: 'music',       icon: Music,      color: 'bg-amber-50 text-amber-600' },
  { label: 'Business',    slug: 'business',    icon: Briefcase,  color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Lifestyle',   slug: 'lifestyle',   icon: Sparkles,   color: 'bg-teal-50 text-teal-600' },
]

const FEATURES = [
  { icon: Shield, title: 'Verified Providers', desc: 'Every service provider is reviewed and verified for quality assurance.' },
  { icon: Zap,    title: 'Fast & Reliable',    desc: 'Get your projects completed on time with clear communication.' },
  { icon: Users,  title: '10,000+ Experts',    desc: 'Access a diverse pool of skilled professionals from around the world.' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma',    role: 'Startup Founder', rating: 5, text: "SkillSwap helped me find an amazing developer in just a few hours. The platform is so intuitive!" },
  { name: 'Marcus Johnson',  role: 'Marketing Manager', rating: 5, text: "I've hired 3 designers here and every one exceeded expectations. Highly recommend!" },
  { name: 'Aiko Tanaka',     role: 'Freelance Writer', rating: 5, text: "As a provider, SkillSwap gave me access to clients I never would have found otherwise." },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/services?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 py-24 md:py-36">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl translate-y-1/2" />

        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold text-white/80 animate-fade-in">
            <Sparkles size={12} className="text-amber-400" />
            Trusted by 50,000+ professionals worldwide
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
            Find the perfect skill<br />
            <span className="bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
              for your next project
            </span>
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto animate-slide-up">
            Connect with talented professionals or offer your expertise to businesses and individuals who need it.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-slide-up">
            <div className="flex bg-white rounded-2xl shadow-glow-lg overflow-hidden p-1.5 gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 text-slate-700 placeholder:text-slate-400 text-sm font-medium bg-transparent outline-none py-2"
                />
              </div>
              <button type="submit" className="btn-primary rounded-xl px-6 shrink-0">
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['React Developer', 'Logo Design', 'SEO Expert', 'Video Editor'].map(s => (
                <button key={s} type="button" onClick={() => { setQuery(s); navigate(`/services?search=${encodeURIComponent(s)}`) }}
                  className="text-xs text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 animate-fade-in">
            {[['10K+', 'Active Services'], ['50K+', 'Happy Clients'], ['99%', 'Satisfaction Rate']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-white">{val}</div>
                <div className="text-xs text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 page-container">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Browse by Category</h2>
          <p className="text-slate-500">Explore services across dozens of professional categories</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <Link key={cat.slug} to={`/services?category=${cat.slug}`}
                className="card card-hover flex flex-col items-center gap-2.5 py-5 px-2 text-center group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Why Choose SkillSwap?</h2>
            <p className="text-slate-500">Everything you need to hire or work with confidence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="card p-7 text-center">
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-primary-600" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 page-container">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">What Our Users Say</h2>
          <p className="text-slate-500">Join thousands of satisfied clients and providers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="star-filled fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 page-container">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full" />
            <div className="absolute bottom-4 right-4 w-48 h-48 border-2 border-white rounded-full" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 relative">
            Ready to get started?
          </h2>
          <p className="text-primary-200 mb-8 max-w-md mx-auto relative">
            Join thousands of professionals. Offer your skills or hire the best.
          </p>
          <div className="flex flex-wrap gap-3 justify-center relative">
            <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg shadow-lg">
              Create Free Account
            </Link>
            <Link to="/services" className="btn border-2 border-white/50 text-white hover:bg-white/10 btn-lg">
              Browse Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
