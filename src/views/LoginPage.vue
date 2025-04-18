<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 mb-4">
          <Globe class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p class="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div class="p-6 sm:p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email -->
            <div class="space-y-2">
              <label for="identifier" class="text-sm font-medium text-gray-900">
                Email address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="identifier"
                  type="email"
                  v-model="identifier"
                  required
                  :disabled="isLoading"
                  placeholder="name@example.com"
                  class="block w-full pl-10 pr-3 py-2.5 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-gray-900">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
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
                  <component
                    :is="showPassword ? EyeOff : Eye"
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  />
                  <span class="sr-only">
                    {{ showPassword ? 'Hide password' : 'Show password' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <template v-if="isLoading">
                <Loader2 class="h-5 w-5 animate-spin" />
                Signing in...
              </template>
              <template v-else>Sign in</template>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-6 text-center">
            <RouterLink to="/register" class="text-sm text-gray-600 hover:text-gray-900">
              Don't have an account?
              <span class="font-semibold">Create one</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Loader2, Eye, EyeOff, Globe } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/authStore'
import { useLogin } from '@/composables/useLogin'

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)

const router = useRouter()
const authStore = useAuthStore()
const { login, isLoading } = useLogin()

onMounted(() => {
  if (authStore.isAuthenticated || localStorage.getItem('authToken')) {
    router.push('/articles')
  }
})

const handleSubmit = async () => {
  try {
    const userData = await login({ identifier: identifier.value, password: password.value })
    authStore.setCredentials(userData)
    identifier.value = ''
    password.value = ''
    router.push('/articles')
  } catch (err: unknown) {
    console.error('Login failed:', err)
    alert('Login failed. Please check your credentials and try again.')
  }
}
</script>
