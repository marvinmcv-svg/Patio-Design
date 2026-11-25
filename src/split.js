// Split text into spans for letter / word animation. Gradient is applied per .char in CSS.
export function splitChars(el) {
  if (!el || el.dataset.split) return el ? [...el.querySelectorAll('.char')] : []
  el.dataset.split = '1'
  const walk = (node) => {
    ;[...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((word) => {
          if (!word) return
          if (/^\s+$/.test(word)) return frag.append(document.createTextNode(' '))
          const w = document.createElement('span')
          w.className = 'word'
          ;[...word].forEach((c) => {
            const s = document.createElement('span')
            s.className = 'char'
            s.textContent = c
            w.append(s)
          })
          frag.append(w)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1) walk(n)
    })
  }
  walk(el)
  el.setAttribute('aria-label', el.textContent)
  return [...el.querySelectorAll('.char')]
}

export function splitWords(el) {
  if (!el || el.dataset.split) return el ? [...el.querySelectorAll('.w')] : []
  el.dataset.split = '1'
  el.innerHTML = el.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="w">${w}</span>`)
    .join(' ')
  return [...el.querySelectorAll('.w')]
}
