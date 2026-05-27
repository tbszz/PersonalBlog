<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close"></div>

      <div class="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl">
        <div class="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-white">{{ t('portfolio.modalTitle') }}</h2>
          <button @click="close" class="text-gray-400 hover:text-white transition-colors p-1">
            <X class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2 sm:col-span-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('portfolio.title') }}</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div class="space-y-2 sm:col-span-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('portfolio.description') }}</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                required
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('portfolio.projectUrl') }}</label>
              <input
                v-model="form.projectUrl"
                type="url"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('portfolio.sourceUrl') }}</label>
              <input
                v-model="form.sourceUrl"
                type="url"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div class="space-y-2 sm:col-span-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('portfolio.coverImage') }}</label>
              <div class="flex flex-col sm:flex-row gap-3">
                <input
                  v-model="form.coverImage"
                  type="url"
                  class="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <label class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors text-sm text-gray-300">
                  <ImagePlus class="w-4 h-4" />
                  <span>{{ isUploading ? t('portfolio.uploadingCover') : t('portfolio.uploadCover') }}</span>
                  <input type="file" accept="image/*" class="hidden" :disabled="isUploading" @change="handleCoverUpload" />
                </label>
              </div>
              <img
                v-if="form.coverImage"
                :src="form.coverImage"
                alt=""
                class="mt-3 h-36 w-full rounded-lg object-cover border border-white/10"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('portfolio.tags') }}</label>
              <input
                v-model="form.tags"
                type="text"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                :placeholder="t('portfolio.tagsHint')"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-400">{{ t('portfolio.sortOrder') }}</label>
              <input
                v-model.number="form.sortOrder"
                type="number"
                class="w-full bg-black/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <label class="inline-flex items-center gap-2 text-sm text-gray-300">
            <input v-model="form.featured" type="checkbox" class="accent-blue-500" />
            {{ t('portfolio.featuredInput') }}
          </label>

          <div v-if="error" class="text-red-400 text-sm">
            {{ error }}
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" @click="close" class="px-6 py-2 text-gray-400 hover:text-white transition-colors order-2 sm:order-1">
              {{ t('gallery.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !form.title || !form.description"
              class="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? t('portfolio.saving') : t('portfolio.save') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ImagePlus, Loader2, X } from 'lucide-vue-next'
import { galleryApi, portfolioApi, type PortfolioItem } from '../api'
import { t } from '../i18n'
import { parsePortfolioTags } from '../utils/portfolio'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  success: [item: PortfolioItem]
}>()

const isSubmitting = ref(false)
const isUploading = ref(false)
const error = ref('')

const form = reactive({
  title: '',
  description: '',
  coverImage: '',
  projectUrl: '',
  sourceUrl: '',
  tags: '',
  featured: false,
  sortOrder: 0,
})

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.coverImage = ''
  form.projectUrl = ''
  form.sourceUrl = ''
  form.tags = ''
  form.featured = false
  form.sortOrder = 0
  error.value = ''
}

const close = () => {
  emit('close')
  resetForm()
}

const handleCoverUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isUploading.value = true
  error.value = ''
  try {
    const { data } = await galleryApi.upload(file)
    form.coverImage = data.url
  } catch (e) {
    console.error('Failed to upload portfolio cover', e)
    error.value = t('article.uploadFailed')
  } finally {
    isUploading.value = false
    target.value = ''
  }
}

const emptyToUndefined = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const handleSubmit = async () => {
  if (!form.title || !form.description) return

  isSubmitting.value = true
  error.value = ''
  try {
    const { data } = await portfolioApi.create({
      title: form.title.trim(),
      description: form.description.trim(),
      coverImage: emptyToUndefined(form.coverImage),
      projectUrl: emptyToUndefined(form.projectUrl),
      sourceUrl: emptyToUndefined(form.sourceUrl),
      tags: parsePortfolioTags(form.tags),
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
      status: 'published',
    })

    emit('success', data)
    close()
  } catch (e) {
    console.error('Failed to create portfolio item', e)
    error.value = t('portfolio.createFailed')
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
