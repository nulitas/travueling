<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Articles</h1>
          <p class="mt-1 text-sm text-gray-500">Discover and read interesting articles</p>
        </div>
        <RouterLink
          to="/articles/manage"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
        >
          <Settings class="w-4 h-4 mr-2" />
          Manage
        </RouterLink>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-xl border border-gray-200 mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search articles..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm placeholder:text-gray-400"
              />
            </div>
          </div>
          <div class="sm:w-64">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter class="h-4 w-4 text-gray-400" />
              </div>
              <select
                v-model="selectedCategory"
                class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option :value="null">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Articles Grid -->
      <div
        v-if="filteredArticles.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" />
      </div>
      <div v-else class="text-center py-12">
        <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-sm font-medium text-gray-900">No articles found</h3>
        <p class="mt-2 text-sm text-gray-500">
          {{
            searchQuery
              ? 'Try adjusting your search or filters'
              : 'No articles available for the selected category'
          }}
        </p>
      </div>

      <!-- Loading More -->
      <div ref="observerTarget" class="py-8 text-center">
        <div v-if="isFetching" class="flex flex-col items-center justify-center min-h-[400px]">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p class="text-sm text-gray-500">Loading more articles...</p>
        </div>
        <p v-else-if="!hasMore && articles.length > 0" class="text-sm text-gray-500">
          You've reached the end
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useArticles } from '@/composables/useArticles'
import { useCategoryApi } from '@/services/categoryApi'
import ArticleCard from '@/components/ArticleCard.vue'
import { Search, Filter, BookOpen, Settings } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const observerTarget = ref<HTMLElement | null>(null)

const { categories } = useCategoryApi()

const { articles, loadMore, hasMore, isFetching } = useArticles(selectedCategory)

const filteredArticles = computed(() => {
  return articles.value.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  console.log('categories:', categories.value)
  console.log('articles:', articles.value)

  if (observerTarget.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching.value && hasMore.value) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '200px' },
    )
    observer.observe(observerTarget.value)
  }
})

onBeforeUnmount(() => {
  if (observer && observerTarget.value) {
    observer.unobserve(observerTarget.value)
  }
})
</script>

<style scoped></style>
