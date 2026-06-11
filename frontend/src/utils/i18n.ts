export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]
export type TranslationKey = keyof typeof translations.zh

export const defaultLocale: Locale = 'zh'

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
}

type ProfileBio = {
  who?: string
  what?: string
  attitude?: string
}

type ProfileTag = {
  text: string
  style?: string
}

export type LocalizableProfile = {
  nickname?: string
  slogan?: string
  subSlogan?: string
  bio?: ProfileBio
  tags?: ProfileTag[]
  techStack?: string[]
  locales?: Partial<Record<Locale, Partial<LocalizableProfile>>>
  i18n?: Partial<Record<Locale, Partial<LocalizableProfile>>>
}

const profileTextTranslations: Record<string, string> = {
  '邹子': 'Zouzi',
  '囿于昼夜': 'Bound by Day and Night',
  '流浪于山川湖海，囿于昼夜厨房与爱': 'Wandering through mountains, rivers, lakes, and seas; held by day, night, kitchens, and love.',
  '建筑学生 / 前端开发者 / 设计爱好者': 'Architecture student / Frontend developer / Design enthusiast',
  '热衷于用代码构建具有东方美学的数字空间，探索技术与人文的交界。': 'I build digital spaces with Eastern aesthetics through code, exploring where technology and the humanities meet.',
  '保持热爱，奔赴山海。': 'Stay passionate and keep moving toward vast horizons.',
  '建筑设计': 'Architecture Design',
  '东方美学': 'Eastern Aesthetics',
  '前端开发': 'Frontend Development',
  '摄影': 'Photography',
  '设计': 'Design',
  '代码': 'Code',
}

export const translations = {
  zh: {
    'brand.name': '邹子',
    'nav.home': '首页',
    'nav.blog': '文章列表',
    'nav.portfolio': '作品集',
    'nav.gallery': '相册',
    'nav.about': '关于',
    'nav.connect': '联系我',
    'nav.adminLogin': '管理员登录',
    'nav.logout': '退出登录',
    'nav.viewMode': '查看模式',
    'nav.editProfile': '编辑资料',
    'nav.theme': '切换主题',
    'nav.language': '切换语言',
    'toolbar.writeArticle': '写文章',
    'toolbar.uploadAlbum': '上传相册',
    'toolbar.addPortfolio': '添加作品',
    'profile.articles': '文章',
    'profile.albums': '相册',
    'profile.years': '年',
    'profile.techStack': '技术栈',
    'profile.saveChanges': '保存修改',
    'profile.loading': '加载中...',
    'profile.placeholder': '未填写',
    'profile.saveFailed': '保存失败，请重试',
    'blog.general': '默认分类',
    'blog.loading': '正在加载文章...',
    'blog.empty': '还没有文章。',
    'blog.loadingDetail': '正在加载文章内容...',
    'blog.emptyContent': '暂无内容',
    'blog.loadFailed': '加载失败，请重试',
    'blog.collapseArticle': '收起文章',
    'blog.collapse': '收起',
    'blog.expand': '展开阅读',
    'blog.delete': '删除',
    'blog.deleteTitle': '删除文章',
    'blog.deleteConfirm': '确定要删除这篇文章吗？此操作无法撤销。',
    'blog.deleteFailed': '删除失败，请重试',
    'portfolio.loading': '正在加载作品...',
    'portfolio.empty': '还没有作品。',
    'portfolio.visit': '查看作品',
    'portfolio.source': '源码',
    'portfolio.delete': '删除',
    'portfolio.deleteTitle': '删除作品',
    'portfolio.deleteConfirm': '确定要删除这个作品吗？此操作无法撤销。',
    'portfolio.deleteFailed': '删除失败，请重试',
    'portfolio.featured': '精选',
    'portfolio.status.draft': '草稿',
    'portfolio.modalTitle': '添加作品',
    'portfolio.title': '作品标题',
    'portfolio.description': '作品描述',
    'portfolio.englishBackup': '英文备份',
    'portfolio.englishTitle': '英文标题',
    'portfolio.englishDescription': '英文描述',
    'portfolio.englishTags': '英文标签',
    'portfolio.projectUrl': '作品链接',
    'portfolio.sourceUrl': '源码链接',
    'portfolio.coverImage': '封面图',
    'portfolio.tags': '标签',
    'portfolio.tagsHint': '多个标签用英文逗号分隔',
    'portfolio.sortOrder': '排序',
    'portfolio.featuredInput': '设为精选作品',
    'portfolio.uploadCover': '上传封面',
    'portfolio.uploadingCover': '正在上传封面...',
    'portfolio.save': '保存作品',
    'portfolio.saving': '正在保存...',
    'portfolio.createFailed': '保存失败，请重试',
    'gallery.type': '类型',
    'gallery.image': '图片',
    'gallery.video': '视频',
    'gallery.file': '文件',
    'gallery.clickToUpload': '点击上传或拖拽文件到这里',
    'gallery.supports': '支持 JPG、PNG、MP4',
    'gallery.description': '描述',
    'gallery.descriptionPlaceholder': '一句简短描述...',
    'gallery.englishDescription': '英文描述',
    'gallery.englishDescriptionPlaceholder': 'English description...',
    'gallery.cancel': '取消',
    'gallery.upload': '上传',
    'gallery.uploading': '正在上传...',
    'gallery.uploadTitle': '上传到相册',
    'gallery.optimizing': '正在优化图片...',
    'gallery.uploadingVideo': '正在上传视频...',
    'gallery.saving': '正在保存相册项...',
    'gallery.optimizedPrefix': '已优化',
    'gallery.optimizedMiddle': '至',
    'gallery.deleteTitle': '删除',
    'gallery.deleteConfirm': '确定要删除这张图片/视频吗？',
    'gallery.deleteFailed': '删除失败，请重试',
    'gallery.uploadFailed': '文件上传失败',
    'login.title': '管理员登录',
    'login.email': '邮箱',
    'login.emailPlaceholder': 'admin@example.com',
    'login.password': '密码',
    'login.submit': '登录',
    'login.submitting': '正在登录...',
    'login.error': '邮箱或密码不正确',
    'article.writeTitle': '写文章',
    'article.title': '标题',
    'article.titlePlaceholder': '请输入文章标题...',
    'article.summary': '摘要',
    'article.summaryPlaceholder': '简短的摘要描述...',
    'article.englishBackup': '英文备份',
    'article.englishTitle': '英文标题',
    'article.englishTitlePlaceholder': 'English article title...',
    'article.englishSummary': '英文摘要',
    'article.englishSummaryPlaceholder': 'English summary...',
    'article.englishContent': '英文正文',
    'article.englishContentPlaceholder': '# Start writing in English...',
    'article.insertImage': '插入图片',
    'article.uploadImage': '上传图片',
    'article.optimizingImage': '正在压缩图片...',
    'article.insertingImage': '正在插入正文...',
    'article.imageOptimized': '图片已压缩，正在插入正文...',
    'article.insertIntoContent': '插入到正文',
    'article.imageHint': '提示：上传图片后，点击图片可将链接插入到正文中',
    'article.imageAlt': '图片',
    'article.content': '正文',
    'article.contentPlaceholder': '# 开始撰写...\n\n支持插入图片链接，格式：![图片描述](图片URL)',
    'article.cancel': '取消',
    'article.publish': '发布文章',
    'article.uploadFailed': '图片上传失败，请重试',
    'article.publishFailed': '发布失败，请重试',
    'wechat.title': '微信联系',
    'wechat.empty': '暂无二维码',
    'wechat.changeImage': '点击更换图片',
    'wechat.hint': '扫一扫上方的二维码添加微信',
    'wechat.alt': '微信二维码',
  },
  en: {
    'brand.name': 'Zouzi',
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.portfolio': 'Portfolio',
    'nav.gallery': 'Album',
    'nav.about': 'About',
    'nav.connect': 'Contact',
    'nav.adminLogin': 'Admin login',
    'nav.logout': 'Log out',
    'nav.viewMode': 'View mode',
    'nav.editProfile': 'Edit profile',
    'nav.theme': 'Switch theme',
    'nav.language': 'Switch language',
    'toolbar.writeArticle': 'Write article',
    'toolbar.uploadAlbum': 'Upload album',
    'toolbar.addPortfolio': 'Add work',
    'profile.articles': 'Articles',
    'profile.albums': 'Albums',
    'profile.years': 'Years',
    'profile.techStack': 'Tech stack',
    'profile.saveChanges': 'Save changes',
    'profile.loading': 'Loading...',
    'profile.placeholder': 'Not set',
    'profile.saveFailed': 'Failed to save. Please retry.',
    'blog.general': 'General',
    'blog.loading': 'Loading articles...',
    'blog.empty': 'No articles found.',
    'blog.loadingDetail': 'Loading article...',
    'blog.emptyContent': 'No content yet',
    'blog.loadFailed': 'Failed to load. Please retry.',
    'blog.collapseArticle': 'Collapse article',
    'blog.collapse': 'Collapse',
    'blog.expand': 'Read more',
    'blog.delete': 'Delete',
    'blog.deleteTitle': 'Delete article',
    'blog.deleteConfirm': 'Delete this article? This cannot be undone.',
    'blog.deleteFailed': 'Delete failed. Please retry.',
    'portfolio.loading': 'Loading portfolio...',
    'portfolio.empty': 'No portfolio items yet.',
    'portfolio.visit': 'View work',
    'portfolio.source': 'Source',
    'portfolio.delete': 'Delete',
    'portfolio.deleteTitle': 'Delete work',
    'portfolio.deleteConfirm': 'Delete this portfolio item? This cannot be undone.',
    'portfolio.deleteFailed': 'Delete failed. Please retry.',
    'portfolio.featured': 'Featured',
    'portfolio.status.draft': 'Draft',
    'portfolio.modalTitle': 'Add portfolio item',
    'portfolio.title': 'Title',
    'portfolio.description': 'Description',
    'portfolio.englishBackup': 'English backup',
    'portfolio.englishTitle': 'English title',
    'portfolio.englishDescription': 'English description',
    'portfolio.englishTags': 'English tags',
    'portfolio.projectUrl': 'Project URL',
    'portfolio.sourceUrl': 'Source URL',
    'portfolio.coverImage': 'Cover image',
    'portfolio.tags': 'Tags',
    'portfolio.tagsHint': 'Separate tags with commas',
    'portfolio.sortOrder': 'Sort order',
    'portfolio.featuredInput': 'Mark as featured',
    'portfolio.uploadCover': 'Upload cover',
    'portfolio.uploadingCover': 'Uploading cover...',
    'portfolio.save': 'Save work',
    'portfolio.saving': 'Saving...',
    'portfolio.createFailed': 'Save failed. Please retry.',
    'gallery.type': 'Type',
    'gallery.image': 'Image',
    'gallery.video': 'Video',
    'gallery.file': 'File',
    'gallery.clickToUpload': 'Click to upload or drag and drop',
    'gallery.supports': 'Supports JPG, PNG, MP4',
    'gallery.description': 'Description',
    'gallery.descriptionPlaceholder': 'A short description...',
    'gallery.englishDescription': 'English description',
    'gallery.englishDescriptionPlaceholder': 'English description...',
    'gallery.cancel': 'Cancel',
    'gallery.upload': 'Upload',
    'gallery.uploading': 'Uploading...',
    'gallery.uploadTitle': 'Upload to album',
    'gallery.optimizing': 'Optimizing image...',
    'gallery.uploadingVideo': 'Uploading video...',
    'gallery.saving': 'Saving album item...',
    'gallery.optimizedPrefix': 'Optimized',
    'gallery.optimizedMiddle': 'to',
    'gallery.deleteTitle': 'Delete',
    'gallery.deleteConfirm': 'Delete this image/video?',
    'gallery.deleteFailed': 'Delete failed. Please retry.',
    'gallery.uploadFailed': 'Failed to upload file',
    'login.title': 'Admin login',
    'login.email': 'Email',
    'login.emailPlaceholder': 'admin@example.com',
    'login.password': 'Password',
    'login.submit': 'Log in',
    'login.submitting': 'Logging in...',
    'login.error': 'Invalid email or password',
    'article.writeTitle': 'Write article',
    'article.title': 'Title',
    'article.titlePlaceholder': 'Enter article title...',
    'article.summary': 'Summary',
    'article.summaryPlaceholder': 'A short summary...',
    'article.englishBackup': 'English backup',
    'article.englishTitle': 'English title',
    'article.englishTitlePlaceholder': 'English article title...',
    'article.englishSummary': 'English summary',
    'article.englishSummaryPlaceholder': 'English summary...',
    'article.englishContent': 'English content',
    'article.englishContentPlaceholder': '# Start writing in English...',
    'article.insertImage': 'Insert image',
    'article.uploadImage': 'Upload image',
    'article.optimizingImage': 'Optimizing image...',
    'article.insertingImage': 'Inserting into content...',
    'article.imageOptimized': 'Image optimized, inserting into content...',
    'article.insertIntoContent': 'Insert into content',
    'article.imageHint': 'After upload, click an image to insert it into the article.',
    'article.imageAlt': 'Image',
    'article.content': 'Content',
    'article.contentPlaceholder': '# Start writing...\n\nImages are supported: ![Alt text](Image URL)',
    'article.cancel': 'Cancel',
    'article.publish': 'Publish article',
    'article.uploadFailed': 'Image upload failed. Please retry.',
    'article.publishFailed': 'Publish failed. Please retry.',
    'wechat.title': 'WeChat contact',
    'wechat.empty': 'No QR code yet',
    'wechat.changeImage': 'Click to replace image',
    'wechat.hint': 'Scan the QR code above to add me on WeChat.',
    'wechat.alt': 'WeChat QR code',
  },
} as const

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return defaultLocale
  const lower = value.toLowerCase()
  if (lower.startsWith('zh')) return 'zh'
  if (lower.startsWith('en')) return 'en'
  return defaultLocale
}

export function translate(key: string, locale: string | null | undefined): string {
  const normalized = normalizeLocale(locale)
  const byLocale = translations[normalized] as Record<string, string>
  const fallback = translations[defaultLocale] as Record<string, string>

  return byLocale[key] ?? fallback[key] ?? key
}

function localizeProfileText(value: string | undefined, locale: Locale): string | undefined {
  if (locale !== 'en' || !value) return value
  return profileTextTranslations[value] ?? value
}

function localizeTag(tag: ProfileTag, locale: Locale): ProfileTag {
  return {
    ...tag,
    text: localizeProfileText(tag.text, locale) ?? tag.text,
  }
}

export function localizeProfile<T extends LocalizableProfile>(profile: T, locale: string | null | undefined): T {
  const normalized = normalizeLocale(locale)
  if (normalized === defaultLocale) return profile

  const localizedProfile = profile.locales?.[normalized] ?? profile.i18n?.[normalized] ?? {}
  const localizedBio = localizedProfile.bio ?? {}

  return {
    ...profile,
    ...localizedProfile,
    nickname: localizedProfile.nickname ?? localizeProfileText(profile.nickname, normalized),
    slogan: localizedProfile.slogan ?? localizeProfileText(profile.slogan, normalized),
    subSlogan: localizedProfile.subSlogan ?? localizeProfileText(profile.subSlogan, normalized),
    bio: {
      ...profile.bio,
      ...localizedBio,
      who: localizedBio.who ?? localizeProfileText(profile.bio?.who, normalized),
      what: localizedBio.what ?? localizeProfileText(profile.bio?.what, normalized),
      attitude: localizedBio.attitude ?? localizeProfileText(profile.bio?.attitude, normalized),
    },
    tags: localizedProfile.tags ?? profile.tags?.map(tag => localizeTag(tag, normalized)),
    techStack: localizedProfile.techStack ?? profile.techStack,
  }
}
