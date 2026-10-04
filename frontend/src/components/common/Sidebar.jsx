import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: Layers, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[16.5rem] z-50 flex flex-col
        glass border-r border-hairline
        md:relative md:translate-x-0 transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-[4.5rem] px-5 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_10px_24px_-10px_rgba(99,102,241,0.9)]">
              <Sparkles size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(232,200,125,0.55)]" />
            </div>
            <div className="leading-tight">
              <h1 className="text-[0.95rem] font-bold tracking-tight text-foreground">
                Smart Sheet
              </h1>
              <span className="text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-gold">
                AI Studio
              </span>
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className="md:hidden text-muted hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 pb-2 text-[0.62rem] font-bold tracking-[0.2em] uppercase text-subtle">
            Workspace
          </p>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-primary/85 to-accent/70 shadow-[0_12px_26px_-14px_rgba(139,92,246,0.95)]'
                    : 'text-muted hover:text-foreground hover:bg-fill-strong'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gold transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <link.icon
                    size={18}
                    className={
                      isActive
                        ? 'text-white'
                        : 'text-subtle group-hover:text-accent transition-colors'
                    }
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-hairline">
          <div className="mb-3 px-4">
            <span className="chip chip-gold">
              <Sparkles size={11} /> Pro plan
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold
            text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
