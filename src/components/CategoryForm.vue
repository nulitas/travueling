<template>
  <form @submit.prevent="onSubmitForm" class="space-y-4">
    <div class="space-y-2">
      <label for="name" class="block text-sm font-medium text-gray-700">Category Name</label>
      <input
        id="name"
        type="text"
        v-model="name"
        placeholder="Enter category name"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400"
        :disabled="isSubmitting"
      />
    </div>

    <div class="flex items-center gap-3">
      <button
        type="submit"
        class="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSubmitting || !name.trim()"
      >
        <div v-if="isSubmitting" class="flex items-center justify-center gap-2">
          <Loader2 class="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </div>
        <span v-else>{{ initialData ? 'Update' : 'Create' }} Category</span>
      </button>

      <button
        v-if="onCancel"
        type="button"
        class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        @click="onCancel()"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import type { Category } from '@/types/category'

const props = defineProps<{
  initialData?: Category
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', name: string): void
  (e: 'cancel'): void
}>()

const name = ref(props.initialData?.name || '')

watch(
  () => props.initialData,
  (newVal) => {
    name.value = newVal?.name || ''
  },
)

const onSubmitForm = () => {
  emit('submit', name.value)
}

const onCancel = () => {
  emit('cancel')
}
</script>
