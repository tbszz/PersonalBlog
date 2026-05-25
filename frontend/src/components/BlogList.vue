<template>
  <div class="grid grid-cols-1 gap-6">
    <article 
      v-for="post in posts" 
      :key="post.id"
      class="group relative bg-neutral-900/30 border border-white/5 rounded-xl p-4 sm:p-6 md:p-8 hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
      :class="{ 'border-blue-500/30 bg-blue-500/5': expandedArticleId === post.id }"
      @click="toggleArticle(post.id)"
    >
      <div class="flex flex-col gap-4 sm:gap-6">
        <div class="space-y-3 flex-1">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 font-mono">
            <span>{{ formatDate(post.publishTime) }}</span>
            <span class="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></span>
            <span>{{ post.category || 'General' }}</span>
          </div>
          
          <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
            {{ post.title }}
          </h3>
          
          <!-- Summary (only when collapsed) -->
          <p v-if="expandedArticleId !== post.id" class="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {{ post.summary }}
          </p>

          <!-- Full Content (when expanded) -->
          <Transition name="expand">
            <div v-if="expandedArticleId === post.id" class="article-content">
              <div v-if="loadingDetail" class="text-center py-8 text-gray-500">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2" />
                正在加载文章内容...
              </div>
              <div v-else 
                   class="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300 leading-relaxed markdown-body"
                   v-html="renderMarkdown(expandedContent)"
              >
              </div>
              
              <!-- Close hint -->
              <div class="mt-6 pt-4 border-t border-white/10 text-center">
                <button 
                  @click.stop="expandedArticleId = null"
                  class="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
                >
                  <ChevronUp class="w-4 h-4" />
                  收起文章
                </button>
              </div>
            </div>
          </Transition>

          <div class="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <Eye class="w-3 h-3" />
              <span>{{ post.viewCount }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors" @click.stop="handleLike(post.id)">
              <ThumbsUp class="w-3 h-3" />
              <span>{{ post.likeCount }}</span>
            </div>
            
            <!-- Expand indicator -->
            <div class="flex items-center gap-1.5 text-xs text-blue-400 ml-2">
              <component :is="expandedArticleId === post.id ? ChevronUp : ChevronDown" class="w-3 h-3" />
              <span>{{ expandedArticleId === post.id ? '收起' : '展开阅读' }}</span>
            </div>
            
            <!-- Delete Button (Only in Edit Mode) -->
            <button 
              v-if="isEditing"
              @click.stop="handleDelete(post.id)"
              class="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 transition-colors ml-2 sm:ml-4"
              title="Delete Article"
            >
              <Trash2 class="w-3 h-3" />
              <span class="hidden sm:inline">Delete</span>
            </button>

            <div class="flex flex-wrap gap-2 ml-auto">
              <span v-for="tag in (post.tags || [])" :key="tag" class="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/5">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
    
    <div v-if="loading" class="text-center py-12 text-gray-500">
      <Loader2 class="w-8 h-8 animate-spin mx-auto mb-2" />
      Loading articles...
    </div>
    
    <div v-if="!loading && posts.length === 0" class="text-center py-12 text-gray-500">
      No articles found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Eye, ThumbsUp, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-vue-next'
import { articleApi, type Article } from '../api'
import { marked } from 'marked'
import { sanitizeHtml } from '../utils/sanitizeHtml'

const props = defineProps<{
  isEditing?: boolean
}>()

// Expanded article state
const expandedArticleId = ref<number | null>(null)
const expandedContent = ref('')
const loadingDetail = ref(false)
let articleRequestSeq = 0

const toggleArticle = async (id: number) => {
  if (expandedArticleId.value === id) {
    // Close if already expanded
    articleRequestSeq++
    expandedArticleId.value = null
    expandedContent.value = ''
    return
  }
  
  // Expand and fetch full content
  const requestSeq = ++articleRequestSeq
  expandedArticleId.value = id
  loadingDetail.value = true
  
  try {
    const { data } = await articleApi.getOne(id)
    if (requestSeq !== articleRequestSeq || expandedArticleId.value !== id) return
    expandedContent.value = data.content || '暂无内容'
  } catch (e) {
    if (requestSeq !== articleRequestSeq || expandedArticleId.value !== id) return
    console.error('Failed to fetch article detail', e)
    expandedContent.value = '加载失败，请重试'
  } finally {
    if (requestSeq === articleRequestSeq && expandedArticleId.value === id) {
      loadingDetail.value = false
    }
  }
}

const renderMarkdown = (content: string) => {
  if (!content) return ''
  return sanitizeHtml(marked.parse(content, { async: false }))
}

const posts = ref<Article[]>([])
const loading = ref(false)

const fetchPosts = async () => {
  loading.value = true
  try {
    const { data } = await articleApi.getAll()
    posts.value = data.articles || []
  } catch (e) {
    console.error('Failed to fetch articles', e)
  } finally {
    loading.value = false
  }
}

const prependArticle = (article: Article) => {
  posts.value = [article, ...posts.value.filter(post => post.id !== article.id)]
}

defineExpose({ prependArticle })

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

<style scoped>
/* Expand/Collapse animation */
.expand-enter-active {
  transition: all 0.4s ease-out;
}
.expand-leave-active {
  transition: all 0.3s ease-in;
}
.expand-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}

.article-content {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .article-content {
    font-size: 0.875rem;
    line-height: 1.625;
  }
}

/* Custom Markdown Styles */
:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1.5rem auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  display: block;
}

:deep(.markdown-body p) {
  margin-bottom: 1.25rem;
}

:deep(.markdown-body h1, .markdown-body h2, .markdown-body h3) {
  color: #fff;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
