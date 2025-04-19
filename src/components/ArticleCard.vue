<template>
  <div
    class="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
  >
    <div v-if="article.cover_image_url" class="aspect-video relative overflow-hidden">
      <img
        :src="imageUrl"
        :alt="article.title"
        @error="onImageError"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
    </div>
    <div v-else class="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
      No Image Available
    </div>

    <div class="p-4">
      <h2
        class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-600 transition-colors"
      >
        {{ article.title }}
      </h2>
      <p class="text-sm text-slate-600 mb-2 font-medium">
        {{ article.category?.name || 'Uncategorized' }}
      </p>
      <p class="text-sm text-gray-600 line-clamp-3">
        {{ article.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { Article } from '@/types/article'

const props = defineProps<{
  article: Article
}>()

const imageUrl = ref(props.article.cover_image_url || '/placeholder.svg')

console.log('Article category data:', {
  articleId: props.article.id,
  categoryData: props.article.category,
})
const onImageError = () => {
  imageUrl.value = '/no-image.png'
}
</script>
