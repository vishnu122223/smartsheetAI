import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service.js';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';

const Register = ({ title = 'Smart Sheet AI' }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Please make sure your passwords match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(username, email, password);
      const { token, user } = result.data;
      login(user, token);

      toast.success(`Welcome to ${title}. Let's start learning!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.error || 'Failed to register user. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left Side */}
      <section className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden border-r border-hairline">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-primary/15 to-transparent" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-24 right-24 w-72 h-72 rounded-full bg-accent/30 blur-3xl animate-float" />
          <div className="absolute bottom-32 left-16 w-96 h-96 rounded-full bg-primary/25 blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-gold/10 blur-3xl animate-float-delayed" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(circle at 70% 50%, black, transparent 75%)',
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_16px_36px_-16px_rgba(139,92,246,1)]">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-lg font-bold text-foreground">{title}</span>
                <span className="text-[0.65rem] font-semibold tracking-[0.24em] uppercase text-gold">
                  AI Study Studio
                </span>
              </div>
            </div>

            <p className="eyebrow mb-4">Get started</p>
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-[1.08] tracking-tight">
              Start your
              <br />
              <span className="text-gradient">learning journey</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed max-w-md">
              Join learners who study smarter with document-grounded AI — quizzes,
              flashcards and summaries on demand.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="chip">Free to start</span>
              <span className="chip chip-gold">No credit card</span>
              <span className="chip chip-live">Ready in 30s</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side - Register Form */}
      <section className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">{title}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-muted">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-subtle pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="field field-icon"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-subtle pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field field-icon"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-subtle pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
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

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-subtle pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="field field-icon"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="divider my-7" />
          <p className="text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="link-accent">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
