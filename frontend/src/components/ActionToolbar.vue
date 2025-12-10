<template>
  <div class="flex items-center gap-4">
    <button 
      @click="$emit('write')"
      class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
    >
      <PenTool class="w-4 h-4" />
      <span>写文章</span>
    </button>
    <button 
      @click="$emit('upload')"
      class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
    >
      <UploadCloud class="w-4 h-4" />
      <span>上传相册</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PenTool, UploadCloud } from 'lucide-vue-next'

defineEmits(['upload', 'write'])
</script>
