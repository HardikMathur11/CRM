import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Building2, CheckCircle, Inbox, Phone, Star, FileText, Handshake,
  Trophy, XCircle, Shield, Briefcase, Target, TrendingUp, BarChart3,
  Bell, Package, Zap, Copy, Check, ArrowRight, ChevronRight
} from 'lucide-react';


const COLORS = {
  blue: '#0052CC',
  blueDark: '#0747A6',
  dark: '#091E42',
  navyCard: '#172B4D',
  orange: '#FFAB00',
  orangeHover: '#FF991F',
  lightBlue: '#DEEBFF',
  lightGray: '#F4F5F7'
};

const FEATURES = [
  { icon: TrendingUp, title: "Smart Lead Pipeline", desc: "Track every prospect from first contact to final deal with 7 intelligent pipeline stages built for manufacturing sales cycles." },
  { icon: Shield, title: "Role-Based Access", desc: "Admin, Manager and BDA roles with precisely controlled data visibility. Each team member sees exactly what they need." },
  { icon: BarChart3, title: "Sales Analytics", desc: "Real-time dashboards with revenue charts, conversion rates, and BDA performance metrics at a glance." },
  { icon: Bell, title: "Follow-up Alerts", desc: "Overdue interactions highlighted automatically. Schedule calls, emails, and site visits with zero missed follow-ups." },
  { icon: Package, title: "Product Catalogue", desc: "Full manufactured product inventory with SKUs, pricing, and category management directly linked to lead proposals." },
  { icon: Zap, title: "Auto Lead Scoring", desc: "Mongoose pre-save hooks automatically score every lead as Hot, Warm or Cold based on priority and pipeline stages." }
];

const PIPELINE_STAGES = [
  { name: "New", border: "border-l-slate-400", bg: "bg-slate-50", icon: Inbox, count: "1 Lead" },
  { name: "Contacted", border: "border-l-blue-500", bg: "bg-blue-50/50", icon: Phone, count: "0 Leads" },
  { name: "Qualified", border: "border-l-yellow-500", bg: "bg-yellow-50/50", icon: Star, count: "1 Lead" },
  { name: "Proposal Sent", border: "border-l-purple-500", bg: "bg-purple-50/50", icon: FileText, count: "1 Lead" },
  { name: "Negotiation", border: "border-l-orange-500", bg: "bg-orange-50/50", icon: Handshake, count: "0 Leads" },
  { name: "Won ✓", border: "border-l-emerald-500", bg: "bg-emerald-50", icon: Trophy, count: "2 Leads" },
  { name: "Lost", border: "border-l-red-500", bg: "bg-red-50", icon: XCircle, count: "0 Leads" }
];

const ROLES = [
  { name: "Admin", portal: "Super Admin Portal", desc: "Complete system control. Manage your entire team, set targets, and see every lead across the organization.", badgeClass: "bg-rose-500/10 text-rose-400 border border-rose-500/20", icon: Shield, bullets: ["Full team management", "Set monthly sales targets", "View all org-wide data", "Product catalogue admin"], bulletDotColor: "text-rose-500" },
  { name: "Manager", portal: "Manager Portal", desc: "Audit your team's pipeline, manage the product catalogue, and track performance with visual sales analytics.", badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20", icon: Briefcase, featured: true, bullets: ["Pipeline auditing", "Product catalogue control", "Sales analytics access", "Team performance overview"], bulletDotColor: "text-blue-500" },
  { name: "BDA", portal: "BDA Portal", desc: "Your personal sales workspace. Manage assigned leads, log follow-ups, and convert won deals into clients.", badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", icon: Target, bullets: ["Personal lead workspace", "Follow-up scheduling", "Client conversion", "Performance dashboard"], bulletDotColor: "text-emerald-500" }
];

const DEMO_CREDENTIALS = [
  { role: "Admin", email: "admin@crm.com", pass: "admin1234", desc: "Full system access", badge: "Root", fieldId: "admin", bgClass: "border-rose-100 bg-rose-50/50 hover:border-rose-300", btnClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10 hover:shadow-rose-600/20", badgeColorClass: "bg-rose-550/10 text-rose-600 border border-rose-500/20", textAccentClass: "text-rose-500" },
  { role: "Manager", email: "manager@crm.com", pass: "manager1234", desc: "Team oversight access", badge: "Supervisor", fieldId: "mgr", bgClass: "border-blue-100 bg-blue-50/30 hover:border-blue-300", btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 hover:shadow-blue-600/20", badgeColorClass: "bg-blue-500/10 text-blue-600 border border-blue-500/20", textAccentClass: "text-blue-500" },
  { role: "BDA", email: "bda@crm.com", pass: "bda1234", desc: "Sales rep access", badge: "Rep", fieldId: "bda", bgClass: "border-emerald-100 bg-emerald-50/30 hover:border-emerald-300", btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20", badgeColorClass: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20", textAccentClass: "text-emerald-500" }
];

const TECHS = [
  { emoji: "🍃", name: "MongoDB" },
  { emoji: "⚡", name: "Express.js" },
  { emoji: "⚛️", name: "React.js" },
  { emoji: "🟩", name: "Node.js" }
];

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopy = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 scroll-smooth antialiased">

      {/* SECTION 1 — STICKY NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-100 w-full px-6 md:px-12 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/15" style={{ backgroundColor: COLORS.blue }}>
              <Building2 size={20} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wide" style={{ color: COLORS.dark }}>BDA CRM</span>
              <span className="text-[9px] bg-blue-50 border border-blue-100 rounded px-2 py-0.5 font-bold uppercase tracking-wider hidden sm:inline-block" style={{ color: COLORS.blue }}>
                for Manufacturing
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {['features', 'pipeline', 'roles', 'demo'].map(sec => (
                <button key={sec} onClick={() => scrollToSection(sec)} className="text-sm font-semibold text-slate-600 hover:text-blue-600 capitalize transition-colors">
                  {sec}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-blue-600 text-sm font-bold px-4 py-2 transition-all">
                Login
              </button>
              <button onClick={() => navigate('/login')} className="text-white rounded-lg text-xs font-bold px-5 py-2.5 shadow-md transition-all" style={{ backgroundColor: COLORS.blue }}>
                Get Started Free
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => navigate('/login')} className="text-white rounded-lg text-xs font-bold px-4 py-2 shadow-sm transition-all" style={{ backgroundColor: COLORS.blue }}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 2 — HERO SECTION (Atlassian Blue Gradient with grid layout) */}
      <header
        className="relative overflow-hidden pt-20 pb-28 px-6 z-0 text-white"
        style={{
          background: `linear-gradient(135deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 100%)`,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(135deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 100%)`,
          backgroundSize: '40px 40px, 40px 40px, auto'
        }}
      >
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-semibold">
            <span></span> Designed Exclusively for Manufacturing Sales
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Close More Deals.<br />
            Build Better <span style={{ color: COLORS.orange }}>Pipelines.</span>
          </h1>

          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            The complete CRM built exclusively for manufacturing sales teams.
            Track leads, schedule follow-ups, and convert deals — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button onClick={() => navigate('/login')} className="w-full sm:w-auto flex items-center justify-center gap-2 font-black rounded-lg px-8 py-4 shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm" style={{ backgroundColor: COLORS.orange, color: COLORS.dark }}>
              <span>Get it free</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => scrollToSection('demo')} className="w-full sm:w-auto border border-white/30 text-white hover:bg-white/10 font-bold rounded-lg px-8 py-4 transition-all duration-200 text-sm">
              View Demo Credentials
            </button>
          </div>

          <div className="flex justify-center items-center gap-6 mt-12 flex-wrap text-blue-100 text-xs font-bold tracking-wider uppercase">
            {['Role-Based Access', 'Real-time Analytics', 'Manufacturing-Ready'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>


          <div className="relative p-[1px] bg-white/20 rounded-2xl max-w-2xl mx-auto mt-16 shadow-2xl">
            <div className="rounded-[15px] p-6 text-left border-l-4" style={{ backgroundColor: COLORS.dark, borderLeftColor: COLORS.orange }}>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span className="text-[10px] text-slate-300 font-mono ml-2">sales-pipeline-summary</span>
                </div>
                <span className="text-[10px] bg-white/10 text-blue-200 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Active BDA Portal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-black/20 p-4 rounded-xl mb-4 text-center border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Active Leads</span>
                  <span className="text-lg font-black text-white">24</span>
                </div>
                <div className="border-x border-white/10">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Converted Won</span>
                  <span className="text-lg font-black text-emerald-400">8</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Month Revenue</span>
                  <span className="text-lg font-black" style={{ color: COLORS.orange }}>₹12.4 L</span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-2">Recent Hot & Warm Deals</span>
              <div className="space-y-2">
                {[
                  { company: "Sharma Steel Industries", desc: "Pipes & Tubing Catalog Request", badge: "🔥 Hot", badgeColor: "bg-red-500/20 text-red-400 border-red-500/20", stage: "Negotiation" },
                  { company: "Mehta Gear Assemblies", desc: "High torque engine parts order", badge: "🌡️ Warm", badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20", stage: "Proposal Sent" }
                ].map((card, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/10 p-3 rounded-lg border border-white/5 hover:bg-black/20 transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white block">{card.company}</span>
                      <span className="text-[10px] text-slate-300">{card.desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase border ${card.badgeColor}`}>{card.badge}</span>
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">{card.stage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 3 — STATS BAR */}
      <section className="py-10 w-full relative z-10 border-b border-slate-100" style={{ backgroundColor: COLORS.lightBlue }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-300 text-center">
          {[
            { metric: "3 Roles", text: "Perfectly Separated Access" },
            { metric: "7 Stages", text: "Complete Lead Pipeline" },
            { metric: "Real-time", text: "Analytics & Reporting" },
            { metric: "100% MERN", text: "Modern Tech Stack" }
          ].map((item, idx) => (
            <div key={idx} className="pt-4 md:pt-0">
              <h4 className="text-3xl font-black" style={{ color: COLORS.dark }}>{item.metric}</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{item.text}</p>
            </div>
          ))}
        </div>
      </section>


      <section id="features" className="bg-white py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="font-bold tracking-widest text-xs uppercase block" style={{ color: COLORS.blue }}>Platform Features</span>
            <h2 className="text-4xl font-black text-slate-800" style={{ color: COLORS.dark }}>Everything Your Sales Team Needs</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm font-semibold">Powerful tools tailored specifically for manufacturing businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="group bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:text-white transition-all duration-200 mb-6" style={{ color: COLORS.blue }}>
                    <Icon size={22} className="group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.title}</h3>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section id="pipeline" className="py-24 px-6 border-y border-slate-100" style={{ backgroundColor: COLORS.lightGray }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="font-bold tracking-widest text-xs uppercase block" style={{ color: COLORS.blue }}>Lead Pipeline</span>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: COLORS.dark }}>From First Contact<br />to Signed Client</h2>
            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
              Track every deal through 7 clearly defined pipeline stages built directly into our MongoDB schema structure. Never let another order opportunity slip.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Auto lead scoring warmth calculation",
                "One-click conversion into Active Clients",
                "Record GST details, state, and onboarding billing info"
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 flex-shrink-0" size={18} style={{ color: COLORS.blue }} />
                  <span className="text-sm font-bold text-slate-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="space-y-3">
              {PIPELINE_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <React.Fragment key={idx}>
                    <div className={`flex items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm border-l-4 ${stage.border} hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{idx + 1}. {stage.name}</span>
                        <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded font-bold">{stage.count}</span>
                      </div>
                    </div>
                    {idx < PIPELINE_STAGES.length - 1 && (
                      <div className="flex justify-center text-slate-300">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      <section id="roles" className="py-24 px-6 relative z-0" style={{ backgroundColor: COLORS.dark }}>
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-blue-300 font-bold tracking-widest text-xs uppercase block">User Roles</span>
            <h2 className="text-4xl font-black text-white">Built For Every Team Member</h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm font-semibold">Three distinct portals designed for specific organizational duties.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {ROLES.map((role, idx) => {
              const Icon = role.icon;
              return (
                <div key={idx} className={`rounded-2xl p-8 space-y-6 hover:shadow-2xl transition-all duration-300 relative ${role.featured ? 'scale-100 lg:scale-105 shadow-xl shadow-blue-500/10 border-blue-500/20' : 'border-slate-700/50'} text-white border hover:-translate-y-1`} style={{ backgroundColor: COLORS.navyCard }}>
                  {role.featured && (
                    <div className="absolute -top-3.5 right-6 text-white text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border shadow-md shadow-blue-500/20" style={{ backgroundColor: COLORS.blue, borderColor: '#0065ff' }}>
                      Most Used
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${role.badgeClass}`}>
                      {role.name}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white">{role.portal}</h3>
                    <p className="text-slate-200 text-xs font-medium leading-relaxed">{role.desc}</p>
                  </div>
                  <hr className="border-white/10" />
                  <ul className="space-y-3 text-xs font-semibold text-slate-300">
                    {role.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <span className={`${role.bulletDotColor}`}>•</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section id="demo" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="font-bold tracking-widest text-xs uppercase block" style={{ color: COLORS.blue }}>Live Demo</span>
            <h2 className="text-4xl font-black text-slate-800" style={{ color: COLORS.dark }}>Try It Right Now</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm font-semibold">No signup needed. Pick a role and explore the full application instantly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {DEMO_CREDENTIALS.map((cred, idx) => (
              <div key={idx} className={`rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[400px] border ${cred.bgClass}`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider ${cred.badgeColorClass}`}>
                      {cred.role}
                    </span>
                    <span className="text-[11px] text-gray-500 font-bold">{cred.desc}</span>
                  </div>

                  <div className="rounded-xl p-5 text-xs font-mono text-slate-300 mt-6 space-y-3 relative border border-slate-800" style={{ backgroundColor: COLORS.dark }}>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Demo Login Box</span>
                      <span className={`text-[9px] font-bold uppercase ${cred.textAccentClass}`}>{cred.badge}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span>Email: <span className="text-white">{cred.email}</span></span>
                      <button
                        onClick={() => handleCopy(cred.email, `${cred.fieldId}-email`)}
                        className="text-slate-400 hover:text-white p-1 hover:bg-slate-850 rounded transition-colors"
                      >
                        {copiedField === `${cred.fieldId}-email` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span>Pass: <span className="text-white">{cred.pass}</span></span>
                      <button
                        onClick={() => handleCopy(cred.pass, `${cred.fieldId}-pass`)}
                        className="text-slate-400 hover:text-white p-1 hover:bg-slate-850 rounded transition-colors"
                      >
                        {copiedField === `${cred.fieldId}-pass` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className={`w-full mt-6 font-bold rounded-lg py-3.5 text-xs tracking-wider uppercase transition-all duration-200 ${cred.btnClass}`}
                >
                  Login as {cred.role} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 text-center border-y border-slate-200" style={{ backgroundColor: COLORS.lightGray }}>
        <div className="max-w-4xl mx-auto space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Powered by the MERN Stack</h4>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {TECHS.map((tech, idx) => (
              <span key={idx} className="bg-white px-5 py-2.5 rounded-full shadow-sm text-xs font-bold text-slate-700 border border-slate-100 inline-flex items-center gap-2 hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                <span>{tech.emoji}</span> {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>


      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-500/25 space-y-6 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300" style={{ background: `linear-gradient(135deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 100%)` }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -z-0" />
          <h2 className="text-3xl md:text-4xl font-black max-w-2xl mx-auto leading-tight relative z-10">Ready to Manage Your Sales Pipeline?</h2>
          <p className="text-blue-100 text-sm max-w-md mx-auto font-medium relative z-10">Login and explore the full BDA CRM platform. Take control of your sales cycles today.</p>
          <div className="pt-4 relative z-10">
            <button onClick={() => navigate('/login')} className="hover:bg-slate-50 text-slate-900 font-bold rounded-lg px-10 py-4 shadow-lg transition-colors inline-flex items-center gap-2 text-sm" style={{ backgroundColor: COLORS.orange, color: COLORS.dark }}>
              <span>Open Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>


      <footer className="text-slate-450 py-16 px-6 border-t border-slate-800" style={{ backgroundColor: COLORS.dark }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Building2 size={20} className="text-blue-400" />
              <span className="font-extrabold tracking-wide">BDA CRM</span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Built for Isaii AI Technical Assessment 2026 by Hardik Mathur</p>
            <p className="text-[11px] text-slate-500 font-medium">&copy; 2026 BDA CRM. All rights reserved</p>
          </div>

          <div className="md:text-right space-y-3">
            <p className="text-xs font-bold text-slate-400/60 uppercase tracking-widest">Built with MERN Stack</p>
            <div className="flex md:justify-end items-center gap-6 text-xs text-slate-300">
              <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Login</button>
              <a href="https://github.com/HardikMathur11/CRM" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
