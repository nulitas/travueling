export interface Comment {
  id: number
  documentId: string
  content: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  user: {
    id: number
    username: string
  }
  article: {
    id: number
    documentId: string
    title: string
  }
}

export interface CommentsResponse {
  data: Comment[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface CreateCommentRequest {
  data: {
    content: string
    article: string
  }
}

export interface UpdateCommentRequest {
  id: string
  data: {
    content: string
  }
}
