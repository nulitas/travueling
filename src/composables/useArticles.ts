import { ref, watch } from 'vue'
import { useArticleApi } from '@/composables/useArticleApi'
import type { Article } from '@/types/article'

export const useArticles = (categoryId = ref<number | null>(null)) => {
  const currentPage = ref(1)
  const articlesPerPage = 3
  const articles = ref<Article[]>([])
  const pagination = ref<unknown>(null)
  const isLoading = ref(false)
  const isError = ref(false)
  const error = ref<unknown | null>(null)
  const isFetching = ref(false)
  const hasMore = ref(false)

  const articleApi = useArticleApi()

  const fetchArticles = async () => {
    isFetching.value = true
    isLoading.value = articles.value.length === 0

    try {
      const response = await articleApi.getArticles({
        page: currentPage.value,
        pageSize: articlesPerPage,
        categoryId: categoryId.value,
      })

      if (response.data) {
        const uniqueArticles = response.data.filter(
          (newArticle) =>
            !articles.value.some((existingArticle) => existingArticle.id === newArticle.id),
        )

        articles.value = [...articles.value, ...uniqueArticles]
        pagination.value = response.meta.pagination
        hasMore.value = currentPage.value < response.meta.pagination.pageCount
      }

      isError.value = false
      error.value = null
    } catch (err) {
      isError.value = true
      error.value = err as unknown
      console.error('Error fetching articles:', err)
    } finally {
      isLoading.value = false
      isFetching.value = false
    }
  }

  watch(
    categoryId,
    () => {
      articles.value = []
      currentPage.value = 1
      fetchArticles()
    },
    { immediate: true },
  )

  const loadMore = () => {
    if (!isFetching.value && hasMore.value) {
      currentPage.value++
      fetchArticles()
    }
  }

  return {
    articles,
    pagination,
    isLoading,
    isError,
    error,
    loadMore,
    hasMore,
    isFetching,
  }
}
