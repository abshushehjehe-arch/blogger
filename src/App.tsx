/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BlogPost, BlogCategory, PostComment, BlogSettings } from './types';
import { 
  getStoredPosts, saveStoredPosts, 
  getStoredComments, saveStoredComments, 
  getStoredCategories, saveStoredCategories, 
  getStoredSettings, saveStoredSettings 
} from './utils/storage';
import { INITIAL_POSTS } from './data/initialPosts';
import { Navbar } from './components/Navbar';
import { BlogHome } from './components/BlogHome';
import { PostReader } from './components/PostReader';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './context/AuthContext';
import { logout } from './lib/firebase';

export default function App() {
  const { user, loading } = useAuth();
  
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredPosts());
  const [comments, setComments] = useState<PostComment[]>(() => getStoredComments());
  const [categories, setCategories] = useState<BlogCategory[]>(() => getStoredCategories());
  const [settings, setSettings] = useState<BlogSettings>(() => getStoredSettings());

  const [currentView, setCurrentView] = useState<'blog' | 'admin' | 'reader' | 'auth'>('blog');
  const [authMode, setAuthMode] = useState<'login' | 'admin-login'>('login');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isAdminLoggedIn = user?.role === 'admin';

  // Automatically redirect to admin if they logged in from admin-login
  useEffect(() => {
    if (user && currentView === 'auth') {
      if (isAdminLoggedIn) {
        setCurrentView('admin');
      } else {
        setCurrentView('blog');
      }
    }
  }, [user, currentView, isAdminLoggedIn]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedPost]);

  // Save post from Admin Panel
  const handleSavePost = (savedPost: BlogPost) => {
    setPosts((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === savedPost.id);
      let updated: BlogPost[];
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = savedPost;
      } else {
        updated = [savedPost, ...prev];
      }
      saveStoredPosts(updated);
      return updated;
    });

    if (savedPost.category) {
      setCategories((prev) => {
        const catExists = prev.some((c) => c.id.toLowerCase() === savedPost.category.toLowerCase());
        if (!catExists) {
          const newCat: BlogCategory = {
            id: savedPost.category.toLowerCase(),
            name: savedPost.category.charAt(0).toUpperCase() + savedPost.category.slice(1),
            description: `${savedPost.category} posts`,
            badgeColor: 'bg-stone-100 text-stone-800',
          };
          const updatedCats = [...prev, newCat];
          saveStoredCategories(updatedCats);
          return updatedCats;
        }
        return prev;
      });
    }

    if (selectedPost && selectedPost.id === savedPost.id) {
      setSelectedPost(savedPost);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      saveStoredPosts(updated);
      return updated;
    });
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
      setCurrentView('blog');
    }
  };

  const handleToggleStatus = (postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const newStatus: 'published' | 'draft' = p.status === 'published' ? 'draft' : 'published';
          return { ...p, status: newStatus };
        }
        return p;
      });
      saveStoredPosts(updated);
      return updated;
    });
  };

  const handleSelectPost = (post: BlogPost) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === post.id) {
          return { ...p, views: (p.views || 0) + 1 };
        }
        return p;
      });
      saveStoredPosts(updated);
      return updated;
    });
    setSelectedPost({ ...post, views: (post.views || 0) + 1 });
    setCurrentView('reader');
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          return { ...p, likes: (p.likes || 0) + 1 };
        }
        return p;
      });
      saveStoredPosts(updated);
      return updated;
    });
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    }
  };

  const handleAddComment = (postId: string, name: string, content: string) => {
    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorName: name,
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => {
      const updated = [newComment, ...prev];
      saveStoredComments(updated);
      return updated;
    });
  };

  const handleUpdateSettings = (newSettings: BlogSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleImportPosts = (imported: BlogPost[]) => {
    setPosts(imported);
    saveStoredPosts(imported);
  };

  const handleResetPosts = () => {
    setPosts(INITIAL_POSTS);
    saveStoredPosts(INITIAL_POSTS);
  };

  const handleEditInAdmin = (post: BlogPost) => {
    setEditingPost(post);
    setCurrentView('admin');
  };

  const handleLoginClick = (mode: 'login' | 'admin-login') => {
    if (mode === 'admin-login' && isAdminLoggedIn) {
      setCurrentView('admin');
      return;
    }
    setAuthMode(mode);
    setCurrentView('auth');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('blog');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white">
      {currentView !== 'auth' && (
        <Navbar
          settings={settings}
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'admin' && !isAdminLoggedIn) {
              handleLoginClick('admin-login');
              return;
            }
            setCurrentView(view);
            if (view === 'blog') setSelectedPost(null);
          }}
          onOpenCreatePost={() => {
            if (!isAdminLoggedIn) {
              handleLoginClick('admin-login');
              return;
            }
            setEditingPost(null);
            setCurrentView('admin');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAdminLoggedIn={isAdminLoggedIn}
          user={user}
          onLogin={() => handleLoginClick('login')}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1">
        {currentView === 'auth' && (
          <AuthPage
            defaultMode={authMode}
            onBack={() => setCurrentView('blog')}
          />
        )}

        {currentView === 'blog' && (
          <BlogHome
            posts={posts}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setSearchQuery('');
            }}
            onSelectPost={handleSelectPost}
            searchQuery={searchQuery}
          />
        )}

        {currentView === 'reader' && selectedPost && (
          <PostReader
            post={selectedPost}
            allPosts={posts}
            comments={comments}
            onBack={() => {
              setSelectedPost(null);
              setCurrentView('blog');
            }}
            onSelectPost={handleSelectPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onEditInAdmin={handleEditInAdmin}
            isAdmin={isAdminLoggedIn}
            currentUser={user}
          />
        )}

        {currentView === 'admin' && isAdminLoggedIn && (
          <AdminPanel
            posts={posts}
            categories={categories}
            settings={settings}
            onSavePost={handleSavePost}
            onDeletePost={handleDeletePost}
            onToggleStatus={handleToggleStatus}
            onUpdateSettings={handleUpdateSettings}
            onImportPosts={handleImportPosts}
            onResetPosts={handleResetPosts}
            onViewPostLive={(post) => {
              setSelectedPost(post);
              setCurrentView('reader');
            }}
            editingPostData={editingPost}
            onClearEditingPost={() => setEditingPost(null)}
          />
        )}
      </main>

      {currentView !== 'auth' && (
        <Footer
          settings={settings}
          categories={categories}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setCurrentView('blog');
          }}
          onNavigateToAdmin={() => {
            if (isAdminLoggedIn) setCurrentView('admin');
            else handleLoginClick('admin-login');
          }}
          onNavigateToBlog={() => {
            setSelectedPost(null);
            setCurrentView('blog');
          }}
        />
      )}
    </div>
  );
}
