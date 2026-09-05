import { BlogPost, PostComment, BlogCategory, BlogSettings } from '../types';
import { INITIAL_POSTS, SAMPLE_COMMENTS, INITIAL_CATEGORIES } from '../data/initialPosts';

const POSTS_STORAGE_KEY = 'blogger_studio_posts_v1';
const COMMENTS_STORAGE_KEY = 'blogger_studio_comments_v1';
const CATEGORIES_STORAGE_KEY = 'blogger_studio_categories_v1';
const SETTINGS_STORAGE_KEY = 'blogger_studio_settings_v1';

export function getStoredPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_POSTS;
  } catch (err) {
    console.error('Failed to read posts from localStorage:', err);
    return INITIAL_POSTS;
  }
}

export function saveStoredPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts to localStorage:', err);
  }
}

export function getStoredComments(): PostComment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(SAMPLE_COMMENTS));
      return SAMPLE_COMMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read comments from localStorage:', err);
    return SAMPLE_COMMENTS;
  }
}

export function saveStoredComments(comments: PostComment[]): void {
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  } catch (err) {
    console.error('Failed to save comments to localStorage:', err);
  }
}

export function getStoredCategories(): BlogCategory[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_CATEGORIES;
  }
}

export function saveStoredCategories(categories: BlogCategory[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories:', err);
  }
}

export function getStoredSettings(): BlogSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
  return {
    siteName: 'Blogger Studio',
    siteTagline: 'Vichar, Gyan aur Latest Updates ka Digital Platform',
    adminPasscode: 'admin123',
  };
}

export function saveStoredSettings(settings: BlogSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// Calculate approximate read time
export function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Generate URL slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;
}
