<template>
  <div class="grid grid-cols-1 gap-6">
    <article 
      v-for="post in posts" 
      :key="post.id"
      class="group relative bg-neutral-900/30 border border-white/5 rounded-xl p-6 md:p-8 hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
    >
      <div class="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div class="space-y-3 flex-1">
          <div class="flex items-center gap-3 text-xs text-gray-500 font-mono">
            <span>{{ formatDate(post.publishTime) }}</span>
            <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>{{ post.category || 'General' }}</span>
          </div>
          
          <h3 class="text-xl md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
            {{ post.title }}
          </h3>
          
          <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {{ post.summary }}
          </p>

          <div class="flex items-center gap-4 pt-2">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <Eye class="w-3 h-3" />
              <span>{{ post.viewCount }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors" @click.stop="handleLike(post.id)">
              <ThumbsUp class="w-3 h-3" />
              <span>{{ post.likeCount }}</span>
            </div>
            
            <!-- Delete Button (Only in Edit Mode) -->
            <button 
              v-if="isEditing"
              @click.stop="handleDelete(post.id)"
              class="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 transition-colors ml-4"
              title="Delete Article"
            >
              <Trash2 class="w-3 h-3" />
              <span>Delete</span>
            </button>

            <div class="flex gap-2 ml-auto">
              <span v-for="tag in (post.tags || [])" :key="tag" class="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/5">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
    
    <div v-if="loading" class="text-center py-12 text-gray-500">
      Loading articles...
    </div>
    
    <div v-if="!loading && posts.length === 0" class="text-center py-12 text-gray-500">
      No articles found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Eye, ThumbsUp, Trash2 } from 'lucide-vue-next'
import { articleApi, type Article } from '../api'

const props = defineProps<{
  isEditing?: boolean
}>()

const posts = ref<Article[]>([])
const loading = ref(false)

const fetchPosts = async () => {
  loading.value = true
  try {
    const { data } = await articleApi.getAll()
    if (data.articles && data.articles.length > 0) {
      posts.value = data.articles
    } else {
      // Fallback data if API returns empty
      posts.value = [
        {
          id: 1,
          title: '深入理解 Vue 3 响应式原理与 Proxy',
          content: '...',
          summary: '本文将深入源码，探讨 Vue 3 如何利用 ES6 Proxy 实现高效的响应式系统，对比 Vue 2 Object.defineProperty 的局限性。',
          publishTime: '2023-12-10T10:00:00',
          category: 'Frontend',
          viewCount: 1205,
          likeCount: 45,
          tags: ['Vue3', 'Source Code'],
          status: 'published',
          commentCount: 0
        },
        {
          id: 2,
          title: 'Spring Boot 3 + GraalVM Native Image 实战',
          content: '...',
          summary: '如何将 Spring Boot 应用编译为原生镜像，实现毫秒级启动与极低内存占用。包含踩坑记录与性能对比。',
          publishTime: '2023-11-28T14:30:00',
          category: 'Backend',
          viewCount: 892,
          likeCount: 32,
          tags: ['Java', 'GraalVM'],
          status: 'published',
          commentCount: 0
        }
      ]
    }
  } catch (e) {
    console.error('Failed to fetch articles', e)
  } finally {
    loading.value = false
  }
}

const handleLike = async (id: number) => {
  try {
    await articleApi.like(id)
    const post = posts.value.find(p => p.id === id)
    if (post) {
      post.likeCount++
    }
  } catch (e) {
    console.error('Failed to like article', e)
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这篇文章吗？此操作无法撤销。')) return
  
  try {
    await articleApi.delete(id)
    posts.value = posts.value.filter(p => p.id !== id)
  } catch (e) {
    console.error('Failed to delete article', e)
    alert('删除失败，请重试')
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchPosts()
})
</script>
