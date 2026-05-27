<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all flex flex-col items-center">
      <h3 class="text-xl font-bold text-white mb-4">{{ t('wechat.title') }}</h3>
      
      <!-- QR Code Display -->
      <div 
        class="w-48 h-48 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-white/10 relative group cursor-pointer"
        @click="triggerUpload"
      >
        <img 
          v-if="qrCodeUrl" 
          :src="qrCodeUrl" 
          :alt="t('wechat.alt')"
          class="w-full h-full object-cover" 
        />
        <div v-else class="text-gray-500 text-sm">{{ t('wechat.empty') }}</div>

        <!-- Upload Overlay (Only if editing) -->
        <div 
          v-if="isEditing" 
          class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span class="text-white text-sm font-medium">{{ t('wechat.changeImage') }}</span>
        </div>
      </div>

      <p class="mt-4 text-gray-400 text-sm text-center">
        {{ t('wechat.hint') }}
      </p>

      <!-- Hidden Input for Upload -->
      <input 
        v-if="isEditing"
        ref="fileInput"
        type="file" 
        accept="image/*" 
        class="hidden" 
        @change="handleUpload"
      />

      <!-- Close Button -->
      <button 
        @click="close"
        class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { galleryApi } from '../api'
import { t } from '../i18n'

const props = defineProps<{
  isOpen: boolean
  qrCodeUrl?: string
  isEditing: boolean
}>()

const emit = defineEmits(['close', 'update'])

const fileInput = ref<HTMLInputElement | null>(null)

const close = () => {
  emit('close')
}

const triggerUpload = () => {
  if (props.isEditing) {
    fileInput.value?.click()
  }
}

const handleUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    try {
      const file = target.files[0]
      const { data } = await galleryApi.upload(file)
      emit('update', data.url)
    } catch (e) {
      console.error('Failed to upload QR code', e)
      alert(t('article.uploadFailed'))
    }
  }
}
</script>
