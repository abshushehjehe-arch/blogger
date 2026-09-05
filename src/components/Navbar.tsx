import React from 'react';
import { BookOpen, ShieldCheck, PenSquare, Search, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { BlogSettings } from '../types';
import { AppUser } from '../context/AuthContext';

interface NavbarProps {
  settings: BlogSettings;
  currentView: 'blog' | 'admin' | 'reader' | 'auth';
  onNavigate: (view: 'blog' | 'admin') => void;
  onOpenCreatePost?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdminLoggedIn: boolean;
  user?: AppUser | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentView,
  onNavigate,
  onOpenCreatePost,
  searchQuery,
  onSearchChange,
  isAdminLoggedIn,
  user,
  onLogin,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('blog')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-105">
              <span className="text-[#E50914] font-bold text-3xl tracking-tighter uppercase">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-2xl tracking-tight text-[#E50914] uppercase">
                  {settings.siteName}
                </span>
                <span className="hidden sm:inline-flex items-center text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm bg-[#E50914] text-white">
                  Blog
                </span>
              </div>
            </div>
          </div>

          {/* Search bar (visible when in blog view) */}
          {currentView !== 'admin' && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="navbar-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Titles, people, genres..."
                  className="w-full pl-9 pr-4 py-1.5 text-sm bg-[#333]/80 hover:bg-[#333] focus:bg-black text-white placeholder-gray-400 border border-[#333] focus:border-white focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Direct Create Post shortcut - Only show for Admin */}
            {isAdminLoggedIn && (
              <button
                id="navbar-create-post-btn"
                onClick={() => {
                  onNavigate('admin');
                  if (onOpenCreatePost) onOpenCreatePost();
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs sm:text-sm font-medium bg-[#E50914] hover:bg-red-700 text-white transition-all active:scale-95"
              >
                <PenSquare className="w-4 h-4" />
                <span>Nayi Post</span>
              </button>
            )}

            {/* Admin Panel Toggle */}
            <button
              id="navbar-toggle-admin-btn"
              onClick={() => onNavigate(currentView === 'admin' ? 'blog' : 'admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs sm:text-sm font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-white text-black'
                  : 'bg-transparent hover:bg-[#333] text-gray-300 border border-[#333]'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isAdminLoggedIn ? 'text-[#E50914]' : 'text-gray-500'}`} />
              <span className="hidden sm:inline">{currentView === 'admin' ? 'Exit Admin' : 'Admin'}</span>
            </button>
            
            <div className="h-6 w-px bg-[#333] hidden sm:block mx-1"></div>

            {/* User Auth Controls */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-medium text-white leading-tight">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-500 leading-tight capitalize">
                    {user.role}
                  </span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-sm border border-[#333]" />
                ) : (
                  <div className="w-8 h-8 rounded-sm bg-[#333] text-gray-400 flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-sm transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-white bg-[#E50914] hover:bg-red-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
