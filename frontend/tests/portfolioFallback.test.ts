import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defaultPortfolioItems } from '../src/data/portfolioSeed.js'
import { hasCjk, hasCompleteEnglishBackup, localizePortfolioItem } from '../src/utils/contentLocalization.js'

test('default portfolio seed contains six polished published projects', () => {
  assert.equal(defaultPortfolioItems.length, 6)
  assert.equal(defaultPortfolioItems.every(item => item.status === 'published'), true)
  assert.equal(defaultPortfolioItems.every(item => item.featured), true)
})

test('default portfolio seed has complete English backups', () => {
  for (const item of defaultPortfolioItems) {
    assert.equal(
      hasCompleteEnglishBackup(
        { title: item.title, description: item.description, tags: item.tags },
        item.translations,
      ),
      true,
      item.title,
    )
  }
})

test('default portfolio seed uses portfolio PDF projects with covers', () => {
  const titles = defaultPortfolioItems.map(item => item.title)

  assert.deepEqual(titles, [
    'PPTSight 企业文档结构化检索与问答系统',
    'Resume Protocol AI 求职资料与岗位雷达',
    'AceMode 全球华人 AI 生产力社区',
    'OpenClaw 多 Agent 控制台',
    'HyperFarming 智慧农业管理平台',
    '自动化视频剪辑工具',
  ])
  assert.equal(defaultPortfolioItems.every(item => item.coverImage?.startsWith('/portfolio/')), true)
  assert.equal(titles.some(title => title.includes('XianyuAutoAgent')), false)
  assert.equal(titles.some(title => title.includes('VoiceBridge')), false)
})

test('default portfolio seed localizes to English without Chinese text', () => {
  for (const item of defaultPortfolioItems) {
    const localized = localizePortfolioItem(item, 'en') as typeof item
    assert.equal(hasCjk(localized.title), false, localized.title)
    assert.equal(hasCjk(localized.description), false, localized.description)
    assert.equal(localized.tags?.some(hasCjk), false, localized.tags?.join(', '))
  }
})

test('portfolio cover images are shown without cropping', () => {
  const component = readFileSync(resolve(process.cwd(), 'src/components/PortfolioGrid.vue'), 'utf8')

  assert.match(component, /object-contain/)
  assert.doesNotMatch(component, /coverImage[\s\S]*object-cover/)
})
