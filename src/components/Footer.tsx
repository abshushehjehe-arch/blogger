import React from 'react';
import { BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { BlogSettings, BlogCategory } from '../types';

interface FooterProps {
  settings: BlogSettings;
  categories: BlogCategory[];
  onSelectCategory: (id: string) => void;
  onNavigateToAdmin: () => void;
  onNavigateToBlog: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  onSelectCategory,
  onNavigateToAdmin,
  onNavigateToBlog,
}) => {
  return (
    <footer className="mt-20 border-t border-[#333] bg-[#141414] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-2xl text-[#E50914] uppercase tracking-tighter">
                {settings.siteName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed">
              Ek modern digital publishing platform jahan aap technology, blogging tips, web development aur online growth ke baare me padh aur likh sakte hain.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-transparent border border-[#333] px-3 py-1.5 rounded-sm transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login / Dashboard</span>
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Popular Topics
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(1, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onNavigateToBlog();
                      onSelectCategory(cat.id);
                    }}
                    className="text-stone-600 hover:text-stone-950 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Creator Hub
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={onNavigateToAdmin} className="hover:text-white">
                  Nayi Post Upload Karein
                </button>
              </li>
              <li>
                <button onClick={onNavigateToAdmin} className="hover:text-white">
                  Manage Existing Posts
                </button>
              </li>
              <li>
                <button onClick={onNavigateToAdmin} className="hover:text-white">
                  Download Posts Backup
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-[#333] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Blogger Studio platform ke sath banaaya gaya <Heart className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
