<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <!-- Header -->
        <div class="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-white">{{ t('article.writeTitle') }}</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors p-1">
            <X class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <!-- Title -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-400">{{ t('article.title') }}</label>
            <input 
              v-model="form.title"
              type="text" 
              class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-base sm:text-lg font-medium placeholder-gray-600"
              :placeholder="t('article.titlePlaceholder')"
            />
          </div>

          <!-- Summary -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-400">{{ t('article.summary') }}</label>
            <textarea 
              v-model="form.summary"
              rows="2"
              class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-600 text-sm sm:text-base"
              :placeholder="t('article.summaryPlaceholder')"
            ></textarea>
          </div>

          <!-- Image Upload Section -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-400">{{ t('article.insertImage') }}</label>
            
            <!-- Upload Button -->
            <div class="flex flex-wrap gap-3 items-center">
              <label 
                class="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors text-sm text-gray-300"
              >
                <ImagePlus class="w-4 h-4" />
                <span>{{ t('article.uploadImage') }}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleImageUpload"
                  :disabled="isUploading"
                />
              </label>
              
              <span v-if="isUploading" class="text-xs text-gray-500 flex items-center gap-2">
                <Loader2 class="w-4 h-4 animate-spin" />
                {{ uploadStatus || t('gallery.uploading') }}
              </span>
            </div>
            
            <!-- Uploaded Images Preview -->
            <div v-if="uploadedImages.length > 0" class="flex flex-wrap gap-3">
              <div 
                v-for="(img, index) in uploadedImages" 
                :key="index"
                class="relative group/img"
              >
                <img 
                  :src="img.url" 
                  :alt="img.name"
                  class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-white/10"
                />
                <button 
                  @click="removeImage(index)"
                  class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                >
                  <X class="w-3 h-3" />
                </button>
                <button 
                  @click="insertImageToContent(img.url)"
                  class="absolute bottom-1 left-1 right-1 text-[10px] bg-black/70 text-white py-1 rounded opacity-0 group-hover/img:opacity-100 transition-opacity text-center"
                >
                  {{ t('article.insertIntoContent') }}
                </button>
              </div>
            </div>
            
            <p class="text-xs text-gray-500">
              {{ t('article.imageHint') }}
            </p>
          </div>

          <!-- Content -->
          <div class="space-y-2 flex-1 flex flex-col">
            <label class="block text-sm font-medium text-gray-400">{{ t('article.content') }}</label>
            <textarea 
              ref="contentTextarea"
              v-model="form.content"
              class="w-full flex-1 min-h-[250px] sm:min-h-[400px] bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm resize-y placeholder-gray-600"
              :placeholder="t('article.contentPlaceholder')"
            ></textarea>
          </div>

          <!-- English Backup -->
          <div class="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 class="text-sm font-semibold text-white">{{ t('article.englishBackup') }}</h3>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('article.englishTitle') }}</label>
              <input
                v-model="englishBackup.title"
                type="text"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                :placeholder="t('article.englishTitlePlaceholder')"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('article.englishSummary') }}</label>
              <textarea
                v-model="englishBackup.summary"
                rows="2"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-600"
                :placeholder="t('article.englishSummaryPlaceholder')"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('article.englishContent') }}</label>
              <textarea
                v-model="englishBackup.content"
                class="w-full min-h-[180px] bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm resize-y placeholder-gray-600"
                :placeholder="t('article.englishContentPlaceholder')"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 bg-[#1a1a1a]">
          <button 
            @click="$emit('close')"
            class="px-6 py-2 text-gray-400 hover:text-white transition-colors order-2 sm:order-1"
          >
            {{ t('article.cancel') }}
          </button>
          <button 
            @click="handleSubmit"
            :disabled="isSubmitting || !form.title || !form.content"
            class="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span>{{ t('article.publish') }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Loader2, ImagePlus } from 'lucide-vue-next'
import { articleApi, galleryApi } from '../api'
import { t } from '../i18n'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const isUploading = ref(false)
const uploadStatus = ref('')
const contentTextarea = ref<HTMLTextAreaElement | null>(null)
const uploadedImages = ref<Array<{ url: string; name: string }>>([])

const form = reactive({
  title: '',
  content: '',
  summary: '',
  status: 'published' // Default to published based on requirement
})

const englishBackup = reactive({
  title: '',
  summary: '',
  content: ''
})

const handleImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files[0]) return
  
  const file = target.files[0]
  isUploading.value = true
  uploadStatus.value = t('article.optimizingImage')
  
  try {
    const { data } = await galleryApi.upload(file)
    uploadStatus.value = data.optimized ? t('article.imageOptimized') : t('article.insertingImage')
    uploadedImages.value.push({
      url: data.url,
      name: file.name
    })
    
    // Auto-insert to content
    insertImageToContent(data.url)
  } catch (e) {
    console.error('Failed to upload image:', e)
    alert(t('article.uploadFailed'))
  } finally {
    isUploading.value = false
    uploadStatus.value = ''
    // Reset input
    target.value = ''
  }
}

const insertImageToContent = (url: string) => {
  const imageMarkdown = `\n![${t('article.imageAlt')}](${url})\n`
  
  const textarea = contentTextarea.value
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.content
    
    form.content = text.substring(0, start) + imageMarkdown + text.substring(end)
    
    // Move cursor after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
    }, 0)
  } else {
    form.content += imageMarkdown
  }
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.title || !form.content) return
  
  try {
    isSubmitting.value = true
    
    // Auto-generate summary if empty
    if (!form.summary) {
      form.summary = form.content.slice(0, 100).replace(/[#*`\[\]!]/g, '').replace(/\(http[^)]+\)/g, '') + '...'
    }

    const { data } = await articleApi.create({
      ...form,
      translations: {
        en: {
          title: englishBackup.title.trim() || undefined,
          summary: englishBackup.summary.trim() || undefined,
          content: englishBackup.content.trim() || undefined,
        },
      },
    })
    
    // Reset form
    form.title = ''
    form.content = ''
    form.summary = ''
    englishBackup.title = ''
    englishBackup.summary = ''
    englishBackup.content = ''
    uploadedImages.value = []
    
    emit('success', data)
    emit('close')
  } catch (e) {
    console.error('Failed to create article:', e)
    alert(t('article.publishFailed'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Mobile scrolling optimization */
@media (max-width: 640px) {
  textarea {
    font-size: 16px; /* Prevent iOS zoom on focus */
  }
}
</style>
