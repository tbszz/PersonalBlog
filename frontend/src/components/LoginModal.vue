<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl transform transition-all">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">{{ t('login.title') }}</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">{{ t('login.email') }}</label>
          <input 
            v-model="email"
            type="email"
            class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
            :placeholder="t('login.emailPlaceholder')"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">{{ t('login.password') }}</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
            placeholder="••••••"
          />
        </div>
        
        <div v-if="error" class="text-red-400 text-sm text-center">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-white text-black font-bold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          :disabled="loading"
        >
          {{ loading ? t('login.submitting') : t('login.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authApi } from '../api'
import { t } from '../i18n'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'login-success'])

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const close = () => {
  emit('close')
  email.value = ''
  password.value = ''
  error.value = ''
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data } = await authApi.login(email.value, password.value)
    
    // Store user info
    localStorage.setItem('user', JSON.stringify(data))
    emit('login-success', data)
    close()
  } catch (e) {
    error.value = t('login.error')
  } finally {
    loading.value = false
  }
}
</script>

