import { ref } from 'vue'
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
      console.log('Fetched categories:', response.data.data)
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
    try {
      // Match the exact React implementation format
      const response = await apiClient.post<Category>('/categories', categoryData)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error creating category:', err.response.status, err.response.data)
      } else {
        console.error('Error creating category:', err)
      }
      throw err
    }
  }
  const updateCategory = async ({ id, data }: UpdateCategoryRequest) => {
    try {
      console.log(`Updating category with ID: ${id}`, data)

      const response = await apiClient.put<Category>(`/categories/${id}`, data)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error updating category:', err.response.status, err.response.data)
      } else {
        console.error('Error updating category:', err)
      }
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await apiClient.delete(`/categories/${id}`)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error deleting category:', err.response.status, err.response.data)
      } else {
        console.error('Error deleting category:', err)
      }
      throw err
    }
  }

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
