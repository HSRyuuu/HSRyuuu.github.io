(function () {
  // --- CSS ---
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    /* Toggle button (collapsed state) */
    .sidebar-toggle {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 1000;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid #E2D8CC;
      background: #F3EDE4;
      color: #8A7D70;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sidebar-toggle:hover {
      border-color: #CFC2B2;
      color: #2C2420;
      background: #FFFFFF;
    }
    .sidebar-toggle svg { width: 18px; height: 18px; }
    .sidebar-toggle.hidden { display: none; }

    /* Overlay */
    .sidebar-overlay {
      position: fixed;
      inset: 0;
      background: rgba(44,36,32,0.3);
      z-index: 1001;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s;
    }
    .sidebar-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    /* Sidebar panel */
    .sidebar-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 280px;
      height: 100vh;
      background: #F3EDE4;
      border-left: 1px solid #E2D8CC;
      z-index: 1002;
      transform: translateX(100%);
      transition: transform 0.25s ease;
      display: flex;
      flex-direction: column;
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      overflow-y: auto;
    }
    .sidebar-panel.open { transform: translateX(0); }

    /* Panel header */
    .sp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #E2D8CC;
      flex-shrink: 0;
    }
    .sp-title {
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8A7D70;
    }
    .sp-close {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid #E2D8CC;
      background: transparent;
      color: #8A7D70;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s;
    }
    .sp-close:hover {
      border-color: #CFC2B2;
      color: #2C2420;
      background: #FFFFFF;
    }
    .sp-close svg { width: 14px; height: 14px; }

    /* Panel body */
    .sp-body { padding: 20px; flex: 1; }

    /* ASCII tree */
    .sp-tree {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      line-height: 1.85;
      color: #B8AEA0;
      margin-bottom: 28px;
    }
    .sp-tree a {
      color: inherit;
      text-decoration: none;
      transition: color 0.15s;
      cursor: pointer;
    }
    .sp-tree a:hover { color: #2C2420; }
    .sp-tree .t-folder { color: #B8614E; font-weight: 500; }
    .sp-tree .t-active { color: #2D6356; }
    .sp-tree .t-current { color: #2C2420; font-weight: 600; }
    .sp-tree .t-new {
      font-size: 0.58rem; font-weight: 600;
      color: #2D6356;
      background: rgba(45,99,86,0.10);
      padding: 1px 4px; border-radius: 3px;
    }
    .sp-tree .t-wip {
      font-size: 0.58rem; font-weight: 600;
      color: #C4883A;
      background: rgba(196,136,58,0.10);
      padding: 1px 4px; border-radius: 3px;
    }

    /* Links section */
    .sp-links-title {
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8A7D70;
      margin-bottom: 12px;
    }
    .sp-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 0;
      font-size: 0.8rem;
      color: #8A7D70;
      text-decoration: none;
      transition: color 0.15s;
      cursor: pointer;
    }
    .sp-link:hover { color: #2C2420; }
    .sp-link svg { width: 14px; height: 14px; flex-shrink: 0; }

    /* Panel footer */
    .sp-footer {
      padding: 16px 20px;
      border-top: 1px solid #E2D8CC;
      font-size: 0.72rem;
      color: #B8AEA0;
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);

  // --- Detect current page ---
  const path = window.location.pathname;
  const currentPage = path.split('/').pop().replace('.html', '');

  function markCurrent(name) {
    return currentPage === name ? 't-current' : 't-active';
  }

  // --- Prefix for links (are we in /cheatsheets/ ?) ---
  const inSub = path.includes('/cheatsheets/');
  const pre = inSub ? '../' : '';
  const csPre = inSub ? '' : 'cheatsheets/';

  // --- Toggle button ---
  const toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.setAttribute('aria-label', 'Site Map 열기');
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  document.body.appendChild(toggle);

  // --- Overlay ---
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  // --- Panel ---
  const panel = document.createElement('aside');
  panel.className = 'sidebar-panel';
  panel.innerHTML = `
    <div class="sp-header">
      <span class="sp-title">Site Map</span>
      <button class="sp-close" aria-label="사이드바 접기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="sp-body">
      <div class="sp-tree">
        <a class="t-folder" href="${pre}index.html">hsryuuu.github.io/</a><br>
        ├── <span class="t-folder">cheatsheets/</span><br>
        │&nbsp;&nbsp; ├── <a class="${markCurrent('claude-code')}" href="${csPre}claude-code.html">claude-code</a> <span class="t-new">NEW</span><br>
        │&nbsp;&nbsp; ├── <a class="${markCurrent('git')}" href="${csPre}git.html">git</a> <span class="t-new">NEW</span><br>
        │&nbsp;&nbsp; ├── <a class="${markCurrent('linux')}" href="${csPre}linux.html">linux</a> <span class="t-new">NEW</span><br>
        │&nbsp;&nbsp; └── docker <span class="t-wip">SOON</span><br>
        ├── <span class="t-folder">projects/</span><br>
        │&nbsp;&nbsp; └── ...<br>
        └── <span class="t-folder">resources/</span><br>
        &nbsp;&nbsp;&nbsp; └── ...
      </div>
      <div class="sp-links-title">Links</div>
      <a class="sp-link" href="https://github.com/HSRyuuu" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
        github.com/HSRyuuu
      </a>
      <a class="sp-link" href="https://innovation123.tistory.com/" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Tistory Blog
      </a>
    </div>
    <div class="sp-footer">Last updated: Mar 2025</div>
  `;
  document.body.appendChild(panel);

  // --- Toggle behavior ---
  function openSidebar() {
    panel.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('hidden');
  }
  function closeSidebar() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('hidden');
  }

  toggle.addEventListener('click', openSidebar);
  overlay.addEventListener('click', closeSidebar);
  panel.querySelector('.sp-close').addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closeSidebar();
    }
  });
})();
