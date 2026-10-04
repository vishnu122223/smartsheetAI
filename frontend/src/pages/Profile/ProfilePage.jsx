import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import authService from '../../services/auth.service.js';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setUsername(data.user.username);
        setEmail(data.user.email);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      return toast.error('Passwords do not match');
    }

    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setPasswordLoading(true);

    try {
      await authService.updatePassword({ currPassword, newPassword });
      toast.success('Password updated');

      setCurrPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error(error.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <Spinner label="Loading profile" />;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Profile settings" subtitle="Manage your account details" />

      <div className="space-y-6">
        {/* USER INFO */}
        <section className="surface p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-tile">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-bold tracking-tight">User information</h3>
              <p className="text-xs text-muted">Your account details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="profile-username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" size={17} />
                <input
                  id="profile-username"
                  value={username}
                  disabled
                  className="field field-icon"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="profile-email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" size={17} />
                <input
                  id="profile-email"
                  value={email}
                  disabled
                  className="field field-icon"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PASSWORD */}
        <section className="surface p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-tile">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-bold tracking-tight">Change password</h3>
              <p className="text-xs text-muted">Keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="label" htmlFor="current-password">
                Current password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" size={17} />
                <input
                  id="current-password"
                  type="password"
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  required
                  className="field field-icon"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="new-password">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" size={17} />
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="field field-icon"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="confirm-password">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" size={17} />
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="field field-icon"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="btn btn-primary"
              >
                {passwordLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    Updating…
                  </>
                ) : (
                  'Update password'
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
