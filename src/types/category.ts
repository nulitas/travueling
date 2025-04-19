export interface CategoriesResponse {
  data: Category[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface Category {
  id: number
  documentId: string
  name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}
export interface CreateCategoryRequest {
  name: string
}

export interface UpdateCategoryRequest {
  id: string
  data: { name: string }
}
