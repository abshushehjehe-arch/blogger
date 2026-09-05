import { BlogPost, BlogCategory } from '../types';

export const INITIAL_CATEGORIES: BlogCategory[] = [
  { id: 'all', name: 'Sabhi Posts', description: 'All blog articles', badgeColor: 'bg-zinc-800 text-white' },
  { id: 'tech', name: 'Technology & AI', description: 'Tech news, gadgets and AI developments', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'blogging', name: 'Blogging & SEO', description: 'Tips to grow your blog and make money online', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'coding', name: 'Web Development', description: 'Frontend, backend, React, and programming', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'lifestyle', name: 'Lifestyle & Career', description: 'Productivity, career growth, and work-life balance', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Blogging se Paise Kaise Kamaye: Ek Complete 2025 Guide',
    slug: 'blogging-se-paise-kaise-kamaye-guide',
    excerpt: 'Agar aap ek naya blog start karna chahte hain aur online earning karna chahte hain, toh ye comprehensive roadmap aapke liye hai. Jaane Ads, Affiliate aur Sponsored posts ke secrets.',
    content: `## 1. Niche Selection (Sahi Topic Ka Chunaav)
Blogging shuru karne ke liye sabse pehla step hai ek specific topic chunna jisme aapko interest ho aur market me demand ho. Jaise Technology, Finance, Travel, ya Education.

> "Ek successful blogger banne ke liye consistency aur audience ki help karna sabse zaroori mantra hai."

## 2. Platform Setup
- **Domain & Hosting:** Ek clean domain name select karein (.com ya .in)
- **CMS:** WordPress ya Custom React Blog application
- **SEO Optimization:** Fast loading speed aur mobile responsiveness ka dhyan rakhein

## 3. Monetization ke Top Tarike
1. **Google AdSense:** Jab traffic badhne lage, AdSense ads display karke income shuru karein.
2. **Affiliate Marketing:** Amazon Associates ya product links add karke commission kamayein.
3. **Sponsored Content:** Brands ke products ka honest review karein aur fixed sponsorship fee charge karein.
4. **Digital Products:** E-books, courses ya templates bechein.

## Conclusion
Blogging ek long-term business hai. Agar aap agle 6 mahine lagatar high quality content publish karenge, toh aap ek solid passive income build kar sakte hain.`,
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
    category: 'blogging',
    tags: ['Blogging', 'Earn Money', 'SEO', 'Online Business'],
    author: {
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role: 'Head Content Strategist'
    },
    createdAt: '2025-05-15T10:30:00.000Z',
    readTime: '5 min read',
    status: 'published',
    views: 1420,
    likes: 89,
    featured: true,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'post-2',
    title: 'Next-Gen AI Tools Jo Har Web Creator Ko Use Karne Chahiye',
    slug: 'next-gen-ai-tools-for-creators',
    excerpt: 'Artificial Intelligence ne blogging aur content creation ki duniya badal di hai. Jaane top AI tools jo aapka content creation 10x fast kar sakte hain.',
    content: `## AI Revolution in Blogging
Pehle ek blog post likhne aur publish karne me 4-5 ghante lagte the, lekin modern AI tools ke sath aap research, outline aur grammar checking minutes me kar sakte hain.

### 1. Research & Outline Generation
Gemini aur Claude jaise LLMs topic research aur structured outline banane me madad karte hain. Always ensure ki human touch aur personalized experience add karein.

### 2. High Quality Visuals
Canva AI aur Midjourney se custom infographics aur featured thumbnails banayein jo aapke readers ko attract karein.

### 3. SEO Optimization
SurferSEO ya RankMath jaise tools target keywords identify karne me help karte hain taaki aapki post Google me #1 rank kare.`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    category: 'tech',
    tags: ['AI', 'Productivity', 'Tools', 'Technology'],
    author: {
      name: 'Priya Verma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      role: 'Tech Journalist'
    },
    createdAt: '2025-05-18T14:15:00.000Z',
    readTime: '4 min read',
    status: 'published',
    views: 980,
    likes: 64,
    featured: false
  },
  {
    id: 'post-3',
    title: 'Modern Web Development Roadmap 2025: React 19, Vite & Tailwind',
    slug: 'modern-web-development-roadmap-2025',
    excerpt: 'Frontend development seekhne ka sabse best tarika kya hai? React 19 ke naye features aur fast development tips ke baare me detail guide.',
    content: `## Modern Frontend Stack
Frontend ecosystem bohot tezi se evolve ho raha hai. Agar aap 2025 me ek top developer banna chahte hain toh in technologies par focus karein:

- **TypeScript:** Type safety aur bugs reduce karne ke liye standard ban chuka hai.
- **Tailwind CSS:** Utility-first styling se rapidly modern UI designs develop karein.
- **Vite:** Blazing fast build tool aur instant server startup.

### Code Snippet Example
\`\`\`typescript
// Modern clean React component
export function Greeting({ name }: { name: string }) {
  return (
    <div className="p-4 bg-emerald-50 text-emerald-900 rounded-lg">
      Namaste, {name}! Welcome to Blogger Studio.
    </div>
  );
}
\`\`\`

Har roz 1 ghanta practice karein aur real-world projects banayein!`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    category: 'coding',
    tags: ['React', 'WebDev', 'JavaScript', 'Coding'],
    author: {
      name: 'Aman Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      role: 'Senior Software Engineer'
    },
    createdAt: '2025-05-20T09:00:00.000Z',
    readTime: '6 min read',
    status: 'published',
    views: 1250,
    likes: 112,
    featured: false
  }
];

export const SAMPLE_COMMENTS = [
  {
    id: 'comm-1',
    postId: 'post-1',
    authorName: 'Vikram Singh',
    content: 'Bahut hi helpful guide hai sir! Maine apna blog start kiya hai aapke bataye steps follow karke.',
    createdAt: '2025-05-16T12:00:00.000Z'
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    authorName: 'Anjali Sharma',
    content: 'Affiliate marketing wala section sabse clear aur practical laga. Shukriya!',
    createdAt: '2025-05-17T16:30:00.000Z'
  }
];

export const IMAGE_PRESETS = [
  { name: 'Tech & Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Blogging & Laptop', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Abstract Art', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Coffee & Books', url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Desk & Notebook', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop' },
  { name: 'AI & Data', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Travel & Nature', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Business Growth', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop' },
];
