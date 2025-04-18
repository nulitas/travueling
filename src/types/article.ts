export interface Article {
  id: number
  documentId: string
  title: string
  description: string
  cover_image_url: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
  category: {
    id: number
    name: string
  } | null
  user: {
    id: number
    username: string
    email: string
  }
  comments: unknown[]
  localizations: unknown[]
}

export interface ArticleDetails {
  data: {
    id: number
    documentId: string
    title: string
    description: string
    cover_image_url: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string | null
  }
  meta: object
}

export interface ArticlesResponse {
  data: Article[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface CreateArticleRequest {
  data: {
    title: string
    description: string
    cover_image_url: string
    category: number | null
  }
}

export interface UpdateArticleRequest {
  id: string
  data: {
    title?: string
    description?: string
    cover_image_url?: string
    category?: number | null
  }
}
