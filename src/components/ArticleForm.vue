<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Cover Image URL -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Cover Image</label>
      <input
        type="url"
        v-model="formData.cover_image_url"
        placeholder="https://example.com/image.jpg"
        class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
      />
    </div>

    <!-- Title -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        v-model="formData.title"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
      />
    </div>

    <!-- Description -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="formData.description"
        rows="4"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
      />
    </div>

    <!-- Category -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Category</label>
      <select
        v-model="formData.category"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
      >
        <option :value="null">No Category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4 pt-4">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div v-if="isSubmitting" class="flex items-center justify-center gap-2">
          <span class="animate-spin w-4 h-4 border-b-2 border-white rounded-full"></span>
          <span>Saving...</span>
        </div>
        <span v-else>{{ submitLabel }}</span>
      </button>
      <button
        v-if="onCancel"
        type="button"
        @click="onCancel"
        class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { ArticleFormData } from '@/types/article'

import type { Article } from '@/types/article'
import type { Category } from '@/types/category'

const props = defineProps<{
  initialData?: Article
  categories: Category[]
  onSubmit: (formData: ArticleFormData) => Promise<void>
  isSubmitting: boolean
  submitLabel: string
  onCancel?: () => void
}>()

const formData = reactive<ArticleFormData>({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  cover_image_url: props.initialData?.cover_image_url || '',
  category: props.initialData?.category?.id || null,
})

const handleSubmit = async () => {
  await props.onSubmit({ ...formData })
}
</script>
