<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded shadow-lg p-6 max-w-sm w-full">
      <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button class="px-4 py-2 rounded border border-gray-300" @click="$emit('close')">
          Cancel
        </button>
        <button class="px-4 py-2 rounded text-white bg-gray-900" @click="$emit('confirm')">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title?: string
  message?: string
}>()

defineEmits(['close', 'confirm'])
</script>
