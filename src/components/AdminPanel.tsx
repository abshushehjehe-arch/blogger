import React, { useState, useRef } from 'react';
import { 
  PlusCircle, FileText, Image as ImageIcon, Eye, Save, Trash2, 
  Edit3, CheckCircle2, AlertCircle, ArrowLeft, Upload, 
  Sparkles, Globe, BarChart2, Layers, Settings, Download, RefreshCw, X
} from 'lucide-react';
import { BlogPost, BlogCategory, BlogSettings } from '../types';
import { IMAGE_PRESETS } from '../data/initialPosts';
import { calculateReadTime, generateSlug } from '../utils/storage';

interface AdminPanelProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  settings: BlogSettings;
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  onToggleStatus: (postId: string) => void;
  onUpdateSettings: (settings: BlogSettings) => void;
  onImportPosts: (imported: BlogPost[]) => void;
  onResetPosts: () => void;
  onViewPostLive: (post: BlogPost) => void;
  editingPostData?: BlogPost | null;
  onClearEditingPost: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  posts,
  categories,
  settings,
  onSavePost,
  onDeletePost,
  onToggleStatus,
  onUpdateSettings,
  onImportPosts,
  onResetPosts,
  onViewPostLive,
  editingPostData,
  onClearEditingPost,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'list' | 'settings'>('upload');

  // Form states for uploading/editing post
  const [editingId, setEditingId] = useState<string | null>(editingPostData ? editingPostData.id : null);
  const [title, setTitle] = useState(editingPostData ? editingPostData.title : '');
  const [slug, setSlug] = useState(editingPostData ? editingPostData.slug : '');
  const [excerpt, setExcerpt] = useState(editingPostData ? editingPostData.excerpt : '');
  const [content, setContent] = useState(editingPostData ? editingPostData.content : '');
  const [category, setCategory] = useState(editingPostData ? editingPostData.category : 'blogging');
  const [customCategory, setCustomCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState(editingPostData ? editingPostData.videoUrl || '' : '');
  const [coverImage, setCoverImage] = useState(
    editingPostData ? editingPostData.coverImage : IMAGE_PRESETS[1].url
  );
  const [tagsInput, setTagsInput] = useState(editingPostData ? editingPostData.tags.join(', ') : '');
  const [authorName, setAuthorName] = useState(editingPostData ? editingPostData.author.name : 'Admin Blogger');
  const [authorRole, setAuthorRole] = useState(editingPostData ? editingPostData.author.role : 'Content Author');
  const [authorAvatar, setAuthorAvatar] = useState(
    editingPostData ? editingPostData.author.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  );
  const [status, setStatus] = useState<'published' | 'draft'>(
    editingPostData ? editingPostData.status : 'published'
  );
  const [isFeatured, setIsFeatured] = useState(editingPostData ? !!editingPostData.featured : false);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings tab form states
  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline);

  // Filter for posts table
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync when editingPostData changes
  React.useEffect(() => {
    if (editingPostData) {
      setEditingId(editingPostData.id);
      setTitle(editingPostData.title);
      setSlug(editingPostData.slug);
      setExcerpt(editingPostData.excerpt);
      setContent(editingPostData.content);
      setVideoUrl(editingPostData.videoUrl || '');
      setCategory(editingPostData.category);
      setCoverImage(editingPostData.coverImage);
      setTagsInput(editingPostData.tags.join(', '));
      setAuthorName(editingPostData.author.name);
      setAuthorRole(editingPostData.author.role);
      setAuthorAvatar(editingPostData.author.avatar);
      setStatus(editingPostData.status);
      setIsFeatured(!!editingPostData.featured);
      setActiveTab('upload');
    }
  }, [editingPostData]);

  // Auto-generate slug when title changes if creating new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(generateSlug(val));
    }
  };

  // Local image file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Kripya ek valid image file select karein.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
        showNotification('success', 'Cover photo successfully select ho gayi!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick insertion helpers for editor
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent((prev) => prev + `\n${prefix}Heading / Text yahan likhein${suffix}\n`);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setVideoUrl('');
    setCategory('blogging');
    setCoverImage(IMAGE_PRESETS[1].url);
    setTagsInput('');
    setStatus('published');
    setIsFeatured(false);
    onClearEditingPost();
  };

  // Submit Post upload
  const handleSubmitPost = (publishStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      showNotification('error', 'Post ka Title daalna zaroori hai!');
      return;
    }
    if (!content.trim()) {
      showNotification('error', 'Post ka Content/Body daalna zaroori hai!');
      return;
    }

    const finalCategory = customCategory.trim() || category;
    const finalTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postPayload: BlogPost = {
      id: editingId || `post-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim() || title.slice(0, 140) + '...',
      content: content.trim(),
      videoUrl: videoUrl.trim(),
      coverImage: coverImage || IMAGE_PRESETS[0].url,
      category: finalCategory.toLowerCase(),
      tags: finalTags.length > 0 ? finalTags : ['Blog'],
      author: {
        name: authorName.trim() || 'Admin Blogger',
        role: authorRole.trim() || 'Author',
        avatar: authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      },
      createdAt: editingPostData ? editingPostData.createdAt : new Date().toISOString(),
      readTime: calculateReadTime(content),
      status: publishStatus,
      views: editingPostData ? editingPostData.views : 0,
      likes: editingPostData ? editingPostData.likes : 0,
      featured: isFeatured,
    };

    onSavePost(postPayload);
    showNotification(
      'success',
      editingId ? 'Post successfully update ho gayi!' : 'Shabaash! Nayi post upload ho gayi aur live hai!'
    );

    handleResetForm();
    setActiveTab('list');
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `blogger_studio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', 'Sabhi blog posts ka JSON backup download ho gaya!');
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImportPosts(imported);
          showNotification('success', `${imported.length} posts successfully restore ho gayi!`);
        } else {
          showNotification('error', 'Invalid JSON file format.');
        }
      } catch (err) {
        showNotification('error', 'JSON file parse nahi ho saki.');
      }
    };
    reader.readAsText(file);
  };

  // Stats calculation
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = posts.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  // Filtered posts for list table
  const filteredTablePosts = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = tableStatusFilter === 'all' || p.status === tableStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#141414] min-h-screen">
      
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-sm shadow-xl border text-sm font-medium animate-in fade-in slide-in-from-bottom-5 ${
            notification.type === 'success'
              ? 'bg-[#141414] text-[#46d369] border-[#46d369]'
              : 'bg-[#141414] text-[#E50914] border-[#E50914]'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#46d369]" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#E50914]" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Panel Header & Stats */}
      <div className="bg-[#141414] text-white rounded-sm p-6 sm:p-8 shadow-sm border border-[#333]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#333] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-sm text-xs font-semibold bg-[#E50914] text-white uppercase tracking-wider">
                Admin Control Room
              </span>
              <span className="text-xs text-gray-500">Blogger Post Manager</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">
              Blog Post Upload & Management Panel
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Yahan se aap nayi posts likhkar upload kar sakte hain, drafts save kar sakte hain, aur existing posts ko edit ya delete kar sakte hain.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleResetForm();
                setActiveTab('upload');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#E50914] hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nayi Post Likhein</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 text-center sm:text-left">
          <div className="bg-[#222] p-3.5 rounded-sm border border-[#333]">
            <span className="text-xs text-gray-400">Total Posts</span>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{totalPosts}</p>
          </div>
          <div className="bg-[#222] p-3.5 rounded-sm border border-[#333]">
            <span className="text-xs text-[#46d369]">Published Posts</span>
            <p className="text-xl sm:text-2xl font-bold text-[#46d369] mt-1">{publishedCount}</p>
          </div>
          <div className="bg-[#222] p-3.5 rounded-sm border border-[#333]">
            <span className="text-xs text-amber-500">Draft Posts</span>
            <p className="text-xl sm:text-2xl font-bold text-amber-500 mt-1">{draftCount}</p>
          </div>
          <div className="bg-[#222] p-3.5 rounded-sm border border-[#333]">
            <span className="text-xs text-gray-400">Total Views</span>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{totalViews}</p>
          </div>
          <div className="bg-[#222] p-3.5 rounded-sm border border-[#333]">
            <span className="text-xs text-[#E50914]">Total Likes</span>
            <p className="text-xl sm:text-2xl font-bold text-[#E50914] mt-1">{totalLikes}</p>
          </div>
        </div>
      </div>

      {/* Main Admin Tabs */}
      <div className="flex border-b border-[#333]">
        <button
          id="admin-tab-upload-btn"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'upload'
              ? 'border-[#E50914] text-white bg-[#333]'
              : 'border-transparent text-gray-500 hover:text-white hover:bg-[#222]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{editingId ? 'Post Edit Karein' : 'Post Upload Karein'}</span>
        </button>

        <button
          id="admin-tab-list-btn"
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'list'
              ? 'border-[#E50914] text-white bg-[#333]'
              : 'border-transparent text-gray-500 hover:text-white hover:bg-[#222]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sabhi Posts Dekhein ({posts.length})</span>
        </button>

        <button
          id="admin-tab-settings-btn"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-[#E50914] text-white bg-[#333]'
              : 'border-transparent text-gray-500 hover:text-white hover:bg-[#222]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Backup & Settings</span>
        </button>
      </div>

      {/* TAB 1: UPLOAD / WRITE POST */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141414] border border-[#333] rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#333] pb-4">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Post Edit Karein' : 'Nayi Blog Post Likhein'}
                </h2>
                {editingId && (
                  <button
                    onClick={handleResetForm}
                    className="text-xs text-[#E50914] hover:text-red-400 flex items-center gap-1 font-medium"
                  >
                    <X className="w-3.5 h-3.5" /> Edit cancel karein
                  </button>
                )}
              </div>

              {/* Title input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Post Title (Shikharak) *
                </label>
                <input
                  id="post-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Jaise: 2025 me Blogging se Online Earning Kaise Karein"
                  className="w-full px-4 py-3 text-lg font-bold rounded-sm border border-[#333] focus:outline-none focus:border-[#E50914] bg-[#222] text-white placeholder-gray-600"
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    URL Slug (Perm-link)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-awesome-blog-post"
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[#333] text-white focus:outline-none focus:border-[#E50914] bg-[#222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Category (Vibhag) *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-sm border border-[#333] text-white focus:outline-none focus:border-[#E50914] bg-[#222]"
                    >
                      {categories.filter(c => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="custom">+ Custom Category</option>
                    </select>
                  </div>
                  {category === 'custom' && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Apni category ka naam likhein..."
                      className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-amber-300 bg-amber-50/50"
                    />
                  )}
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Short Excerpt / Saransh (Homepage card par dikhega)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Post ke mukhya points ka 2 line ka summary..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-[#333] focus:outline-none focus:border-[#E50914] text-white bg-[#222]"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Video URL (YouTube ya Google Drive link)
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Jaise: https://youtu.be/... ya https://drive.google.com/file/d/..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm border border-[#333] focus:outline-none focus:border-[#E50914] text-white bg-[#222]"
                />
              </div>

              {/* Main Content Editor */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Post Content (Article Body) *
                  </label>
                  <div className="flex items-center gap-1 bg-[#222] p-1 rounded-sm">
                    <button
                      type="button"
                      onClick={() => setEditorTab('write')}
                      className={`px-3 py-1 rounded-sm text-xs font-semibold transition-colors ${
                        editorTab === 'write' ? 'bg-[#333] shadow-xs text-white' : 'text-gray-400'
                      }`}
                    >
                      Likhna (Write)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1 rounded-sm text-xs font-semibold transition-colors ${
                        editorTab === 'preview' ? 'bg-[#333] shadow-xs text-white' : 'text-gray-400'
                      }`}
                    >
                      Preview (Dekhein)
                    </button>
                  </div>
                </div>

                {/* Quick formatting toolbar */}
                {editorTab === 'write' && (
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-[#222] border border-[#333] rounded-t-sm text-xs text-gray-300">
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ')}
                      className="px-2 py-1 rounded-sm hover:bg-[#333] font-bold text-white"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      className="px-2 py-1 rounded-sm hover:bg-[#333] font-bold text-white"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <span className="text-[#444]">|</span>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ')}
                      className="px-2 py-1 rounded-sm hover:bg-[#333] italic text-white"
                      title="Quote"
                    >
                      "Quote"
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      className="px-2 py-1 rounded-sm hover:bg-[#333] text-white"
                      title="Bullet list"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('1. ')}
                      className="px-2 py-1 rounded-sm hover:bg-[#333] text-white"
                      title="Numbered list"
                    >
                      1. List
                    </button>
                    <span className="text-[#444]">|</span>
                    <button
                      type="button"
                      onClick={() => insertFormatting('```ts\n// Code yahan likhein\n', '\n```')}
                      className="px-2 py-1 rounded-sm hover:bg-[#333] font-mono text-[11px] text-white"
                      title="Code snippet"
                    >
                      &lt;/&gt; Code
                    </button>
                    <span className="ml-auto text-[11px] text-gray-500 pr-1">
                      {calculateReadTime(content)} ({content.trim().split(/\s+/).filter(Boolean).length} words)
                    </span>
                  </div>
                )}

                {editorTab === 'write' ? (
                  <textarea
                    id="post-content-textarea"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Apna article yahan likhein... Aap headings (## Title), lists (- Item), aur quotes (> Quotes) use kar sakte hain."
                    className="w-full px-4 py-3 text-sm rounded-b-sm border border-[#333] focus:outline-none focus:border-[#E50914] bg-[#141414] text-white font-mono leading-relaxed"
                  />
                ) : (
                  <div className="p-4 sm:p-6 bg-[#141414] border border-[#333] rounded-sm min-h-[300px] prose prose-invert max-w-none">
                    {content ? (
                      <div className="space-y-3">
                        {content.split('\n').map((l, idx) => (
                          <p key={idx} className="text-gray-300 text-sm leading-relaxed">
                            {l}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">Abhi kuch nahi likha hai...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Tags (Comma se alag karein: e.g. Blogging, Tech, Tips)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Blogging, SEO, Web, Earnings"
                  className="w-full px-3 py-2 text-xs rounded-sm border border-[#333] text-white focus:outline-none focus:border-[#E50914] bg-[#222]"
                />
              </div>

            </div>
          </div>

          {/* Sidebar Controls (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Publish Actions Card */}
            <div className="bg-[#141414] border border-[#333] rounded-sm p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-[#333] pb-3 flex items-center justify-between">
                <span>Publish Actions</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${
                  status === 'published' ? 'bg-[#46d369]/20 text-[#46d369]' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {status}
                </span>
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-[#333]">
                <span className="text-xs text-gray-400 font-medium">Homepage Featured Post</span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#E50914] rounded focus:ring-[#E50914] cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="admin-publish-btn"
                  type="button"
                  onClick={() => handleSubmitPost('published')}
                  className="w-full py-2.5 px-4 rounded-sm bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Globe className="w-4 h-4" />
                  <span>{editingId ? 'Post Update & Publish' : 'Live Publish Karein'}</span>
                </button>

                <button
                  id="admin-save-draft-btn"
                  type="button"
                  onClick={() => handleSubmitPost('draft')}
                  className="w-full py-2 px-4 rounded-sm bg-[#333] hover:bg-gray-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Draft Ke Roop Me Save Karein</span>
                </button>
              </div>
            </div>

            {/* Cover Image Selector */}
            <div className="bg-[#141414] border border-[#333] rounded-sm p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#333] pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#E50914]" />
                  <span>Cover Photo</span>
                </h3>
              </div>

              {/* Current Preview */}
              <div className="relative rounded-sm overflow-hidden h-36 bg-[#222] border border-[#333]">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                  Current Image
                </div>
              </div>

              {/* Local File Upload Button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 border border-[#333] hover:border-gray-500 bg-[#222] hover:bg-[#333] rounded-sm text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Device se Image Upload Karein</span>
                </button>
              </div>

              {/* Or Paste URL */}
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">
                  Ya direct Image URL paste karein:
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 text-xs rounded-sm border border-[#333] text-white focus:outline-none focus:border-[#E50914] bg-[#222]"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="block text-[11px] font-semibold text-gray-400 mb-2">
                  Presets (1-click select):
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className="group relative rounded-sm overflow-hidden h-12 border border-[#333] hover:border-[#E50914] transition-all"
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Author Profile */}
            <div className="bg-[#141414] border border-[#333] rounded-sm p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-white border-b border-[#333] pb-2">
                Author Details
              </h3>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Lekhak ka Naam</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="w-full px-3 py-1.5 text-xs rounded-sm border border-[#333] bg-[#222] text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Founder & Blogger"
                  className="w-full px-3 py-1.5 text-xs rounded-sm border border-[#333] bg-[#222] text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ALL POSTS LIST / TABLE */}
      {activeTab === 'list' && (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold font-editorial text-stone-900">
                Sabhi Uploaded Posts ({posts.length})
              </h2>
              <p className="text-xs text-stone-500">
                Yahan se aap kisi bhi post ko edit, delete ya status toggle kar sakte hain.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Title ya category search..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="px-3.5 py-1.5 text-xs rounded-lg border border-stone-300 w-full sm:w-56 focus:outline-none"
              />

              <select
                value={tableStatusFilter}
                onChange={(e) => setTableStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-700"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>

          {filteredTablePosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 text-sm">Koi post match nahi hui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Stats</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredTablePosts.map((post) => (
                    <tr key={post.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 max-w-md">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-12 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              {post.featured && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-stone-950">
                                  Featured
                                </span>
                              )}
                              <h4 className="font-bold text-stone-900 line-clamp-1 text-xs sm:text-sm">
                                {post.title}
                              </h4>
                            </div>
                            <span className="text-[11px] text-stone-500 line-clamp-1">{post.excerpt}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-800 uppercase">
                          {post.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => onToggleStatus(post.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle status"
                        >
                          {post.status === 'published' ? '● Published' : '○ Draft'}
                        </button>
                      </td>

                      <td className="py-3.5 px-3 text-stone-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-3 text-stone-500 whitespace-nowrap">
                        <span className="font-medium text-stone-700">{post.views}</span> views •{' '}
                        <span className="font-medium text-rose-600">{post.likes}</span> likes
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewPostLive(post)}
                            title="View on Blog"
                            className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-200 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(post.id);
                              setTitle(post.title);
                              setSlug(post.slug);
                              setExcerpt(post.excerpt);
                              setContent(post.content);
                              setCategory(post.category);
                              setCoverImage(post.coverImage);
                              setTagsInput(post.tags.join(', '));
                              setAuthorName(post.author.name);
                              setAuthorRole(post.author.role);
                              setStatus(post.status);
                              setIsFeatured(!!post.featured);
                              setActiveTab('upload');
                            }}
                            title="Edit Post"
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Kya aap sach me "${post.title}" ko delete karna chahte hain?`)) {
                                onDeletePost(post.id);
                                showNotification('success', 'Post delete ho gayi.');
                              }
                            }}
                            title="Delete Post"
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BACKUP & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site identity */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
              Website Branding
            </h3>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Blog Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Tagline</label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300"
              />
            </div>
            <button
              onClick={() => {
                onUpdateSettings({ ...settings, siteName, siteTagline });
                showNotification('success', 'Site settings successfully save ho gayi!');
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs transition-colors hover:bg-stone-800"
            >
              Settings Save Karein
            </button>
          </div>

          {/* Backup & Restore */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
              Data Backup & Restore
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Aap apni saari blog posts ko apne computer me JSON file ke roop me download kar sakte hain, taaki aapka content hamesha safe rahe.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>Download All Posts Backup (JSON)</span>
              </button>

              <input
                type="file"
                ref={jsonImportRef}
                onChange={handleImportJSON}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => jsonImportRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Restore Posts from Backup File</span>
              </button>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm('Kya aap default sample posts reset karna chahte hain?')) {
                      onResetPosts();
                      showNotification('success', 'Sample posts reset ho gayi.');
                    }
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Sample posts reload karein
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
