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
                 <img :src="isEditing ? editForm.avatar : avatarUrl" alt="Avatar" class="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
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
                  <div class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1">Articles</div>
               </div>
               <div class="w-px h-8 bg-white/10 self-center"></div>
               <div class="text-center w-16 sm:w-20">
                  <div v-if="!isEditing" class="text-lg sm:text-xl font-bold text-white font-serif-sc">{{ profileData.stats.albums }}</div>
                  <input v-else v-model="editForm.stats.albums" class="w-full bg-white/10 border border-white/20 rounded px-1 py-0.5 text-center text-white font-bold text-sm" />
                  <div class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1">Albums</div>
               </div>
               <div class="w-px h-8 bg-white/10 self-center"></div>
               <div class="text-center w-16 sm:w-20">
                  <div v-if="!isEditing" class="text-lg sm:text-xl font-bold text-white font-serif-sc">{{ profileData.stats.years }}</div>
                  <input v-else v-model="editForm.stats.years" class="w-full bg-white/10 border border-white/20 rounded px-1 py-0.5 text-center text-white font-bold text-sm" />
                  <div class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1">Years</div>
               </div>
            </div>

            <!-- Social Links -->
            <div class="flex gap-4 mt-2">
               <a 
                 v-for="social in profileData.profile.socials" 
                 :key="social.name" 
                 :href="social.name === 'Wechat' ? 'javascript:void(0)' : social.url" 
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
                    {{ profileData.profile.nickname }}
                 </h1>
                 <input v-else v-model="editForm.nickname" class="bg-white/10 border border-white/20 rounded px-2 py-1 text-xl sm:text-2xl w-full md:w-auto text-white text-center md:text-left" />

                 <!-- Small Slogan Badge -->
                 <span v-if="!isEditing" class="px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs font-medium bg-white/10 text-white/80 border border-white/10 font-xingkai text-sm sm:text-lg tracking-wide transform md:-translate-y-1">
                    {{ profileData.profile.slogan }}
                 </span>
                 <input v-else v-model="editForm.slogan" class="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white w-full md:w-auto" placeholder="Slogan" />
              </div>
              
              <p v-if="!isEditing" class="text-xs sm:text-sm md:text-base text-gray-400 font-light tracking-wide font-sans">
                 {{ profileData.profile.subSlogan }}
              </p>
              <input v-else v-model="editForm.subSlogan" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" placeholder="Sub Slogan" />
            </div>

            <!-- Bio -->
            <div class="space-y-3 sm:space-y-4 relative">
               <div class="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent hidden md:block"></div>
               
               <div v-if="!isEditing" class="space-y-2 sm:space-y-3">
                 <p class="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    <span class="text-blue-400/80 font-mono text-[10px] sm:text-xs mr-1 sm:mr-2">[WHO]</span>
                    {{ profileData.profile.bio.who }}
                 </p>
                 <p class="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    <span class="text-purple-400/80 font-mono text-[10px] sm:text-xs mr-1 sm:mr-2">[WHAT]</span>
                    {{ profileData.profile.bio.what }}
                 </p>
                 <p class="text-gray-400 italic font-serif leading-relaxed text-xs sm:text-sm">
                    "{{ profileData.profile.bio.attitude }}"
                 </p>
               </div>
               <div v-else class="space-y-2">
                 <textarea v-model="editForm.bio.who" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white h-20" placeholder="Who am I"></textarea>
                 <textarea v-model="editForm.bio.what" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white h-20" placeholder="What I do"></textarea>
                 <textarea v-model="editForm.bio.attitude" class="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white h-16" placeholder="Attitude"></textarea>
               </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2.5">
               <span 
                 v-for="tag in profileData.profile.tags" 
                 :key="tag.text"
                 class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded border bg-transparent"
                 :class="tag.style"
               >
                 {{ tag.text }}
               </span>
            </div>

            <!-- Tech Stack -->
            <div class="pt-3 sm:pt-4 border-t border-white/5">
               <div class="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-widest mb-2 sm:mb-3">Tech Stack</div>
               <div class="flex flex-wrap justify-center md:justify-start gap-x-3 sm:gap-x-6 gap-y-1 sm:gap-y-2 text-[10px] sm:text-xs font-mono text-gray-500">
                  <span v-for="tech in profileData.profile.techStack" :key="tech" class="hover:text-white transition-colors cursor-default">
                     {{ tech }}
                  </span>
               </div>
            </div>
            
            <!-- Save Button -->
            <div v-if="isEditing" class="flex justify-end pt-4">
              <button @click="saveProfile" class="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200">
                Save Changes
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
import { Github, Tv, UploadCloud } from 'lucide-vue-next'
import { galleryApi, userApi } from '../api'
import WechatModal from './WechatModal.vue'

const props = defineProps<{
  isEditing: boolean
}>()

const emit = defineEmits(['update-profile'])

const { x, y } = useMouse()
const { width, height } = useWindowSize()

// Try to load avatar from cache to prevent flickering
const getCachedAvatar = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return user.avatar
    }
  } catch(e) {}
  return null
}

const avatarUrl = ref(getCachedAvatar() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop')
const avatarInput = ref<HTMLInputElement | null>(null)
const wechatModalOpen = ref(false)
const wechatQrCode = ref('')

const triggerAvatarUpload = () => {
  if (props.isEditing) {
    avatarInput.value?.click()
  }
}

const handleAvatarChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    try {
      const { data } = await galleryApi.upload(file)
      editForm.avatar = data.url
    } catch (e) {
      console.error('Failed to upload avatar', e)
    }
  }
}

const handleWechatUpdate = (url: string) => {
  wechatQrCode.value = url
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

const getIcon = (name: string) => {
   switch(name) {
      case 'Github': return Github
      case 'Tv': return Tv // Bilibili
      case 'Wechat': return WechatIcon
      default: return Github
   }
}

// Initial Data
const initialProfile = {
   profile: {
     nickname: "邹子",
     slogan: "天不生邹子",
     subSlogan: "万古如长夜 | Codes, Camera, and the Infinite Dark",
     bio: {
       who: "一名热衷于构建优雅系统的 Full Stack 开发者。主修 Java 生态与 Vue 前端，致力于将复杂的逻辑转化为丝滑的用户体验。",
       what: "正在用代码编织逻辑，用镜头捕捉光影。在这里记录技术沉淀，也分享生活瞬间。",
       attitude: "相信代码能改变世界，但更相信审美决定高度。"
     },
     tags: [
       { text: "全栈开发者", style: "border-blue-500/30 text-blue-400" },
       { text: "Java后端", style: "border-red-500/30 text-red-400" },
       { text: "Vue前端", style: "border-green-500/30 text-green-400" },
       { text: "摄影师", style: "border-purple-500/30 text-purple-400" },
       { text: "极简主义", style: "border-gray-500/30 text-gray-400" }
     ],
     techStack: [
       "Java", "Spring Boot", "MyBatis", "MySQL", "Redis",
       "Vue 3", "TypeScript", "Tailwind CSS", "Docker", "Git"
     ],
     socials: [
       { name: "Github", icon: "Github", url: "https://github.com/tbszz" },
       { name: "Bilibili", icon: "Tv", url: "https://space.bilibili.com/" },
       { name: "Wechat", icon: "Wechat", url: "#" } 
     ]
   },
   stats: {
     articles: "42",
     albums: "108",
     years: "5"
   }
}

const profileData = reactive(JSON.parse(JSON.stringify(initialProfile)))

// Edit Form State
const editForm = reactive({
  nickname: profileData.profile.nickname,
  slogan: profileData.profile.slogan,
  subSlogan: profileData.profile.subSlogan,
  bio: { ...profileData.profile.bio },
  avatar: avatarUrl.value,
  stats: { ...profileData.stats }
})

// Load Profile from API
const fetchProfile = async () => {
  try {
    const { data } = await userApi.getProfile('admin')
    
    // Parse Profile JSON
    if (data.profileJson) {
      try {
        const parsed = JSON.parse(data.profileJson)
        if (parsed.profile) {
          Object.assign(profileData.profile, parsed.profile)
          // Force overwrite socials to ensure WeChat icon is present (handling legacy data)
          profileData.profile.socials = [
             { name: "Github", icon: "Github", url: "https://github.com/tbszz" },
             { name: "Bilibili", icon: "Tv", url: "https://space.bilibili.com/" },
             { name: "Wechat", icon: "Wechat", url: "#" }
          ]
        }
      } catch (e) {
        console.error('Failed to parse profile JSON', e)
      }
    }

    // Load Stats from separate column
    if (data.profileStats) {
      if (typeof data.profileStats === 'string') {
          // Handle case where specific type might be string if coming from raw JSON
          try { Object.assign(profileData.stats, JSON.parse(data.profileStats)) } catch {}
      } else {
          Object.assign(profileData.stats, data.profileStats)
      }
    }

    // Load WeChat QR Code
    if (data.wechatQrCode) {
      wechatQrCode.value = data.wechatQrCode
    }

    // Load Basic Info
    if (data.avatar) {
      avatarUrl.value = data.avatar
      editForm.avatar = data.avatar
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

  } catch (e) {
    console.error('Failed to fetch profile', e)
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
}, { deep: true })

// Sync back when saving
const saveProfile = async () => {
  // Update local state
  Object.assign(profileData.profile, {
    nickname: editForm.nickname,
    slogan: editForm.slogan,
    subSlogan: editForm.subSlogan,
    bio: { ...editForm.bio }
  })
  Object.assign(profileData.stats, editForm.stats)
  
  avatarUrl.value = editForm.avatar
  
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    // Fallback ID if not in localStorage. In real app, must be logged in.
    const userId = user.id || 1 // Assuming 1 for admin or fail gracefully
    if (!userId) {
       console.error("No user ID found")
       return
    }

    // Construct the JSON for the profile_json column (excluding stats/qrcode which are separate now, or keep them consistent)
    // We keep 'profile' inside JSON, but 'stats' are separate
    const profileJsonToSave = {
        profile: profileData.profile
        // Stats are saved separately
    }

    await userApi.updateProfile(userId, {
      nickname: editForm.nickname,
      avatar: editForm.avatar,
      profileJson: JSON.stringify(profileJsonToSave),
      profileStats: editForm.stats,
      wechatQrCode: wechatQrCode.value
    })
    
    // Update cache
    user.avatar = editForm.avatar
    localStorage.setItem('user', JSON.stringify(user))

  } catch (e) {
    console.error('Failed to save profile', e)
    alert('保存失败，请重试')
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
