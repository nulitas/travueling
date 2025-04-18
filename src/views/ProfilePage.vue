<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8 text-center">
      <div
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 border-2 border-white shadow-sm mb-4"
      >
        <span class="text-2xl font-medium text-gray-600">
          {{ user?.username?.charAt(0).toUpperCase() }}
        </span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">{{ user?.username }}</h1>
      <p class="text-sm text-gray-500 mt-1">
        Member since {{ new Date(user?.createdAt).getFullYear() }}
      </p>
    </div>

    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8" aria-label="Profile sections">
        <button
          @click="activeTab = 'info'"
          :class="[
            'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm',
            activeTab === 'info'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <UserIcon class="w-4 h-4" />
          Profile Information
        </button>
        <button
          @click="activeTab = 'comments'"
          :class="[
            'py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm',
            activeTab === 'comments'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <MessageSquare class="w-4 h-4" />
          Comments
        </button>
      </nav>
    </div>

    <div class="min-h-[400px]">
      <DetailProfile v-if="activeTab === 'info'" :user="user" />
      <!-- <CommentedArticle v-else :user="user" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { UserIcon, MessageSquare } from 'lucide-vue-next'
import DetailProfile from '@/components/ProfileDetail.vue'
// import CommentedArticle from '@/components/ProfileComment.vue'

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const activeTab = ref<'info' | 'comments'>('info')

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchCurrentUser()
  }
})
</script>
