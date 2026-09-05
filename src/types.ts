export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: string;
  readTime: string;
  status: 'published' | 'draft';
  views: number;
  likes: number;
  featured?: boolean;
  videoUrl?: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
}

export interface BlogSettings {
  siteName: string;
  siteTagline: string;
  adminPasscode?: string;
  announcement?: string;
}
