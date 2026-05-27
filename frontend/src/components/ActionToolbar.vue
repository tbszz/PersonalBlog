<template>
  <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
    <button 
      @click="$emit('write')"
      class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
    >
      <PenTool class="w-4 h-4" />
      <span>{{ t('toolbar.writeArticle') }}</span>
    </button>
    <button 
      @click="$emit('upload')"
      class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
    >
      <UploadCloud class="w-4 h-4" />
      <span>{{ t('toolbar.uploadAlbum') }}</span>
    </button>
    <button
      @click="$emit('portfolio')"
      class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
    >
      <Briefcase class="w-4 h-4" />
      <span>{{ t('toolbar.addPortfolio') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Briefcase, PenTool, UploadCloud } from 'lucide-vue-next'
import { t } from '../i18n'

defineEmits(['upload', 'write', 'portfolio'])
</script>
