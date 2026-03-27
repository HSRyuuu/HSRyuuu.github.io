/**
 * Site Icon Registry
 * 모든 SVG 아이콘을 한곳에서 관리합니다.
 *
 * 사용법:
 *   HTML:  <span data-icon="github"></span>
 *   JS:    Icons.svg('github')
 */
/* Inject layout-neutral style for icon placeholders */
const _iconStyle = document.createElement('style');
_iconStyle.textContent = '[data-icon]{display:contents}';
document.head.appendChild(_iconStyle);

const Icons = (() => {
  const defs = {
    // Navigation
    'back-arrow': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'arrow-up-right': '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
    'external-link': '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    'hamburger': '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    'close-x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',

    // Brands
    'github': { fill: true, d: '<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>' },

    // Content
    'blog': '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    'terminal-prompt': '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    'git-branch': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7"/><path d="M6 9v12"/>',
    'terminal': '<rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/>',
    'link-chain': '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
    'smiley': '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  };

  function svg(name, opts) {
    const def = defs[name];
    if (!def) return '';
    const isFilled = typeof def === 'object' && def.fill;
    const inner = isFilled ? def.d : def;
    const attrs = isFilled
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="2"';
    const extra = (opts && opts.ariaHidden !== false) ? ' aria-hidden="true"' : '';
    return `<svg viewBox="0 0 24 24" ${attrs}${extra}>${inner}</svg>`;
  }

  function init() {
    document.querySelectorAll('[data-icon]').forEach(el => {
      const name = el.getAttribute('data-icon');
      if (name && defs[name]) el.innerHTML = svg(name);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { svg, defs, init };
})();
