<template>
  <section class="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-3 sm:px-4 pt-20 sm:pt-24 pb-8">
    <!-- Parallax Container -->
    <div class="relative z-10 w-full max-w-5xl" :style="parallaxStyle">
      
      <!-- Expanded Profile Card -->
      <div class="relative group">
        <!-- Glassmorphism Card Background -->
        <div class="relative z-10 backdrop-blur-xl bg-[#0a0a0a]/60 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12 flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-16 items-center md:items-start transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.03)] overflow-hidden">
          
          <!-- Left Column: Avatar & Stats -->
          <div class="flex flex-col items-center md:items-start gap-4 sm:gap-6 w-full md:w-auto flex-shrink-0">
            <!-- Avatar Ring -->
            <div class="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-white/20 to-transparent mx-auto md:mx-0">
              <div 
                class="w-full h-full rounded-full overflow-hidden bg-black/50 relative group/avatar cursor-pointer"
                @click="triggerAvatarUpload"
              >
                 <!-- Show loading placeholder while image is loading -->
                 <div v-if="avatarLoading || !avatarUrl" class="w-full h-full flex items-center justify-center bg-white/5">
                   <div v-if="avatarLoading" class="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                   <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                      <!-- Default placeholder if no avatar -->
                      <div class="w-full h-full bg-white/10 flex items-center justify-center">
                        <span class="text-4xl text-white/20 font-serif-sc">?</span>
                      </div>
                   </div>
                 </div>
                 <img 
                   v-show="!avatarLoading && avatarUrl"
                   :src="isEditing ? editForm.avatar : avatarUrl" 
                   alt="Avatar" 
                   class="w-full h-full object-cover transition-all duration-700 group-hover/avatar:scale-110"
                   @load="onAvatarLoad"
                   @error="onAvatarError"
                 />
                 <!-- Avatar Glow / Edit Overlay -->
                 <div class="absolute inset-0 bg-blue-500/20 mix-blend-overlay opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <div v-if="isEditing" class="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                     <UploadCloud class="w-5 h-5 text-white" />
                   </div>
                 </div>
                 
                 <!-- Hidden File Input -->
                 <input 
                   ref="avatarInput"
                   type="file" 
                   accept="image/*" 
                   class="hidden" 
                   @change="handleAvatarChange"
                 />
              </div>
            </div>

            <!-- Stats -->
            <div class="flex gap-3 sm:gap-6 w-full justify-center md:justify-between px-0 sm:px-2">
               <div class="text-center w-16 sm:w-20"> <!-- Added width for input stability -->
                  <div v-if="!isEditing" class="text-lg sm:text-xl font-bold text-white font-serif-sc">{{ profileData.stats.articles }}</div>
                  <input v-else v-model="editForm.stats.articles" class="w-full bg-white/10 border border-white/20 rounded px-1 py-0.5 text-center text-white font-bold text-sm" />
                  <div class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1">{{ t('profile.articles') }}</div>
               </div>
               <div class="w-px h-8 bg-white/10 self-center"></div>
               <div class="text-center w-16 sm:w-20">
                  <div v-if="!isEditing" class="text-lg sm:text-xl font-bold text-white font-serif-sc">{{ profileData.stats.albums }}</div>
                  <input v-else v-model="editForm.stats.albums" class="w-full bg-white/10 border border-white/20 rounded px-1 py-0.5 text-center text-white font-bold text-sm" />
                  <div class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1">{{ t('profile.albums') }}</div>
               </div>
               <div class="w-px h-8 bg-white/10 self-center"></div>
               <div class="text-center w-16 sm:w-20">
                  <div v-if="!isEditing" class="text-lg sm:text-xl font-bold text-white font-serif-sc">{{ profileData.stats.years }}</div>
                  <input v-else v-model="editForm.stats.years" class="w-full bg-white/10 border border-white/20 rounded px-1 py-0.5 text-center text-white font-bold text-sm" />
                  <div class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1">{{ t('profile.years') }}</div>
               </div>
            </div>

            <!-- Social Links -->
            <div class="flex gap-4 mt-2">
               <a 
                 v-for="social in profileData.profile.socials" 
                 :key="social.name" 
                 :href="social.name === 'Wechat' ? 'javascript:void(0)' : social.url" 
                 :aria-label="social.name"
                 :title="social.name"
                 @click="social.name === 'Wechat' ? openWechatModal() : null"
                 class="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white hover:text-black hover:border-white text-gray-400 transition-all duration-300 cursor-pointer"
               >
                  <component :is="getIcon(social.icon)" class="w-4 h-4" />
               </a>
            </div>
          </div>

          <!-- Right Column: Info & Bio -->
          <div class="flex-1 space-y-4 sm:space-y-6 md:space-y-8 text-center md:text-left w-full">
            
            <!-- Header -->
            <div class="space-y-2 sm:space-y-3">
              <div class="flex flex-col md:flex-row items-center md:items-end gap-2 sm:gap-4">
                 <h1 v-if="!isEditing" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-serif-sc tracking-tight">
                    {{ displayProfile.nickname }}
                 </h1>
                 <input v-else v-model="editForm.nickname" class="bg-white/10 border border-white/20 rounded px-2 py-1 text-xl sm:text-2xl w-full md:w-auto text-white text-center md:text-left" />

                 <!-- Small Slogan Badge -->
                 <span v-if="!isEditing" class="px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs font-medium bg-white/10 text-white/80 border border-white/10 font-xingkai text-sm sm:text-lg tracking-wide transform md:-translate-y-1">
                    {{ displayProfile.slogan }}
                 </span>
                 <input v-else v-model="editForm.slogan" class="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white w-full md:w-auto" placeholder="Slogan" />
              </div>
              
              <p v-if="!isEditing" class="text-xs sm:text-sm md:text-base text-gray-400 font-light tracking-wide font-sans">
                 {{ displayProfile.subSlogan }}
              </p>
              <input v-else v-model="editForm.subSlogan" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" placeholder="Sub Slogan" />
            </div>

            <!-- Bio -->
            <div class="space-y-3 sm:space-y-4 relative">
               <div class="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent hidden md:block"></div>
               
               <div v-if="!isEditing" class="space-y-2 sm:space-y-3">
                 <p class="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    <span class="text-blue-400/80 font-mono text-[10px] sm:text-xs mr-1 sm:mr-2">[WHO]</span>
                    {{ displayProfile.bio.who }}
                 </p>
                 <p class="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    <span class="text-purple-400/80 font-mono text-[10px] sm:text-xs mr-1 sm:mr-2">[WHAT]</span>
                    {{ displayProfile.bio.what }}
                 </p>
                 <p class="text-gray-400 italic font-serif leading-relaxed text-xs sm:text-sm">
                    "{{ displayProfile.bio.attitude }}"
                 </p>
               </div>
               <div v-else class="space-y-2">
                 <textarea v-model="editForm.bio.who" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white h-20" placeholder="Who am I"></textarea>
                 <textarea v-model="editForm.bio.what" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white h-20" placeholder="What I do"></textarea>
                 <textarea v-model="editForm.bio.attitude" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white h-16" placeholder="Attitude"></textarea>
               </div>
            </div>

            <div v-if="isEditing" class="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
              <h2 class="text-sm font-semibold text-white">{{ t('profile.englishBackup') }}</h2>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input v-model="englishEditForm.nickname" class="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" placeholder="English name" />
                <input v-model="englishEditForm.slogan" class="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" placeholder="English slogan" />
              </div>
              <input v-model="englishEditForm.subSlogan" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" placeholder="English subtitle" />
              <textarea v-model="englishEditForm.bio.who" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white h-20" placeholder="Who I am in English"></textarea>
              <textarea v-model="englishEditForm.bio.what" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white h-20" placeholder="What I do in English"></textarea>
              <textarea v-model="englishEditForm.bio.attitude" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white h-16" placeholder="English attitude"></textarea>
              <input v-model="englishEditForm.tags" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" placeholder="English tags, separated by commas" />
              <input v-model="englishEditForm.techStack" class="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" placeholder="English tech stack, separated by commas" />
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2.5">
               <span 
                 v-for="tag in displayProfile.tags" 
                 :key="tag.text"
                 class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded border bg-transparent"
                 :class="tag.style"
               >
                 {{ tag.text }}
               </span>
            </div>

            <!-- Tech Stack -->
            <div class="pt-3 sm:pt-4 border-t border-white/5">
               <div class="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-widest mb-2 sm:mb-3">{{ t('profile.techStack') }}</div>
               <div class="flex flex-wrap justify-center md:justify-start gap-x-3 sm:gap-x-6 gap-y-1 sm:gap-y-2 text-[10px] sm:text-xs font-mono text-gray-500">
                  <span v-for="tech in displayProfile.techStack" :key="tech" class="hover:text-white transition-colors cursor-default">
                     {{ tech }}
                  </span>
               </div>
            </div>
            
            <!-- Save Button -->
            <div v-if="isEditing" class="flex justify-end pt-4">
              <button @click="saveProfile" class="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200">
                {{ t('profile.saveChanges') }}
              </button>
            </div>

          </div>

          <!-- Decorative Noise/Glow -->
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <!-- Card Glow Behind -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
      </div>
    
    <!-- Wechat Modal -->
    <WechatModal 
      :is-open="wechatModalOpen"
      :qr-code-url="wechatQrCode"
      :is-editing="isEditing"
      @close="wechatModalOpen = false"
      @update="handleWechatUpdate"
    />
    </div>

    <!-- Background Ambience -->
    <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-[#050505] to-transparent pointer-events-none z-0"></div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, h } from 'vue'
import { useMouse, useWindowSize } from '@vueuse/core'
import { Github, Globe, UploadCloud } from 'lucide-vue-next'
import { galleryApi, userApi } from '../api'
import WechatModal from './WechatModal.vue'
import { currentLocale, localizeProfile, t } from '../i18n'
import { hasCompleteEnglishBackup } from '../utils/contentLocalization'
import { mergeProfileEnglishBackfill } from '../data/contentBackfill'
import { getDefaultProfileSocials, normalizeProfileSocials } from '../utils/profileSocials'

const props = defineProps<{
  isEditing: boolean
}>()

const emit = defineEmits(['update-profile'])

const { x, y } = useMouse()
const { width, height } = useWindowSize()

// Storage keys
const PROFILE_DATA_KEY = 'blog_profile_data'
const WECHAT_QR_KEY = 'blog_wechat_qr'

// Try to load avatar from cache to prevent flickering
const getCachedAvatar = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return typeof user.avatar === 'string' && user.avatar.trim() ? user.avatar : null
    }
  } catch(e) {}
  return null
}

const clearCachedAvatar = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return
    const user = JSON.parse(userStr)
    delete user.avatar
    localStorage.setItem('user', JSON.stringify(user))
  } catch(e) {}
}

// Avatar state management
const initialAvatar = getCachedAvatar()
const avatarUrl = ref(initialAvatar || '')
const avatarLoading = ref(!initialAvatar) // Only show loading if no cache
const avatarInput = ref<HTMLInputElement | null>(null)
const wechatModalOpen = ref(false)
const wechatQrCode = ref(localStorage.getItem(WECHAT_QR_KEY) || '')
const currentUserId = ref<number | null>(null) // 新增：存储当前用户的真实 ID

// Preload avatar image to prevent flickering
const preloadAvatar = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject()
    img.src = url
  })
}

const onAvatarLoad = () => {
  avatarLoading.value = false
}

const onAvatarError = () => {
  if (!props.isEditing) {
    avatarUrl.value = ''
    clearCachedAvatar()
  }
  avatarLoading.value = false
}

const triggerAvatarUpload = () => {
  if (props.isEditing) {
    avatarInput.value?.click()
  }
}

const handleAvatarChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    avatarLoading.value = true
    try {
      const { data } = await galleryApi.upload(file)
      // Preload the new avatar before displaying
      await preloadAvatar(data.url)
      editForm.avatar = data.url
      avatarLoading.value = false
    } catch (e) {
      console.error('Failed to upload avatar', e)
      avatarLoading.value = false
    }
  }
}

const handleWechatUpdate = (url: string) => {
  wechatQrCode.value = url
  localStorage.setItem(WECHAT_QR_KEY, url)
}

const openWechatModal = () => {
  wechatModalOpen.value = true
}

const parallaxStyle = computed(() => {
  const dx = (x.value - width.value / 2) / width.value
  const dy = (y.value - height.value / 2) / height.value
  
  return {
    transform: `translate3d(${dx * -15}px, ${dy * -15}px, 0)`,
    transition: 'transform 0.1s ease-out'
  }
})

const WechatIcon = {
  render: () => h('svg', { 
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    class: 'w-4 h-4'
  }, [
    h('path', { d: 'M8.696 15.65c-.244 0-.466.07-.688.163-.645.28-1.78.863-2.313 1.12-.132.07-.266.024-.266-.117 0-.07 0-.257.022-1.285.023-.934-.334-1.636-.889-2.29C2.793 11.166 1.5 9.176 1.5 6.946c0-3.32 3.107-6.071 7.286-6.071 4.156 0 7.42 2.727 7.42 6.07 0 3.32-3.13 6.072-7.51 6.072zM17.5 7.922c-3.82 0-7.07 2.22-7.07 5.176 0 2.928 3.09 5.2 6.87 5.2.42 0 .822-.047 1.222-.117.756.538 1.956 1.264 2.534 1.638.156.117.334.024.312-.164-.045-1.123-.023-1.637.022-1.99.712-.702 1.112-1.567 1.112-2.48.022-2.926-2.156-5.263-5.002-5.263z' })
  ])
}

const XIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 16 16',
    fill: 'currentColor',
    class: 'w-4 h-4',
  }, [
    h('path', { d: 'M9.5 6.8 15.3.6h-1.4l-5 5.4-4-5.4H0l6.2 8.2L0 15.5h1.4l5.4-5.9 4.4 5.9H16L9.5 6.8zM2.1 1.6h2.2l9.7 12.9h-2.2L2.1 1.6z' }),
  ])
}

const getIcon = (name: string) => {
   switch(name) {
      case 'Github': return Github
      case 'Globe': return Globe
      case 'X': return XIcon
      case 'Wechat': return WechatIcon
      default: return Github
   }
}

// Initial Data (Skeleton state)
const initialProfile = {
   profile: {
     nickname: t('profile.loading'),
     slogan: "...",
     subSlogan: "...",
     bio: {
       who: "...",
       what: "...",
       attitude: "..."
     },
     tags: [],
     techStack: [],
     socials: getDefaultProfileSocials()
   },
   stats: {
     articles: "-",
     albums: "-",
     years: "-"
   }
}

// Load from cache or use initial
const getInitialProfile = () => {
  const cached = localStorage.getItem(PROFILE_DATA_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch (e) {
      console.error('Failed to parse cached profile', e)
    }
  }
  return JSON.parse(JSON.stringify(initialProfile))
}

const initialProfileData = getInitialProfile()
if (initialProfileData.profile) {
  initialProfileData.profile = normalizeProfileSocials(mergeProfileEnglishBackfill(initialProfileData.profile))
}
const profileData = reactive(initialProfileData)
const displayProfile = computed(() => localizeProfile(profileData.profile, currentLocale.value))

// Edit Form State
const editForm = reactive({
  nickname: profileData.profile.nickname,
  slogan: profileData.profile.slogan,
  subSlogan: profileData.profile.subSlogan,
  bio: { ...profileData.profile.bio },
  avatar: avatarUrl.value,
  stats: { ...profileData.stats }
})

const getEnglishProfileDraft = () => {
  const localized = localizeProfile(profileData.profile, 'en')
  return {
    nickname: localized.nickname || '',
    slogan: localized.slogan || '',
    subSlogan: localized.subSlogan || '',
    bio: { ...localized.bio },
    tags: (localized.tags || []).map((tag: { text: string }) => tag.text).join(', '),
    techStack: (localized.techStack || []).join(', '),
  }
}

const englishEditForm = reactive(getEnglishProfileDraft())

// Load Profile from API
const fetchProfile = async () => {
  try {
    const { data } = await userApi.getProfile('admin')
    
    let profileUpdated = false

    // Parse Profile JSON
    if (data.profileJson) {
      try {
        const parsed = JSON.parse(data.profileJson)
        if (parsed.profile) {
          Object.assign(profileData.profile, normalizeProfileSocials(mergeProfileEnglishBackfill(parsed.profile)))
          // Force overwrite socials to ensure legacy profile JSON cannot restore stale links.
          profileData.profile.socials = getDefaultProfileSocials()
          profileUpdated = true
        }
      } catch (e) {
        console.error('Failed to parse profile JSON', e)
      }
    }

    // Load Stats from separate column
    if (data.profileStats) {
      if (typeof data.profileStats === 'string') {
          // Handle case where specific type might be string if coming from raw JSON
          try { 
            Object.assign(profileData.stats, JSON.parse(data.profileStats)) 
            profileUpdated = true
          } catch {}
      } else {
          Object.assign(profileData.stats, data.profileStats)
          profileUpdated = true
      }
    }

    profileData.profile.socials = getDefaultProfileSocials()

    // Load WeChat QR Code
    if (data.wechatQrCode) {
      wechatQrCode.value = data.wechatQrCode
      localStorage.setItem(WECHAT_QR_KEY, data.wechatQrCode)
    }

    // Cache the updated profile data
    if (profileUpdated) {
      localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify({
        profile: profileData.profile,
        stats: profileData.stats
      }))
    }

    // Load Basic Info with avatar preloading to prevent flickering
    if (data.id) {
      currentUserId.value = data.id
    }
    
    if (data.avatar && data.avatar !== avatarUrl.value) {
      editForm.avatar = data.avatar
      try {
        // avatarLoading.value = true // Don't trigger loading for cached images
        await preloadAvatar(data.avatar)
        avatarUrl.value = data.avatar
        
        // Update cache
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        user.avatar = data.avatar
        localStorage.setItem('user', JSON.stringify(user))
      } catch (e) {
        if (avatarUrl.value === data.avatar) {
          avatarUrl.value = ''
        }
        clearCachedAvatar()
      } finally {
        avatarLoading.value = false
      }
    } else {
      // If avatar is the same or not present, just stop loading
      avatarLoading.value = false
    }
    
    if (data.nickname) {
      profileData.profile.nickname = data.nickname
      editForm.nickname = data.nickname
    }
    
    // Sync edit form
    editForm.slogan = profileData.profile.slogan
    editForm.subSlogan = profileData.profile.subSlogan
    editForm.bio = { ...profileData.profile.bio }
    editForm.stats = { ...profileData.stats }
    Object.assign(englishEditForm, getEnglishProfileDraft())

  } catch (e) {
    console.error('Failed to fetch profile', e)
    avatarLoading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})

// Update editForm when profileData changes (e.g. after fetch)
watch(profileData, (newVal) => {
  editForm.nickname = newVal.profile.nickname
  editForm.slogan = newVal.profile.slogan
  editForm.subSlogan = newVal.profile.subSlogan
  editForm.bio = { ...newVal.profile.bio }
  editForm.stats = { ...newVal.stats }
  Object.assign(englishEditForm, getEnglishProfileDraft())
}, { deep: true })

// Sync back when saving
const saveProfile = async () => {
  const nextProfileBase = {
    ...profileData.profile,
    nickname: editForm.nickname,
    slogan: editForm.slogan,
    subSlogan: editForm.subSlogan,
    bio: { ...editForm.bio }
  }
  const englishTags = englishEditForm.tags.split(',').map((value: string) => value.trim()).filter(Boolean)
  const englishProfileBackup = {
    nickname: englishEditForm.nickname.trim(),
    slogan: englishEditForm.slogan.trim(),
    subSlogan: englishEditForm.subSlogan.trim(),
    bio: {
      who: englishEditForm.bio.who.trim(),
      what: englishEditForm.bio.what.trim(),
      attitude: englishEditForm.bio.attitude.trim(),
    },
    tags: nextProfileBase.tags.map((tag: { text: string; style: string }, index: number) => ({
      ...tag,
      text: englishTags[index] || '',
    })),
    techStack: englishEditForm.techStack.split(',').map((value: string) => value.trim()).filter(Boolean),
  }
  const profileSourceFields = {
    nickname: nextProfileBase.nickname,
    slogan: nextProfileBase.slogan,
    subSlogan: nextProfileBase.subSlogan,
    who: nextProfileBase.bio.who,
    what: nextProfileBase.bio.what,
    attitude: nextProfileBase.bio.attitude,
    tags: nextProfileBase.tags.map((tag: { text: string }) => tag.text),
    techStack: nextProfileBase.techStack,
  }
  const profileEnglishFields = {
    nickname: englishProfileBackup.nickname,
    slogan: englishProfileBackup.slogan,
    subSlogan: englishProfileBackup.subSlogan,
    who: englishProfileBackup.bio.who,
    what: englishProfileBackup.bio.what,
    attitude: englishProfileBackup.bio.attitude,
    tags: englishProfileBackup.tags.map((tag: { text: string }) => tag.text),
    techStack: englishProfileBackup.techStack,
  }
  if (!hasCompleteEnglishBackup(profileSourceFields, { en: profileEnglishFields })) {
    alert(t('profile.englishRequired'))
    return
  }
  const nextProfile = {
    ...nextProfileBase,
    locales: {
      ...profileData.profile.locales,
      en: englishProfileBackup
    }
  }
  const nextStats = { ...editForm.stats }

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = currentUserId.value
    
    if (!userId) {
      throw new Error('No profile ID found')
    }

    // Preload avatar before saving to ensure smooth transition
    if (editForm.avatar !== avatarUrl.value) {
      avatarLoading.value = true
      try {
        await preloadAvatar(editForm.avatar)
      } catch (e) {
        console.error('Failed to preload avatar on save', e)
      }
    }

    const profileJsonToSave = {
      profile: nextProfile
    }

    await userApi.updateProfile(userId, {
      nickname: editForm.nickname,
      avatar: editForm.avatar,
      profileJson: JSON.stringify(profileJsonToSave),
      profileStats: nextStats,
      wechatQrCode: wechatQrCode.value
    })

    Object.assign(profileData.profile, nextProfile)
    Object.assign(profileData.stats, nextStats)
    avatarUrl.value = editForm.avatar
    avatarLoading.value = false

    localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify({
      profile: profileData.profile,
      stats: profileData.stats
    }))
    
    user.id = userId
    user.avatar = editForm.avatar
    localStorage.setItem('user', JSON.stringify(user))

  } catch (e) {
    console.error('Failed to save profile', e)
    alert(t('profile.saveFailed'))
    avatarLoading.value = false
  }

  emit('update-profile', false)
}

</script>

<style scoped>
.font-serif-sc {
  font-family: 'Noto Serif SC', serif;
}

/* Custom styles for centered image cropping */
.object-cover {
  object-fit: cover;
  object-position: center; /* Ensures we take the middle part of the image */
}
</style>
