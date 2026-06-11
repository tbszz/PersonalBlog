<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
      <h2 class="text-2xl font-bold text-white mb-6">{{ t('gallery.uploadTitle') }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">{{ t('gallery.type') }}</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="form.type" value="image" class="accent-blue-500" />
              <span class="text-white">{{ t('gallery.image') }}</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="form.type" value="video" class="accent-blue-500" />
              <span class="text-white">{{ t('gallery.video') }}</span>
            </label>
          </div>
        </div>

        <!-- File Input -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">{{ t('gallery.file') }}</label>
          <div 
            class="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/30 transition-colors cursor-pointer"
            @click="triggerFileInput"
            @drop.prevent="handleDrop"
            @dragover.prevent
          >
            <input 
              ref="fileInput"
              type="file" 
              class="hidden" 
              accept="image/*,video/*"
              @change="handleFileSelect"
            />
            <div v-if="previewUrl" class="relative">
              <img v-if="form.type === 'image'" :src="previewUrl" class="max-h-40 mx-auto rounded" />
              <video v-else :src="previewUrl" class="max-h-40 mx-auto rounded" controls></video>
              <button 
                type="button"
                @click.stop="clearFile"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
            <div v-else class="text-gray-500">
              <p>{{ t('gallery.clickToUpload') }}</p>
              <p class="text-xs mt-1">{{ t('gallery.supports') }}</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">{{ t('gallery.description') }}</label>
          <input 
            v-model="form.description" 
            type="text" 
            class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
            :placeholder="t('gallery.descriptionPlaceholder')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">{{ t('gallery.englishDescription') }}</label>
          <input
            v-model="englishBackup.description"
            type="text"
            class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
            :placeholder="t('gallery.englishDescriptionPlaceholder')"
          />
        </div>
        
        <div v-if="uploadStatus" class="text-gray-400 text-xs">
          {{ uploadStatus }}
        </div>

        <div v-if="error" class="text-red-400 text-sm">
          {{ error }}
        </div>
        
        <div class="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            @click="close"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            {{ t('gallery.cancel') }}
          </button>
          <button 
            type="submit" 
            class="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || !selectedFile"
          >
            {{ loading ? t('gallery.uploading') : t('gallery.upload') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { galleryApi } from '../api'
import { t } from '../i18n'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'upload-success'])

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const loading = ref(false)
const error = ref('')
const uploadStatus = ref('')

const form = reactive({
  type: 'image' as 'image' | 'video',
  description: ''
})

const englishBackup = reactive({
  description: ''
})

const close = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  selectedFile.value = null
  previewUrl.value = ''
  form.description = ''
  form.type = 'image'
  englishBackup.description = ''
  error.value = ''
  uploadStatus.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processFile(e.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  
  // Auto-detect type
  if (file.type.startsWith('video/')) {
    form.type = 'video'
  } else {
    form.type = 'image'
  }
}

const clearFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const handleSubmit = async () => {
  if (!selectedFile.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    // 1. Upload File
    uploadStatus.value = form.type === 'image' ? t('gallery.optimizing') : t('gallery.uploadingVideo')
    const { data: uploadData } = await galleryApi.upload(selectedFile.value)
    uploadStatus.value = uploadData.optimized
      ? `${t('gallery.optimizedPrefix')} ${(uploadData.originalSize / 1024 / 1024).toFixed(2)} MB ${t('gallery.optimizedMiddle')} ${(uploadData.uploadedSize / 1024 / 1024).toFixed(2)} MB. ${t('gallery.saving')}`
      : t('gallery.saving')
    
    // 2. Create Gallery Item
    await galleryApi.create({
      type: form.type,
      url: uploadData.url,
      description: form.description,
      translations: {
        en: {
          description: englishBackup.description.trim() || undefined,
        },
      },
      thumbnailUrl: form.type === 'video' ? uploadData.url : undefined // Use same URL for video poster for now
    })
    
    emit('upload-success')
    close()
  } catch (e: unknown) {
    console.error(e)
    error.value = e instanceof Error ? e.message : t('gallery.uploadFailed')
  } finally {
    loading.value = false
    uploadStatus.value = ''
  }
}
</script>
