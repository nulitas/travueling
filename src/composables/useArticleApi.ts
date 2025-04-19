import { ref } from 'vue'
import api from '@/api'

import type {
  Article,
  ArticleDetails,
  ArticlesResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@/types/article'

export function useArticleApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getArticles = async (params: {
    page?: number
    pageSize?: number
    userId?: number
    categoryId?: number | null
  }) => {
    try {
      loading.value = true
      error.value = null
      let url = `/articles?populate=*&pagination[page]=${params.page ?? 1}&pagination[pageSize]=${params.pageSize ?? 10}`

      if (params.userId) {
        url += `&filters[user][id][$eq]=${params.userId}`
      }
      if (params.categoryId !== null && params.categoryId !== undefined) {
        url += `&filters[category][id][$eq]=${params.categoryId}`
      }

      const { data } = await api.get<ArticlesResponse>(url)
      return data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = String(err)
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const getArticle = async (id: string) => {
    const { data } = await api.get<ArticleDetails>(`/articles/${id}`)
    return data
  }

  const createArticle = async (payload: CreateArticleRequest) => {
    const { data } = await api.post<Article>('/articles', payload)
    return data
  }

  const updateArticle = async (payload: UpdateArticleRequest) => {
    const { data } = await api.put<Article>(`/articles/${payload.id}`, {
      data: payload.data,
    })
    return data
  }

  const deleteArticle = async (id: string) => {
    await api.delete(`/articles/${id}`)
  }

  return {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    loading,
    error,
  }
}
