<template>
  <div ref="page" class="min-h-screen bg-[#050505] text-white relative font-sans selection:bg-blue-500/30 selection:text-blue-200" :class="resolvedTheme === 'light' ? 'theme-light' : 'theme-dark'">
    
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-5 backdrop-blur-md bg-[#050505]/50 border-b border-white/5 transition-all duration-300">
      <div class="text-base sm:text-lg font-bold tracking-tighter font-serif-sc">{{ t('brand.name') }}</div>
      <div class="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <a href="#" class="hover:text-white transition-colors">{{ t('nav.home') }}</a>
        <a href="#" class="hover:text-white transition-colors">{{ t('nav.blog') }}</a>
        <a href="#" class="hover:text-white transition-colors">{{ t('nav.about') }}</a>
      </div>
      
      <div class="flex items-center gap-4">
        <button
          @click="cycleTheme"
          class="p-2 text-gray-500 hover:text-white transition-colors"
          :title="t('nav.theme')"
        >
          <component :is="themeIcon" class="w-4 h-4" />
        </button>
        <button
          @click="toggleLocale"
          class="px-3 py-1.5 text-xs font-semibold border border-white/10 text-gray-300 rounded-full hover:text-white hover:border-white/30 transition-colors"
          :title="t('nav.language')"
        >
          {{ localeNames[currentLocale] }}
        </button>
        <button 
          @click="showConnectModal = true"
          class="px-4 py-1.5 text-xs font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
        >
          {{ t('nav.connect') }}
        </button>
        
        <!-- Admin Entry -->
        <button 
          v-if="!isLoggedIn"
          @click="showLoginModal = true"
          class="p-2 text-gray-500 hover:text-white transition-colors"
          :title="t('nav.adminLogin')"
        >
          <Lock class="w-4 h-4" />
        </button>
        <div v-else class="flex items-center gap-2">
          <button 
            @click="isEditingProfile = !isEditingProfile"
            class="text-xs text-blue-400 hover:text-blue-300"
          >
            {{ isEditingProfile ? t('nav.viewMode') : t('nav.editProfile') }}
          </button>
          <button 
            @click="logout"
            class="p-2 text-gray-500 hover:text-red-400 transition-colors"
            :title="t('nav.logout')"
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
    <section class="relative z-20 px-3 sm:px-4 md:px-8 pb-16 sm:pb-32 max-w-7xl mx-auto -mt-10 sm:-mt-20">
      
      <!-- 2. Control Center (Admin) -->
      <div class="flex justify-center mb-8 sm:mb-16" v-if="isLoggedIn">
        <ActionToolbar 
          @upload="showUploadModal = true" 
          @write="showWriteModal = true"
          @portfolio="showPortfolioModal = true"
        />
      </div>

      <!-- 3. Content Tabs -->
      <div class="flex justify-center mb-8 sm:mb-12">
        <div class="flex items-center bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/5">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id"
            class="relative px-4 sm:px-8 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 z-10"
            :class="currentTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-white'"
          >
            <span v-if="currentTab === tab.id" class="absolute inset-0 bg-white rounded-full shadow-lg -z-10" layoutId="activeTab"></span>
            {{ t(tab.labelKey) }}
          </button>
        </div>
      </div>

      <!-- 4. Dynamic Content Area -->
      <div class="min-h-[400px]">
        <Transition name="fade" mode="out-in">
          <BlogList 
            v-if="currentTab === 'blog'" 
            ref="blogListRef"
            :key="blogListKey" 
            :is-editing="isEditingProfile"
          />
          <PortfolioGrid
            v-else-if="currentTab === 'portfolio'"
            ref="portfolioGridRef"
            :key="portfolioListKey"
            :is-editing="isEditingProfile"
          />
          <MediaGallery 
            v-else-if="currentTab === 'gallery'"
            :items="galleryItems" 
            :is-editing="isEditingProfile"
            @delete-success="fetchGallery"
          />
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

    <!-- Portfolio Modal -->
    <PortfolioModal
      :is-open="showPortfolioModal"
      @close="showPortfolioModal = false"
      @success="handlePortfolioSuccess"
    />

    <!-- Connect/WeChat Modal -->
    <WechatModal
      :is-open="showConnectModal"
      :qr-code-url="wechatQrCode"
      :is-editing="false"
      @close="showConnectModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useMouse } from '@vueuse/core'
import { authApi, galleryApi, type Article, type GalleryItem, type PortfolioItem } from './api'
import { Lock, LogOut, Monitor, Moon, Sun } from 'lucide-vue-next'

import HeroSection from './components/HeroSection.vue'
import ActionToolbar from './components/ActionToolbar.vue'
import BlogList from './components/BlogList.vue'
import MediaGallery from './components/MediaGallery.vue'
import PortfolioGrid from './components/PortfolioGrid.vue'
import LoginModal from './components/LoginModal.vue'
import UploadModal from './components/UploadModal.vue'
import WriteArticleModal from './components/WriteArticleModal.vue'
import PortfolioModal from './components/PortfolioModal.vue'
import ParticleEffect from './components/ParticleEffect.vue'
import WechatModal from './components/WechatModal.vue'
import { userApi } from './api'
import { currentLocale, initLocale, localeNames, t, toggleLocale } from './i18n'
import { cycleTheme, initTheme, resolvedTheme, themePreference } from './theme'

// Auth State
const isLoggedIn = ref(false)
const showLoginModal = ref(false)
const showUploadModal = ref(false)
const showWriteModal = ref(false)
const showPortfolioModal = ref(false)
const showConnectModal = ref(false)
const isEditingProfile = ref(false)
const wechatQrCode = ref(localStorage.getItem('blog_wechat_qr') || '')
const themeIcon = computed(() => {
  if (themePreference.value === 'system') return Monitor
  return resolvedTheme.value === 'dark' ? Moon : Sun
})

const handleLoginSuccess = () => {
  isLoggedIn.value = true
  // Enable edit mode automatically on login -> DISABLED to prevent accidental edits
  // isEditingProfile.value = true
}

const handleArticleSuccess = async (article: Article) => {
  // Switch to blog tab to see the new article
  currentTab.value = 'blog'
  await nextTick()
  if (blogListRef.value) {
    blogListRef.value.prependArticle(article)
  } else {
    refreshBlogList()
  }
}

const handlePortfolioSuccess = async (item: PortfolioItem) => {
  currentTab.value = 'portfolio'
  await nextTick()
  if (portfolioGridRef.value) {
    portfolioGridRef.value.prependItem(item)
  } else {
    refreshPortfolioList()
  }
}

const blogListKey = ref(0)
const blogListRef = ref<InstanceType<typeof BlogList> | null>(null)
const portfolioListKey = ref(0)
const portfolioGridRef = ref<InstanceType<typeof PortfolioGrid> | null>(null)
const refreshBlogList = () => {
  blogListKey.value++
}
const refreshPortfolioList = () => {
  portfolioListKey.value++
}

const logout = async () => {
  await authApi.logout()
  isLoggedIn.value = false
  isEditingProfile.value = false
}

// Tab State
const tabs = [
  { id: 'blog', labelKey: 'nav.blog' },
  { id: 'portfolio', labelKey: 'nav.portfolio' },
  { id: 'gallery', labelKey: 'nav.gallery' }
]
const currentTab = ref('blog')

// Gallery Data
const galleryItems = ref<GalleryItem[]>([])

const fetchGallery = async () => {
  try {
    const { data } = await galleryApi.getAll()
    galleryItems.value = data || []
  } catch (e) {
    console.error('Failed to fetch gallery', e)
  }
}

// Cursor Glow
const { x, y } = useMouse()
const cursorStyle = computed(() => ({
  background: `radial-gradient(800px circle at ${x.value}px ${y.value}px, rgba(56, 189, 248, 0.08), transparent 40%)`
}))

onMounted(async () => {
  initTheme()
  initLocale()
  const currentUser = await authApi.getCurrentUser()
  isLoggedIn.value = !!currentUser

  fetchGallery()
  
  // Fetch WeChat QR code if not in cache
  if (!wechatQrCode.value) {
    try {
      const { data } = await userApi.getProfile('admin')
      if (data.wechatQrCode) {
        wechatQrCode.value = data.wechatQrCode
        localStorage.setItem('blog_wechat_qr', data.wechatQrCode)
      }
    } catch (e) {
      console.error('Failed to fetch wechat QR code', e)
    }
  }
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

