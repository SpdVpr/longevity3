/**
 * Type definitions for the application
 */

// Strapi API response format
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi data structure
export interface StrapiData<T> {
  id: number;
  attributes: T;
}

// Strapi collection response
export type StrapiCollectionResponse<T> = StrapiResponse<StrapiData<T>[]>;

// Strapi single response
export type StrapiSingleResponse<T> = StrapiResponse<StrapiData<T>>;

// Strapi media format
export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: {
        thumbnail: {
          url: string;
          width: number;
          height: number;
        };
        small: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        large: {
          url: string;
          width: number;
          height: number;
        };
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string | null;
      provider: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

// Category attributes
export interface CategoryAttributes {
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: StrapiMedia;
  articles: StrapiCollectionResponse<ArticleAttributes>;
  localizations: {
    data: StrapiData<CategoryAttributes>[];
  };
}

// Article attributes
export interface ArticleAttributes {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  featured: boolean;
  image: StrapiMedia;
  category: StrapiSingleResponse<CategoryAttributes>;
  author: StrapiSingleResponse<AuthorAttributes>;
  tags: StrapiCollectionResponse<TagAttributes>;
  localizations: {
    data: StrapiData<ArticleAttributes>[];
  };
}

// Tag attributes
export interface TagAttributes {
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  articles: StrapiCollectionResponse<ArticleAttributes>;
  localizations: {
    data: StrapiData<TagAttributes>[];
  };
}

// Author attributes
export interface AuthorAttributes {
  name: string;
  bio: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  avatar: StrapiMedia;
  articles: StrapiCollectionResponse<ArticleAttributes>;
}

// Simplified types for frontend use
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  image: string;
  category: Category;
  author: Author;
  tags: Tag[];
  featured: boolean;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  name: string;
  bio: string;
  email: string;
  avatar: string;
}

// Pagination type
export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// Search params type
export interface SearchParams {
  query?: string;
  category?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}
