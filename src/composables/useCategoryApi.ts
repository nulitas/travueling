import { ref } from 'vue'
import axios from 'axios'
import type {
  Category,
  CategoriesResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/category'
import { useAuthStore } from '@/store/authStore'

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
  const authStore = useAuthStore()

  const getAuthHeaders = () => {
    const token = authStore.token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const getCategories = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.get<CategoriesResponse>('/categories', {
        headers: { ...getAuthHeaders() },
      })
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
    const response = await apiClient.get<Category>(`/categories/${documentId}`, {
      headers: { ...getAuthHeaders() },
    })
    return response.data
  }

  const createCategory = async (categoryData: CreateCategoryRequest) => {
    try {
      console.log('Creating category with data:', categoryData)

      const payload = { data: categoryData }
      console.log('Sending create payload:', payload)

      const response = await apiClient.post<Category>('/categories', payload, {
        headers: { ...getAuthHeaders() },
      })
      console.log('Category created:', response.data)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error creating category:', err.response.status, err.response.data)

        console.error('Error response body:', err.response.data)
      } else {
        console.error('Error creating category:', err)
      }
      throw err
    }
  }

  const updateCategory = async ({ id, data }: UpdateCategoryRequest) => {
    try {
      console.log(`Updating category with ID: ${id}`, data)

      const response = await apiClient.put<Category>(
        `/categories/${id}`,
        { data },
        {
          headers: { ...getAuthHeaders() },
        },
      )
      console.log('Category updated:', response.data)
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
      console.log(`Deleting category with ID: ${id}`)
      const response = await apiClient.delete(`/categories/${id}`, {
        headers: { ...getAuthHeaders() },
      })
      console.log('Category deleted:', response.status)
      return response.data
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
