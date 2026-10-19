import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FallingPetals from '../layout/FallingPetals';

function LeafIcon() {
  return (
    <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1 3.5-3.4 5-5 6.5" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <FallingPetals count={25} />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-500 to-green-400 shadow-glow-green mb-4">
            <LeafIcon />
          </div>
          <h1 className="text-3xl font-extrabold font-heading bg-gradient-to-r from-green-400 via-green-300 to-emerald-200 bg-clip-text text-transparent">
            Planta
          </h1>
          <p className="text-sm text-gray-400 mt-1">Smart Botanical IoT Monitoring</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-planta-surface/85 border border-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          <h2 className="text-xl font-bold font-heading text-white mb-2">Create an Account</h2>
          <p className="text-xs text-gray-400 mb-6">Join Planta to start monitoring your plants</p>

          <form onSubmit={handleSubmit} id="signup-form" className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g., Alexandra Green"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-3 bg-planta-dark/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-3 bg-planta-dark/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-planta-dark/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-confirm" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Confirm Password
              </label>
              <input
                id="signup-confirm"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-planta-dark/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="signup-submit"
              className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 font-semibold hover:text-green-300 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
