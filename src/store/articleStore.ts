// stores/articleStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useArticleApi } from '@/composables/useArticleApi'
import type { Article } from '@/types/article'

export const useArticleStore = defineStore('article', () => {
  const articles = ref<Article[]>([])
  const isLoading = ref(false)
  const api = useArticleApi()

  const fetchArticles = async (params: {
    page?: number
    pageSize?: number
    userId?: number
    categoryId?: number | null
  }) => {
    isLoading.value = true
    try {
      const data = await api.getArticles(params)
      articles.value = data.data
    } finally {
      isLoading.value = false
    }
  }

  return {
    articles,
    isLoading,
    fetchArticles,
  }
})
