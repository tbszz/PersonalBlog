import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export interface User {
  id: number
  username: string
  nickname?: string
  avatar?: string
  role: string
  profileJson?: string
  token?: string
}

export interface GalleryItem {
  id: number
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  description: string
  width?: number
  height?: number
  createdAt: string
}

export interface Article {
  id: number
  title: string
  content: string
  summary: string
  coverImage?: string
  status: string
  publishTime: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags?: string[]
  category?: string
}

export const userApi = {
  getProfile: (username: string) => api.get<User>(`/users/profile/${username}`),
  updateProfile: (id: number, data: Partial<User>) => api.put<User>(`/users/${id}/profile`, data)
}

export const galleryApi = {
  getAll: () => api.get<GalleryItem[]>('/gallery'),
  create: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => api.post('/gallery', item),
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export const articleApi = {
  getAll: (page = 1, size = 10) => api.get<{ articles: Article[], total: number }>('/articles', { params: { page, size } }),
  getOne: (id: number) => api.get<Article>(`/articles/${id}`),
  create: (article: Partial<Article>) => api.post('/articles', article),
  delete: (id: number) => api.delete(`/articles/${id}`),
  like: (id: number) => api.post(`/articles/${id}/like`)
}

export default api
