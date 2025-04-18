<template>
  <div class="min-h-screen bg-gray-50">
    <nav
      :class="[
        'sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow',
        isScrolled ? 'shadow-sm' : '',
      ]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Mobile Toggle -->
          <div class="flex items-center gap-2">
            <button
              v-if="isMobile"
              @click="isOpen = !isOpen"
              class="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <component :is="isOpen ? XIcon : MenuIcon" class="h-5 w-5" />
            </button>
            <RouterLink to="/articles" class="flex items-center gap-2 py-2 text-gray-900">
              <GlobeIcon class="h-6 w-6" />
              <span class="text-lg font-semibold">Traveling</span>
            </RouterLink>
          </div>

          <!-- Desktop Nav -->
          <div class="hidden md:flex md:items-center md:gap-2">
            <div class="flex items-center gap-1">
              <RouterLink
                v-for="link in navLinks"
                :key="link.path"
                :to="link.path"
                :class="[
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                  route.path === link.path
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                ]"
              >
                <component :is="link.icon" class="h-4 w-4" />
                {{ link.label }}
              </RouterLink>
            </div>
            <div class="w-px h-6 mx-2 bg-gray-200" />
            <button
              @click="isLogoutModalOpen = true"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <LogOutIcon class="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div
        :class="[
          'md:hidden transition-all duration-300 overflow-hidden',
          isOpen ? 'max-h-96 border-t border-gray-200' : 'max-h-0',
        ]"
      >
        <div class="px-4 py-3 space-y-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
              route.path === link.path
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ]"
          >
            <component :is="link.icon" class="h-4 w-4" />
            {{ link.label }}
          </RouterLink>
          <button
            @click="isLogoutModalOpen = true"
            class="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <LogOutIcon class="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>

    <ConfirmationModal
      title="Log Out"
      message="Are you sure you want to Log Out? This action cannot be undone."
      :is-open="isLogoutModalOpen"
      @confirm="handleLogoutConfirm"
      @close="isLogoutModalOpen = false"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  LogOutIcon,
  FileTextIcon,
  GridIcon,
  UserIcon,
  GlobeIcon,
  MenuIcon,
  XIcon,
} from 'lucide-vue-next'
import ConfirmationModal from './ConfirmationModal.vue'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const isOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)
const isScrolled = ref(false)
const isLogoutModalOpen = ref(false)

const navLinks = [
  { path: '/articles', label: 'Articles', icon: FileTextIcon },
  { path: '/category', label: 'Category', icon: GridIcon },
  { path: '/profile', label: 'Profile', icon: UserIcon },
]

const handleLogoutConfirm = () => {
  useAuthStore().logout()
  router.push('/')
}

onMounted(() => {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
    if (!isMobile.value) isOpen.value = false
  })
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 0
  })
})
</script>

<style scoped>
main {
  transition: all 0.3s ease;
}
</style>
