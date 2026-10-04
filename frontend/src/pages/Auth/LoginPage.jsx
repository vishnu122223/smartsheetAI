import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service.js';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = ({ title = 'Smart Sheet AI' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      const { token, user } = result.data;
      login(user, token);

      toast.success('Welcome back! You have successfully logged in.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.error || 'Failed to login. Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left Side */}
      <section className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden border-r border-hairline">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-accent/15 to-transparent" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl animate-float" />
          <div className="absolute bottom-40 right-24 w-96 h-96 rounded-full bg-accent/25 blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-gold/10 blur-3xl animate-float" />
        </div>

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(circle at 30% 40%, black, transparent 75%)',
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_16px_36px_-16px_rgba(99,102,241,1)]">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-lg font-bold text-foreground">{title}</span>
                <span className="text-[0.65rem] font-semibold tracking-[0.24em] uppercase text-gold">
                  AI Study Studio
                </span>
              </div>
            </div>

            <p className="eyebrow mb-4">Welcome back</p>
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-[1.08] tracking-tight">
              Turn any PDF into
              <br />
              <span className="text-gradient"> mastery, faster.</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed max-w-md">
              Quizzes, flashcards and grounded answers — generated from your own
              documents in seconds.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="chip">Document-grounded</span>
              <span className="chip chip-gold">Gemini powered</span>
              <span className="chip chip-live">Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">{title}</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back 👋</h1>
            <p className="text-muted">Sign in to continue to your workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-subtle pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field field-icon"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-subtle pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field field-icon !pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm link-accent">
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg w-full">
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="divider my-7" />
          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="link-accent">
              Create one free
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
