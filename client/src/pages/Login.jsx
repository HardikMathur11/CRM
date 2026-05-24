import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Key, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100 overflow-hidden">
        {/* Branding header banner */}
        <div className="bg-indigo-600 px-8 py-10 text-center text-white relative">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <LogIn size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Manufacturing CRM</h2>
          <p className="text-xs text-indigo-200 mt-1 uppercase tracking-widest font-semibold">
            Sales & BDA Portal
          </p>
        </div>

        {/* Login form body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Work Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bda@crm.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Secret Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Key size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Submit action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 text-sm font-semibold tracking-wide shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo credentials helper footer */}
        <div className="px-8 py-5 border-t border-gray-50 bg-gray-50/50 text-center">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
            Demo Credentials
          </span>
          <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-500 font-medium mt-1.5">
            <div>
              <span className="font-bold block">Admin</span>
              <span>admin@crm.com / admin123</span>
            </div>
            <div>
              <span className="font-bold block">Manager</span>
              <span>manager@crm.com / manager123</span>
            </div>
            <div>
              <span className="font-bold block">BDA</span>
              <span>bda@crm.com / bda123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
