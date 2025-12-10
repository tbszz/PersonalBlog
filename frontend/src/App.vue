<template>
  <div ref="page" class="min-h-screen bg-[#050505] text-white relative font-sans selection:bg-blue-500/30 selection:text-blue-200">
    
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-md bg-[#050505]/50 border-b border-white/5 transition-all duration-300">
      <div class="text-lg font-bold tracking-tighter font-serif-sc">邹子</div>
      <div class="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <a href="#" class="hover:text-white transition-colors">Home</a>
        <a href="#" class="hover:text-white transition-colors">Blog</a>
        <a href="#" class="hover:text-white transition-colors">About</a>
      </div>
      
      <div class="flex items-center gap-4">
        <button class="px-4 py-1.5 text-xs font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
          Connect
        </button>
        
        <!-- Admin Entry -->
        <button 
          v-if="!isLoggedIn"
          @click="showLoginModal = true"
          class="p-2 text-gray-500 hover:text-white transition-colors"
          title="Admin Login"
        >
          <Lock class="w-4 h-4" />
        </button>
        <div v-else class="flex items-center gap-2">
          <button 
            @click="isEditingProfile = !isEditingProfile"
            class="text-xs text-blue-400 hover:text-blue-300"
          >
            {{ isEditingProfile ? 'View Mode' : 'Edit Profile' }}
          </button>
          <button 
            @click="logout"
            class="p-2 text-gray-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>

    <!-- 1. Hero Section -->
    <HeroSection 
      :is-editing="isEditingProfile" 
      @update-profile="isEditingProfile = false"
    />

    <!-- Main Content -->
    <section class="relative z-20 px-4 md:px-8 pb-32 max-w-7xl mx-auto -mt-20">
      
      <!-- 2. Control Center (Admin) -->
      <div class="flex justify-center mb-16" v-if="isLoggedIn">
        <ActionToolbar 
          @upload="showUploadModal = true" 
          @write="showWriteModal = true"
        />
      </div>

      <!-- 3. Content Tabs -->
      <div class="flex justify-center mb-12">
        <div class="flex items-center bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/5">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id"
            class="relative px-8 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10"
            :class="currentTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-white'"
          >
            <span v-if="currentTab === tab.id" class="absolute inset-0 bg-white rounded-full shadow-lg -z-10" layoutId="activeTab"></span>
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 4. Dynamic Content Area -->
      <div class="min-h-[400px]">
        <Transition name="fade" mode="out-in">
          <BlogList 
            v-if="currentTab === 'blog'" 
            :key="blogListKey" 
            :is-editing="isEditingProfile"
          />
          <MediaGallery v-else :items="galleryItems" />
        </Transition>
      </div>

    </section>

    <!-- Custom Cursor Glow -->
    <div class="cursor-glow pointer-events-none fixed inset-0 z-0 opacity-40" :style="cursorStyle"></div>
    
    <!-- Particles -->
    <ParticleEffect />

    <!-- Login Modal -->
    <LoginModal 
      :is-open="showLoginModal" 
      @close="showLoginModal = false" 
      @login-success="handleLoginSuccess"
    />

    <!-- Upload Modal -->
    <UploadModal
      :is-open="showUploadModal"
      @close="showUploadModal = false"
      @upload-success="fetchGallery"
    />

    <!-- Write Article Modal -->
    <WriteArticleModal
      :is-open="showWriteModal"
      @close="showWriteModal = false"
      @success="handleArticleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMouse } from '@vueuse/core'
import { galleryApi, type GalleryItem } from './api'
import { Lock, LogOut } from 'lucide-vue-next'

import HeroSection from './components/HeroSection.vue'
import ActionToolbar from './components/ActionToolbar.vue'
import BlogList from './components/BlogList.vue'
import MediaGallery from './components/MediaGallery.vue'
import LoginModal from './components/LoginModal.vue'
import UploadModal from './components/UploadModal.vue'
import WriteArticleModal from './components/WriteArticleModal.vue'
import ParticleEffect from './components/ParticleEffect.vue'

// Auth State
const isLoggedIn = ref(false)
const showLoginModal = ref(false)
const showUploadModal = ref(false)
const showWriteModal = ref(false)
const isEditingProfile = ref(false)

const handleLoginSuccess = () => {
  isLoggedIn.value = true
  // Enable edit mode automatically on login
  isEditingProfile.value = true
}

const handleArticleSuccess = () => {
  // Switch to blog tab to see the new article
  currentTab.value = 'blog'
  // Force reload of blog list component or notify it to refresh
  // For now, simpler to just trigger a refresh if we had a global store or event bus
  // But since BlogList fetches on mount, toggling it might work, or we can use a key
  refreshBlogList()
}

const blogListKey = ref(0)
const refreshBlogList = () => {
  blogListKey.value++
}

const logout = () => {
  isLoggedIn.value = false
  isEditingProfile.value = false
  localStorage.removeItem('user')
}

// Check local storage on mount
onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    isLoggedIn.value = true
  }
})

// Tab State
const tabs = [
  { id: 'blog', label: '文章列表' },
  { id: 'gallery', label: 'Album' }
]
const currentTab = ref('blog')

// Gallery Data
const galleryItems = ref<GalleryItem[]>([])

const fetchGallery = async () => {
  try {
    const { data } = await galleryApi.getAll()
    if (data && data.length > 0) {
      galleryItems.value = data
    } else {
      galleryItems.value = [
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1701633512398-333f26ec89d6?w=800&q=80', description: 'Cyberpunk aesthetic photography', createdAt: new Date().toISOString() },
        { id: 2, type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4', thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80', description: 'Cinematic drone footage', createdAt: new Date().toISOString() },
        { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80', description: 'High contrast monochrome', createdAt: new Date().toISOString() },
        { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1695653422715-991525631913?w=800&q=80', description: 'Architectural details', createdAt: new Date().toISOString() },
        { id: 5, type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4', thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', description: 'Nature calm vibes', createdAt: new Date().toISOString() },
        { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1701198548170-c750b3f03b22?w=800&q=80', description: 'Street photography', createdAt: new Date().toISOString() },
      ]
    }
  } catch (e) {
    console.error('Failed to fetch gallery', e)
  }
}

// Cursor Glow
const { x, y } = useMouse()
const cursorStyle = computed(() => ({
  background: `radial-gradient(800px circle at ${x.value}px ${y.value}px, rgba(56, 189, 248, 0.08), transparent 40%)`
}))

onMounted(() => {
  fetchGallery()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

