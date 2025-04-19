<template>
  <div class="max-w-3xl mx-auto p-4">
    <div class="flex justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Your Articles</h1>
      <button @click="isCreating = true" class="btn btn-primary">+ New Article</button>
    </div>

    <ArticleForm
      v-if="isCreating || editingArticle"
      :initial-data="editingArticle || undefined"
      :categories="categoryApi.categories?.value || []"
      :is-submitting="articleApi.loading.value"
      :submit-label="isCreating ? 'Create Article' : 'Save Changes'"
      @submit="handleSubmit"
      @cancel="
        () => {
          isCreating = false
          editingArticle = null
        }
      "
    />

    <template v-else>
      <div v-if="articleStore.articles.length === 0" class="text-center py-12">
        <p>No articles found</p>
        <button class="btn btn-outline" @click="isCreating = true">Create Article</button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="article in articleStore.articles"
          :key="article.id"
          class="p-4 bg-white rounded shadow"
        >
          <div class="flex justify-between">
            <div>
              <h3 class="font-semibold">{{ article.title }}</h3>
              <p class="text-sm text-gray-600">{{ article.description }}</p>
              <p class="text-xs text-gray-400">
                Last updated: {{ new Date(article.updatedAt).toLocaleDateString() }}
              </p>
            </div>
            <div class="space-x-2">
              <button @click="editingArticle = article">Edit</button>
              <button @click="handleDeleteArticle(article)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticleApi } from '@/composables/useArticleApi'
import { useArticleStore } from '@/store/articleStore'
import { useAuthStore } from '@/store/authStore'
import { useCategoryApi } from '@/composables/useCategoryApi'
import ArticleForm from '@/components/ArticleForm.vue'
import type { Article, ArticleFormData } from '@/types/article'

const articleStore = useArticleStore()
const userStore = useAuthStore()
const categoryApi = useCategoryApi()
const articleApi = useArticleApi()

const page = ref(1)
const pageSize = ref(3)
const isCreating = ref(false)
const editingArticle = ref<Article | null>(null)

const fetchArticles = async () => {
  await articleStore.fetchArticles({
    page: page.value,
    pageSize: pageSize.value,
    userId: userStore.user?.id,
  })
}

onMounted(async () => {
  await fetchArticles()
  await categoryApi.getCategories()
})

const handleSubmit = async (formData: ArticleFormData) => {
  if (isCreating.value) {
    await handleCreateArticle(formData)
  } else {
    await handleUpdateArticle(formData)
  }
}

const handleCreateArticle = async (formData: ArticleFormData) => {
  try {
    await articleApi.createArticle({ data: formData })
    alert('Article created successfully')
    isCreating.value = false
    await fetchArticles()
  } catch {
    alert('Failed to create article')
  }
}

const handleUpdateArticle = async (formData: ArticleFormData) => {
  if (!editingArticle.value) return
  try {
    await articleApi.updateArticle({
      id: editingArticle.value.documentId,
      data: formData,
    })
    alert('Article updated successfully')
    editingArticle.value = null
    await fetchArticles()
  } catch (err) {
    console.error('Update error:', err)
    alert('Failed to update article')
  }
}

const handleDeleteArticle = async (article: Article) => {
  const confirmed = confirm(`Delete article "${article.title}"?`)
  if (!confirmed) return
  try {
    await articleApi.deleteArticle(article.id.toString())
    alert('Article deleted')
    await fetchArticles()
  } catch {
    alert('Failed to delete article')
  }
}
</script>
