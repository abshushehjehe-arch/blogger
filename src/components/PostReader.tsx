import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  ArrowLeft, Calendar, Clock, Heart, Eye, Share2, 
  Check, MessageSquare, Send, User, Tag, Edit3, Bookmark, LogIn, Play
} from 'lucide-react';
import { BlogPost, PostComment } from '../types';
import { AppUser } from '../context/AuthContext';

interface PostReaderProps {
  post: BlogPost;
  allPosts: BlogPost[];
  comments: PostComment[];
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, name: string, content: string) => void;
  onEditInAdmin: (post: BlogPost) => void;
  isAdmin?: boolean;
  currentUser?: AppUser | null;
}

export const PostReader: React.FC<PostReaderProps> = ({
  post,
  allPosts,
  comments,
  onBack,
  onSelectPost,
  onLikePost,
  onAddComment,
  onEditInAdmin,
  isAdmin = false,
  currentUser
}) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    setShowVideo(false);
    setCountdown(null);
  }, [post.id]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setShowVideo(true);
      setCountdown(null);
      return;
    }
    const timerId = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timerId);
  }, [countdown]);

  const postComments = comments.filter((c) => c.postId === post.id);

  const handleLike = () => {
    if (!hasLiked) {
      onLikePost(post.id);
      setHasLiked(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`"${post.title}" - Check out this interesting article: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;
    const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    onAddComment(post.id, name, commentText.trim());
    setCommentText('');
  };

  // Render markdown-like simple syntax into styled elements
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-semibold text-white mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-[#E50914] pl-4 py-2 my-5 italic text-gray-300 bg-[#333] rounded-r-sm">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-gray-300 my-1.5 leading-relaxed">
            {trimmed.replace(/^[-*]\s/, '')}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-gray-300 my-1.5 leading-relaxed">
            {trimmed.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      if (trimmed.startsWith('```')) {
        return null; // Handle in next pass or standard code
      }
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-gray-300 leading-relaxed text-base sm:text-lg my-3">
          {line}
        </p>
      );
    });
  };

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.status === 'published')
    .slice(0, 3);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top action navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          id="post-back-to-all-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors py-1.5 px-3 rounded-sm hover:bg-[#333]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wapas Sabhi Posts par jayein</span>
        </button>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditInAdmin(post)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#333] hover:bg-gray-600 px-3 py-1.5 rounded-sm transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Admin Edit</span>
            </button>
          </div>
        )}
      </div>

      {/* Header Info */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider bg-white text-black">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views} views</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.2]">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 font-light leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author bar */}
        <div className="flex items-center justify-between pt-4 border-t border-b border-[#333] py-3.5">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
              alt={post.author.name}
              className="w-11 h-11 rounded-sm object-cover border border-[#333]"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-sm font-bold text-white">{post.author.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{post.author.role}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="like-post-btn"
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                hasLiked
                  ? 'bg-transparent text-[#E50914] border border-[#E50914] scale-105'
                  : 'bg-[#333] hover:bg-gray-600 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-[#E50914] text-[#E50914]' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="p-2 rounded-sm text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#46d369]" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Video or Cover Image */}
      {post.videoUrl ? (
        showVideo ? (
          <div className="mb-8 rounded-sm overflow-hidden border border-[#333] bg-black">
            {post.videoUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/) ? (
              <div className="relative pt-[56.25%] w-full">
                <iframe
                  src={`https://drive.google.com/file/d/${post.videoUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/)![1]}/preview`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen"
                ></iframe>
              </div>
            ) : (
              <div className="relative pt-[56.25%] w-full">
                <ReactPlayer
                  url={post.videoUrl}
                  className="absolute top-0 left-0"
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={true}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <div className="rounded-sm overflow-hidden border border-[#333] relative">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[500px] object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                {countdown !== null ? (
                  <div className="px-8 py-3 bg-[#333] text-[#E50914] font-bold rounded-sm text-lg sm:text-2xl shadow-xl animate-pulse">
                    Video starting in {countdown} seconds...
                  </div>
                ) : (
                  <button
                    onClick={() => setCountdown(5)}
                    className="px-8 py-4 bg-[#E50914] hover:bg-red-700 text-white font-bold rounded-sm text-lg sm:text-xl flex items-center gap-3 transition-all shadow-xl active:scale-95"
                  >
                    <Play className="w-6 h-6 fill-white" /> Watch Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        post.coverImage && (
          <div className="mb-8 rounded-sm overflow-hidden border border-[#333]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full max-h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )
      )}

      {/* Main Body Content */}
      <div className="prose prose-invert max-w-none mb-12">
        {renderContent(post.content)}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-t border-[#333] mb-8">
          <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
            <Tag className="w-3.5 h-3.5" /> Tags:
          </span>
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-sm bg-[#333] text-gray-300 border border-transparent font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Sharing box */}
      <div className="bg-[#222] border border-[#333] rounded-sm p-4 sm:p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-white text-base">Aapko ye post pasand aayi?</h4>
          <p className="text-xs sm:text-sm text-gray-400">Apne dosto aur fellow creators ke sath share karein!</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-semibold transition-colors"
          >
            WhatsApp par Share
          </button>
          <button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-transparent hover:bg-[#333] text-white border border-[#333] text-xs font-semibold transition-colors"
          >
            {copiedLink ? 'Copied!' : 'Link Copy'}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <section className="mb-14 border-t border-[#333] pt-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-white" />
          <h3 className="text-xl font-bold text-white">
            Comments & Feedback ({postComments.length})
          </h3>
        </div>

        {/* Comment form */}
        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="bg-[#222] border border-[#333] rounded-sm p-4 sm:p-5 mb-8 shadow-sm">
            <h4 className="text-sm font-semibold text-white mb-3">Apna vichar ya question likhein</h4>
            
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-400 mb-1">Comment as {currentUser.displayName || currentUser.email}</label>
              <textarea
                required
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Is article ke baare me aap kya sochte hain..."
                className="w-full px-3 py-2 text-sm rounded-sm bg-[#141414] text-white border border-[#333] focus:outline-none focus:border-[#E50914] placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#E50914] hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Comment Post Karein
            </button>
          </form>
        ) : (
          <div className="bg-[#222] border border-[#333] rounded-sm p-6 text-center mb-8">
            <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white mb-1">Log in to comment</h4>
            <p className="text-xs text-gray-400 mb-4">Aapko comment karne ke liye login karna hoga.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-gray-200 text-black text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              Go to Login
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {postComments.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-3">Pehle comment aap hi karein!</p>
          ) : (
            postComments.map((comm) => (
              <div key={comm.id} className="bg-[#222] border border-[#333] rounded-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-sm bg-[#333] text-gray-300 flex items-center justify-center text-xs font-bold">
                      {comm.authorName[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-white">{comm.authorName}</span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {new Date(comm.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed pl-9">{comm.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[#333] pt-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            Ye Posts Bhi Padhein
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedPosts.map((relPost) => (
              <div
                key={relPost.id}
                onClick={() => onSelectPost(relPost)}
                className="bg-[#141414] border border-[#333] rounded-sm overflow-hidden cursor-pointer group hover:border-gray-500 transition-all flex flex-col"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={relPost.coverImage}
                    alt={relPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between relative -mt-6">
                  <div>
                    <span className="text-[10px] font-semibold text-white px-1.5 py-0.5 bg-[#E50914] rounded-sm uppercase tracking-wider shadow-sm">
                      {relPost.category}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-2 mt-2 group-hover:text-red-400 transition-colors">
                      {relPost.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-500 mt-2 block">{relPost.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
