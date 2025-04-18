import { ref, onMounted } from 'vue'
import axios from 'axios'
import type {
  Category,
  CategoriesResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/category'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const useCategoryApi = () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<unknown>(null)

  const getCategories = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.get<CategoriesResponse>('/categories')
      categories.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err
      console.error('Error fetching categories:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getCategory = async (documentId: string) => {
    const response = await apiClient.get<Category>(`/categories/${documentId}`)
    return response.data
  }

  const createCategory = async (categoryData: CreateCategoryRequest) => {
    const response = await apiClient.post<Category>('/categories', categoryData)
    return response.data
  }

  const updateCategory = async ({ id, data }: UpdateCategoryRequest) => {
    const response = await apiClient.put<Category>(`/categories/${id}`, { data })
    return response.data
  }

  const deleteCategory = async (id: string) => {
    await apiClient.delete(`/categories/${id}`)
  }

  onMounted(() => {
    getCategories()
  })

  return {
    categories,
    isLoading,
    error,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
