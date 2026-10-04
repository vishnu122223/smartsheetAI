import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, Search } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  const initials = (user?.username || 'U')
    .split(/[\s_.-]+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header
      className="sticky top-0 z-40 w-full h-16 shrink-0 border-b border-hairline glass"
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl
            text-muted hover:text-foreground hover:bg-fill-strong transition"
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2.5">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                className="field field-icon !py-2 !w-56 !text-[0.85rem] hidden lg:block"
                placeholder="Search your library…"
                aria-label="Search"
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
            </div>
            <span className="chip chip-gold hidden lg:inline-flex">
              AI powered
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <p className="hidden sm:block text-sm text-muted">
            {greeting},{' '}
            <span className="font-semibold text-foreground">
              {user?.username || 'learner'}
            </span>
          </p>

          {/* Notification */}
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-xl
            border border-hairline bg-fill hover:bg-fill-strong hover:border-white/15 transition"
            aria-label="Notifications"
          >
            <Bell size={17} className="text-muted" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_2px_rgba(232,200,125,0.5)]" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 sm:border-l sm:border-hairline sm:pl-4">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent
              flex items-center justify-center text-xs font-bold text-white
              ring-2 ring-white/10 shadow-[0_10px_22px_-12px_rgba(139,92,246,0.95)]"
            >
              {initials || 'U'}
            </div>

            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-foreground">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-subtle">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
