const blockedTags = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'base',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
]

const blockedTagPattern = new RegExp(
  `<\\s*(${blockedTags.join('|')})\\b[\\s\\S]*?<\\/\\s*\\1\\s*>`,
  'gi',
)
const blockedSingleTagPattern = new RegExp(`<\\s*\\/?\\s*(${blockedTags.join('|')})\\b[^>]*>`, 'gi')
const eventAttributePattern = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const dangerousUrlPattern =
  /\s+(href|src|xlink:href)\s*=\s*(?:"\s*(?:javascript:|vbscript:|data:text\/html)[^"]*"|'\s*(?:javascript:|vbscript:|data:text\/html)[^']*'|(?:javascript:|vbscript:|data:text\/html)[^\s>]*)/gi
const removableElementTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'BASE'])
const allowedTags = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CODE',
  'DEL',
  'DIV',
  'EM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HR',
  'I',
  'IMG',
  'LI',
  'OL',
  'P',
  'PRE',
  'S',
  'SPAN',
  'STRONG',
  'TABLE',
  'TBODY',
  'TD',
  'TH',
  'THEAD',
  'TR',
  'U',
  'UL',
])
const globalAttributes = new Set(['class', 'title'])
const tagAttributes: Record<string, Set<string>> = {
  A: new Set(['href', 'target', 'rel']),
  IMG: new Set(['src', 'alt', 'width', 'height', 'loading']),
}
const safeUrlPattern = /^(https?:|mailto:|\/|#)/i

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  if (typeof document === 'undefined') return sanitizeHtmlWithPatterns(html)

  const template = document.createElement('template')
  template.innerHTML = html
  sanitizeNode(template.content)
  return template.innerHTML
}

function sanitizeHtmlWithPatterns(html: string): string {
  return html
    .replace(blockedTagPattern, '')
    .replace(blockedSingleTagPattern, '')
    .replace(eventAttributePattern, '')
    .replace(dangerousUrlPattern, '')
}

function sanitizeNode(parent: Node) {
  for (const child of Array.from(parent.childNodes)) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue

    const element = child as HTMLElement
    const tagName = element.tagName

    if (removableElementTags.has(tagName)) {
      element.remove()
      continue
    }

    if (!allowedTags.has(tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      sanitizeNode(parent)
      continue
    }

    sanitizeAttributes(element)
    sanitizeNode(element)
  }
}

function sanitizeAttributes(element: HTMLElement) {
  const allowedForTag = tagAttributes[element.tagName] || new Set<string>()

  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase()
    const isAllowed = globalAttributes.has(name) || allowedForTag.has(attribute.name.toLowerCase())
    const isEvent = name.startsWith('on')
    const isUnsafeUrl = (name === 'href' || name === 'src') && !safeUrlPattern.test(attribute.value)

    if (!isAllowed || isEvent || isUnsafeUrl) {
      element.removeAttribute(attribute.name)
    }
  }

  if (element.tagName === 'A' && element.getAttribute('href')) {
    element.setAttribute('rel', 'noopener noreferrer')
    element.setAttribute('target', '_blank')
  }

  if (element.tagName === 'IMG') {
    element.setAttribute('loading', 'lazy')
  }
}
