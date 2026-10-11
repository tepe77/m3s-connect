export interface NewsComment {
  id: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  avatarUrl?: string;
  createdAt: string;
  content: string;
  isVerifiedAlumni?: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: {
    name: string;
    slug: string;
  };
  subCategory: {
    name: string;
    slug: string;
  };
  tags: string[];
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  contentImages: {
    url: string;
    caption: string;
    alt: string;
  }[];
  contentHtml: string[];
  comments: NewsComment[];
}

export const NEWS_ITEMS: NewsItem[] = [];
