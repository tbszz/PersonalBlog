<template>
  <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
    <div 
      v-for="item in items" 
      :key="item.id" 
      class="break-inside-avoid group relative rounded-xl overflow-hidden bg-neutral-900/50 cursor-pointer transform transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
    >
      <!-- Image Item -->
      <div v-if="item.type === 'image'" class="relative overflow-hidden perspective-container">
        <img 
          :src="item.url" 
          class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
          loading="lazy" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <!-- Video Item -->
      <div v-else class="relative w-full aspect-video bg-black">
        <video 
          :src="item.url" 
          :poster="item.thumbnailUrl"
          class="w-full h-full object-cover"
          muted loop playsinline
          @mouseenter="playVideo($event)"
          @mouseleave="pauseVideo($event)"
        ></video>
        <!-- Play Icon Overlay -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
          <div class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <div class="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
          </div>
        </div>
      </div>

      <!-- Info Overlay -->
      <div class="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div class="flex justify-between items-end w-full">
          <div>
            <span class="text-xs text-blue-400 font-mono mb-1 uppercase tracking-wider">{{ item.type }}</span>
            <p class="text-sm text-gray-200 font-medium leading-snug">{{ item.description }}</p>
          </div>
          
          <!-- Delete Button -->
          <button 
            v-if="isEditing"
            @click.stop="handleDelete(item.id)"
            class="pointer-events-auto p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
            :title="t('gallery.deleteTitle')"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { type GalleryItem, galleryApi } from '../api'
import { t } from '../i18n'

defineProps<{
  items: GalleryItem[],
  isEditing?: boolean
}>()

const emit = defineEmits(['delete-success'])

const handleDelete = async (id: number) => {
  if (!confirm(t('gallery.deleteConfirm'))) return
  
  try {
    await galleryApi.delete(id)
    emit('delete-success')
  } catch (e) {
    console.error('Failed to delete item', e)
    alert(t('gallery.deleteFailed'))
  }
}

const playVideo = (e: Event) => {
  const video = e.target as HTMLVideoElement
  video.play().catch(() => {})
}

const pauseVideo = (e: Event) => {
  const video = e.target as HTMLVideoElement
  video.pause()
  video.currentTime = 0
}
</script>

<style scoped>
.perspective-container {
  perspective: 1000px;
}
</style>
