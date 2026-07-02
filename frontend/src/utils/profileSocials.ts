export type ProfileSocial = {
  name: string
  icon: string
  url: string
}

export const defaultProfileSocials: ProfileSocial[] = [
  { name: 'Github', icon: 'Github', url: 'https://github.com/tbszz' },
  { name: 'Bonjour', icon: 'Globe', url: 'https://bonjour.bio/8q8j3x' },
  { name: 'Wechat', icon: 'Wechat', url: '#' },
  { name: 'X', icon: 'X', url: 'https://x.com/Zihan_dev' },
]

export function getDefaultProfileSocials(): ProfileSocial[] {
  return defaultProfileSocials.map(social => ({ ...social }))
}

export function normalizeProfileSocials<T extends { socials?: ProfileSocial[] }>(profile: T): T & { socials: ProfileSocial[] } {
  return {
    ...profile,
    socials: getDefaultProfileSocials(),
  }
}
