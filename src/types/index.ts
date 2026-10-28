export type ContentStatus = "draft" | "published";

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  externalUrl?: string;
  status: ContentStatus;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface ContentCard {
  id: string;
  title: string;
  summary: string;
  publisherName: string;
  instagramUrl: string;
  projectId?: string | null;
  thumbnail?: string;
  thumbnailAlt?: string;
  contentDate?: string;
  category?: string;
  status: ContentStatus;
  sortOrder: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
  createdAt: string;
  lastLoginAt?: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: "page_view" | "project_view" | "instagram_outbound_click";
  targetId?: string;
  targetSlug?: string;
  targetUrl?: string;
  timestamp: string;
  path: string;
}

export interface EcosystemBrand {
  id: string;
  name: string;
  role: string;
  description: string;
  status: string;
  badge: string;
  linkText?: string;
  linkUrl?: string;
}
