import axios from 'axios'
import type {
  Article,
  ArticleDetails,
  ArticlesResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@/types/article'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const useArticleApi = () => {
  const getArticles = async ({
    page = 1,
    pageSize = 10,
    userId,
    categoryId,
  }: {
    page?: number
    pageSize?: number
    userId?: number
    categoryId?: number | null
  } = {}) => {
    let url = `/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`

    if (userId) {
      url += `&filters[user][id][$eq]=${userId}`
    }

    if (categoryId !== null && categoryId !== undefined) {
      url += `&filters[category][id][$eq]=${categoryId}`
    }

    const response = await apiClient.get<ArticlesResponse>(url)
    return response.data
  }

  const getArticle = async (documentId: string) => {
    const response = await apiClient.get<ArticleDetails>(`/articles/${documentId}`)
    return response.data
  }

  const createArticle = async (articleData: CreateArticleRequest) => {
    const response = await apiClient.post<Article>('/articles', articleData)
    return response.data
  }

  const updateArticle = async ({ id, data }: UpdateArticleRequest) => {
    const response = await apiClient.put<Article>(`/articles/${id}`, { data })
    return response.data
  }

  const deleteArticle = async (id: string) => {
    await apiClient.delete(`/articles/${id}`)
  }

  return {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  }
}
