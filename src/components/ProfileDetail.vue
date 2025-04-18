<template>
  <div class="space-y-6">
    <div class="grid gap-6 md:grid-cols-2">
      <div
        v-for="(info, index) in userInfo"
        :key="index"
        class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start gap-4">
          <div class="p-2 bg-gray-100 rounded-lg">
            <component :is="info.icon" class="w-5 h-5 text-gray-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-500">{{ info.label }}</p>
            <div v-if="info.status" class="mt-1">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800',
                ]"
              >
                <span
                  :class="[
                    'w-1.5 h-1.5 mr-1.5 rounded-full',
                    user.blocked ? 'bg-red-400' : 'bg-green-400',
                  ]"
                />
                {{ info.value }}
              </span>
            </div>
            <p v-else class="mt-1 text-sm font-medium text-gray-900 truncate">
              {{ info.value }}
            </p>
          </div>
          <button
            v-if="info.copyable"
            @click="copyToClipboard(info.value)"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span class="sr-only">Copy {{ info.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types/auth'
import { Calendar, Mail, Shield, Clock } from 'lucide-vue-next'

const props = defineProps<{
  user: User
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const userInfo = computed(() => {
  if (!props.user) return []

  return [
    {
      label: 'Email',
      value: props.user.email,
      icon: Mail,
      copyable: true,
    },
    {
      label: 'Joined',
      value: formatDate(props.user.createdAt),
      icon: Calendar,
    },
    {
      label: 'Last Updated',
      value: formatDate(props.user.updatedAt),
      icon: Clock,
    },
    {
      label: 'Account Status',
      value: props.user.blocked ? 'Blocked' : 'Active',
      icon: Shield,
      status: true,
    },
  ]
})

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>
