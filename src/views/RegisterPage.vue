<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 mb-4">
          <Globe class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Create an account</h1>
        <p class="mt-2 text-sm text-gray-600">Join us and start sharing your travel experiences</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div class="p-6 sm:p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Username -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="formData.username"
                type="text"
                required
                :disabled="isLoading"
                placeholder="johndoe"
                class="block w-full pl-10 pr-3 py-2.5 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
              />
            </div>
            <!-- Email -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-900">Email address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  :disabled="isLoading"
                  placeholder="name@example.com"
                  class="block w-full pl-10 pr-3 py-2.5 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-900">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  :disabled="isLoading"
                  placeholder="******"
                  class="block w-full pl-10 pr-12 py-2.5 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeOff v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  <Eye v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  <span class="sr-only">{{
                    showPassword ? 'Hide password' : 'Show password'
                  }}</span>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="isLoading" class="submit-button">
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-6 text-center">
            <RouterLink to="/login" class="text-sm text-gray-600 hover:text-gray-900">
              Already have an account? <span class="font-semibold">Sign in</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, User, Eye, EyeOff, Globe, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const authStore = useAuthStore()
const { register, isLoading, error } = useAuth()

const formData = reactive({
  username: '',
  email: '',
  password: '',
})

const showPassword = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/articles')
  }
})

const handleSubmit = async () => {
  try {
    await register(formData)
    router.push('/articles')
    alert('Registration successful!')
  } catch {
    alert(error.value?.message || 'Registration failed. Please try again.')
  }
}
</script>
