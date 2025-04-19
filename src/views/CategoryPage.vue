<template>
  <div class="max-w-3xl mx-auto p-4">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
      <button
        v-if="!editingCategory && !isCreating"
        @click="isCreating = true"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
      >
        <Plus class="w-4 h-4 mr-2" />
        New Category
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>

    <div v-else-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg">
      <p class="font-medium">Error loading categories</p>
      <p class="text-sm mt-1">{{ getErrorMessage(error) }}</p>
    </div>

    <div v-else-if="isCreating || editingCategory">
      <CategoryForm
        :initialData="editingCategory"
        :isSubmitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="resetForm"
      />
    </div>

    <div v-else>
      <div v-if="categories.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-medium text-gray-900">No categories yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new category</p>
        <button
          @click="isCreating = true"
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Plus class="w-4 h-4 mr-2" />
          Create Category
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="category in categories"
          :key="category.documentId || category.id"
          class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
        >
          <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
          <div class="flex gap-2">
            <button
              @click="editCategory(category)"
              class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="confirmDelete(category)"
              :disabled="isDeleting"
              class="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
            >
              <Loader2
                v-if="isDeleting && isCategoryBeingDeleted(category)"
                class="w-4 h-4 animate-spin"
              />
              <Trash2 v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryApi } from '@/composables/useCategoryApi'
import CategoryForm from '@/components/CategoryForm.vue'
import type { Category } from '@/types/category'
import axios from 'axios'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-vue-next'

const {
  categories,
  isLoading,
  error,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategoryApi()

const isCreating = ref(false)
const editingCategory = ref<Category | undefined>()
const isSubmitting = ref(false)
const isDeleting = ref(false)
const deletingCategoryId = ref<string | null>(null)
const apiError = ref<string | null>(null)

onMounted(async () => {
  try {
    await getCategories()
  } catch (err) {
    handleError(err, 'Failed to load categories:')
  }
})

const handleSubmit = async (name: string) => {
  isSubmitting.value = true
  apiError.value = null

  try {
    if (editingCategory.value) {
      const id = getCategoryId(editingCategory.value)

      await updateCategory({
        id,
        data: { name },
      })
    } else {
      await createCategory({
        name,
      })
    }
    await getCategories()
    resetForm()
  } catch (err) {
    handleError(err, 'Operation failed:')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (category: Category) => {
  if (!window.confirm(`Delete category "${category.name}"?`)) return

  isDeleting.value = true
  apiError.value = null
  const id = getCategoryId(category)
  deletingCategoryId.value = id

  try {
    await deleteCategory(id)
    await getCategories()
  } catch (err) {
    handleError(err, 'Delete failed:')
  } finally {
    isDeleting.value = false
    deletingCategoryId.value = null
  }
}

const getCategoryId = (category: Category): string => category.documentId || category.id.toString()

const isCategoryBeingDeleted = (category: Category) =>
  deletingCategoryId.value === getCategoryId(category)

const editCategory = (category: Category) => {
  editingCategory.value = category
}

const resetForm = () => {
  isCreating.value = false
  editingCategory.value = undefined
  apiError.value = null
}

const handleError = (err: unknown, context: string) => {
  console.error(context, err)
  if (axios.isAxiosError(err)) {
    apiError.value = getErrorMessage(err)
  }
}

const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) return 'Authentication required'
    if (err.response?.data?.error?.message) return err.response.data.error.message
    return err.message
  }
  return err instanceof Error ? err.message : 'Unknown error occurred'
}
</script>
