import React from 'react';
import { Calendar, Clock, Eye, Heart, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { BlogPost, BlogCategory } from '../types';

interface BlogHomeProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onSelectPost: (post: BlogPost) => void;
  searchQuery: string;
}

export const BlogHome: React.FC<BlogHomeProps> = ({
  posts,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectPost,
  searchQuery,
}) => {
  // Filter posts
  const publishedPosts = posts.filter((p) => p.status === 'published');
  
  const filteredPosts = publishedPosts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch = 
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query)) ||
      p.author.name.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // No separate featured post for hero banner anymore, everything goes in grid
  const gridPosts = filteredPosts;

  return (
    <div className="bg-[#141414] min-h-screen pt-8 pb-16">

      {/* Categories Row */}
      <section className="space-y-4 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
            <span className="text-sm font-semibold text-gray-400 mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-4 h-4" /> Genres:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-black'
                      : 'bg-[#333] hover:bg-gray-700 text-white border border-transparent'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Total {filteredPosts.length} title{filteredPosts.length === 1 ? '' : 's'}
          </div>
        </div>

        {searchQuery && (
          <div className="p-3 bg-[#333] border border-gray-600 rounded-sm text-sm text-white flex items-center justify-between">
            <span>
              Searching results for: <strong className="text-[#E50914]">"{searchQuery}"</strong>
            </span>
            <span className="font-semibold">{filteredPosts.length} matches found</span>
          </div>
        )}
      </section>

      {/* Articles Grid */}
      <section className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-white mb-4">Trending Now</h2>
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center bg-[#141414] rounded-sm border border-[#333] p-8">
            <div className="w-12 h-12 rounded-full bg-[#333] text-gray-400 mx-auto flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Koi post nahi mili</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Aapne jo search kiya ya category select ki usme abhi koi published post nahi hai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="relative rounded-md overflow-hidden cursor-pointer group bg-[#141414] border border-transparent hover:border-[#333] transition-all aspect-[16/9]"
              >
                {/* Cover Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Card Hover Details */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 translate-y-2 group-hover:translate-y-0">
                  <h2 className="text-sm font-bold text-white leading-tight mb-1 line-clamp-1">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] text-gray-300 font-semibold mb-2">
                    <span className="text-[#46d369]">New</span>
                    <span className="border border-gray-500 px-1 rounded-sm">16+</span>
                    <span>{post.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200">
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button className="w-6 h-6 rounded-full border border-gray-400 text-white flex items-center justify-center hover:border-white">
                      <Heart className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Creator / Newsletter Banner */}
      <section className="px-4 sm:px-6 lg:px-8 mt-12">
        <div className="rounded-sm bg-gradient-to-r from-[#141414] to-[#E50914]/20 border border-[#333] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Never Miss a Story
            </h3>
            <p className="text-sm text-gray-400 max-w-lg">
              Hum blogging, tech aur creative online guides regularly publish karte hain. Hamari community ka hissa banein.
            </p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2 max-w-md">
            <input
              type="email"
              placeholder="Email address"
              className="px-4 py-3 text-sm bg-black/50 border border-gray-600 rounded-sm w-full focus:outline-none focus:border-white text-white placeholder-gray-500"
            />
            <button 
              onClick={() => alert('Shukriya! Aap newsletter me add ho gaye hain.')}
              className="px-6 py-3 rounded-sm bg-[#E50914] hover:bg-red-700 text-white text-sm font-bold shrink-0 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
