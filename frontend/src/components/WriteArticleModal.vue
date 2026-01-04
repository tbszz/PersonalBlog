<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <!-- Header -->
        <div class="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-white">写文章</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors p-1">
            <X class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <!-- Title -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-400">标题</label>
            <input 
              v-model="form.title"
              type="text" 
              class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-base sm:text-lg font-medium placeholder-gray-600"
              placeholder="请输入文章标题..."
            />
          </div>

          <!-- Summary -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-400">摘要</label>
            <textarea 
              v-model="form.summary"
              rows="2"
              class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-600 text-sm sm:text-base"
              placeholder="简短的摘要描述..."
            ></textarea>
          </div>

          <!-- Image Upload Section -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-400">插入图片</label>
            
            <!-- Upload Button -->
            <div class="flex flex-wrap gap-3 items-center">
              <label 
                class="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors text-sm text-gray-300"
              >
                <ImagePlus class="w-4 h-4" />
                <span>上传图片</span>
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
                正在上传...
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
                  插入到正文
                </button>
              </div>
            </div>
            
            <p class="text-xs text-gray-500">
              提示：上传图片后，点击图片可将链接插入到正文中
            </p>
          </div>

          <!-- Content -->
          <div class="space-y-2 flex-1 flex flex-col">
            <label class="block text-sm font-medium text-gray-400">正文</label>
            <textarea 
              ref="contentTextarea"
              v-model="form.content"
              class="w-full flex-1 min-h-[250px] sm:min-h-[400px] bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm resize-y placeholder-gray-600"
              placeholder="# 开始撰写...&#10;&#10;支持插入图片链接，格式：![图片描述](图片URL)"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 bg-[#1a1a1a]">
          <button 
            @click="$emit('close')"
            class="px-6 py-2 text-gray-400 hover:text-white transition-colors order-2 sm:order-1"
          >
            取消
          </button>
          <button 
            @click="handleSubmit"
            :disabled="isSubmitting || !form.title || !form.content"
            class="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span>发布文章</span>
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

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const isUploading = ref(false)
const contentTextarea = ref<HTMLTextAreaElement | null>(null)
const uploadedImages = ref<Array<{ url: string; name: string }>>([])

const form = reactive({
  title: '',
  content: '',
  summary: '',
  status: 'published' // Default to published based on requirement
})

const handleImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files[0]) return
  
  const file = target.files[0]
  isUploading.value = true
  
  try {
    const { data } = await galleryApi.upload(file)
    uploadedImages.value.push({
      url: data.url,
      name: file.name
    })
    
    // Auto-insert to content
    insertImageToContent(data.url)
  } catch (e) {
    console.error('Failed to upload image:', e)
    alert('图片上传失败，请重试')
  } finally {
    isUploading.value = false
    // Reset input
    target.value = ''
  }
}

const insertImageToContent = (url: string) => {
  const imageMarkdown = `\n![图片](${url})\n`
  
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

    await articleApi.create(form)
    
    // Reset form
    form.title = ''
    form.content = ''
    form.summary = ''
    uploadedImages.value = []
    
    emit('success')
    emit('close')
  } catch (e) {
    console.error('Failed to create article:', e)
    alert('发布失败，请重试')
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
