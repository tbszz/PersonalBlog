import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultProfileSocials, normalizeProfileSocials } from '../src/utils/profileSocials.js'

test('default profile socials replace Bilibili with Bonjour and X links', () => {
  assert.deepEqual(
    defaultProfileSocials.map(social => social.name),
    ['Github', 'Bonjour', 'Wechat', 'X'],
  )
  assert.equal(defaultProfileSocials.some(social => social.name === 'Bilibili'), false)
  assert.equal(defaultProfileSocials.some(social => social.url.includes('bilibili.com')), false)
  assert.equal(defaultProfileSocials.find(social => social.name === 'Bonjour')?.url, 'https://bonjour.bio/8q8j3x')
  assert.equal(defaultProfileSocials.find(social => social.name === 'X')?.url, 'https://x.com/Zihan_dev')
  assert.equal(defaultProfileSocials.find(social => social.name === 'X')?.icon, 'X')
})

test('profile socials are normalized when cached data contains legacy Bilibili links', () => {
  const profile = {
    nickname: '邹子',
    socials: [
      { name: 'Github', icon: 'Github', url: 'https://github.com/tbszz' },
      { name: 'Bilibili', icon: 'Tv', url: 'https://space.bilibili.com/' },
      { name: 'Wechat', icon: 'Wechat', url: '#' },
    ],
  }

  const normalized = normalizeProfileSocials(profile)

  assert.deepEqual(
    normalized.socials.map(social => social.name),
    ['Github', 'Bonjour', 'Wechat', 'X'],
  )
  assert.equal(normalized.socials.some(social => social.url.includes('bilibili.com')), false)
  assert.equal(normalized.socials.find(social => social.name === 'X')?.icon, 'X')
})
