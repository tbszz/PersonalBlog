<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    <article
      v-for="item in localizedItems"
      :key="item.id"
      class="group relative overflow-hidden rounded-xl border border-white/5 bg-neutral-900/30 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/5"
    >
      <div v-if="item.coverImage" class="aspect-[16/10] overflow-hidden bg-black/40">
        <img
          :src="item.coverImage"
          :alt="item.title"
          class="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div v-else class="aspect-[16/10] bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] flex items-center justify-center">
        <span class="text-5xl font-bold text-white/20 font-serif-sc">{{ item.title.slice(0, 1) }}</span>
      </div>

      <div class="p-4 sm:p-6 space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="item.featured"
                class="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[10px] text-blue-300"
              >
                <Star class="w-3 h-3" />
                {{ t('portfolio.featured') }}
              </span>
              <span
                v-if="item.status === 'draft'"
                class="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300"
              >
                {{ t('portfolio.status.draft') }}
              </span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
              {{ item.title }}
            </h3>
          </div>

          <button
            v-if="isEditing"
            @click.stop="handleDelete(item.id)"
            class="p-2 text-red-500 hover:text-red-400 transition-colors"
            :title="t('portfolio.deleteTitle')"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <p class="text-sm leading-relaxed text-gray-400">
          {{ item.description }}
        </p>

        <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="rounded border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] text-gray-400"
          >
            #{{ tag }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <a
            v-if="item.projectUrl"
            :href="item.projectUrl"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink class="w-3 h-3" />
            {{ t('portfolio.visit') }}
          </a>
          <a
            v-if="item.sourceUrl"
            :href="item.sourceUrl"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <Github class="w-3 h-3" />
            {{ t('portfolio.source') }}
          </a>
        </div>
      </div>
    </article>

    <div v-if="loading" class="md:col-span-2 text-center py-12 text-gray-500">
      <Loader2 class="w-8 h-8 animate-spin mx-auto mb-2" />
      {{ t('portfolio.loading') }}
    </div>

    <div v-if="!loading && items.length === 0" class="md:col-span-2 text-center py-12 text-gray-500">
      {{ t('portfolio.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ExternalLink, Github, Loader2, Star, Trash2 } from 'lucide-vue-next'
import { portfolioApi, type PortfolioItem } from '../api'
import { t } from '../i18n'
import { currentLocale } from '../i18n'
import { localizePortfolioItem } from '../utils/contentLocalization'

defineProps<{
  isEditing?: boolean
}>()

const items = ref<PortfolioItem[]>([])
const localizedItems = computed(() => items.value.map(item => localizePortfolioItem(item, currentLocale.value) as PortfolioItem))
const loading = ref(false)

const fetchItems = async () => {
  loading.value = true
  try {
    const { data } = await portfolioApi.getAll()
    items.value = data || []
  } catch (e) {
    console.error('Failed to fetch portfolio items', e)
  } finally {
    loading.value = false
  }
}

const prependItem = (item: PortfolioItem) => {
  items.value = [item, ...items.value.filter(existing => existing.id !== item.id)]
}

defineExpose({ prependItem, fetchItems })

const handleDelete = async (id: number) => {
  if (!confirm(t('portfolio.deleteConfirm'))) return

  try {
    await portfolioApi.delete(id)
    items.value = items.value.filter(item => item.id !== id)
  } catch (e) {
    console.error('Failed to delete portfolio item', e)
    alert(t('portfolio.deleteFailed'))
  }
}

onMounted(() => {
  fetchItems()
})
</script>
