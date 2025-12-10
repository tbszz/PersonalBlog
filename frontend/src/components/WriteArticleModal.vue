<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">写文章</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Title -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-400">标题</label>
            <input 
              v-model="form.title"
              type="text" 
              class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-lg font-medium placeholder-gray-600"
              placeholder="请输入文章标题..."
            />
          </div>

          <!-- Summary -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-400">摘要</label>
            <textarea 
              v-model="form.summary"
              rows="2"
              class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-600"
              placeholder="简短的摘要描述..."
            ></textarea>
          </div>

          <!-- Content -->
          <div class="space-y-2 flex-1 flex flex-col">
            <label class="block text-sm font-medium text-gray-400">正文</label>
            <textarea 
              v-model="form.content"
              class="w-full flex-1 min-h-[400px] bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono resize-y placeholder-gray-600"
              placeholder="# 开始撰写..."
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-white/10 flex items-center justify-end gap-4 bg-[#1a1a1a]">
          <button 
            @click="$emit('close')"
            class="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            取消
          </button>
          <button 
            @click="handleSubmit"
            :disabled="isSubmitting || !form.title || !form.content"
            class="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
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
import { X, Loader2 } from 'lucide-vue-next'
import { articleApi } from '../api'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const form = reactive({
  title: '',
  content: '',
  summary: '',
  status: 'published' // Default to published based on requirement
})

const handleSubmit = async () => {
  if (!form.title || !form.content) return
  
  try {
    isSubmitting.value = true
    
    // Auto-generate summary if empty
    if (!form.summary) {
      form.summary = form.content.slice(0, 100).replace(/[#*`]/g, '') + '...'
    }

    await articleApi.create(form)
    
    // Reset form
    form.title = ''
    form.content = ''
    form.summary = ''
    
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
</style>
