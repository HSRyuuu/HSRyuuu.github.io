(function () {
  // --- CSS ---
  const style = document.createElement("style");
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
      width: min(280px, 90vw);
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
  const currentPage = path.split("/").pop().replace(".html", "");

  const isIndex = currentPage === 'index' || path.endsWith('/') || path === '';
  if (isIndex) return; // Don't inject sidebar on index page (it has its own panel)

  function markCurrent(name) {
    return currentPage === name ? "t-current" : "t-active";
  }

  // --- Prefix for links (are we in /cheatsheets/ ?) ---
  const inCheatsheets = path.includes("/cheatsheets/");
  const inLinks = path.includes("/links/");
  const inSub = inCheatsheets || inLinks;
  const pre = inSub ? "../" : "";
  const csPre = inCheatsheets
    ? ""
    : inLinks
      ? "../cheatsheets/"
      : "cheatsheets/";
  const lnkPre = inLinks ? "" : inCheatsheets ? "../links/" : "links/";

  // --- Toggle button ---
  const toggle = document.createElement("button");
  toggle.className = "sidebar-toggle";
  toggle.setAttribute("aria-label", "Site Map 열기");
  toggle.innerHTML = Icons.svg("hamburger");
  document.body.appendChild(toggle);

  // --- Overlay ---
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  // --- Panel ---
  const panel = document.createElement("aside");
  panel.className = "sidebar-panel";
  panel.innerHTML = `
    <div class="sp-header">
      <span class="sp-title">Site Map</span>
      <button class="sp-close" aria-label="사이드바 접기">
        ${Icons.svg("close-x")}
      </button>
    </div>
    <div class="sp-body">
      <div class="sp-tree">
        <a class="t-folder" href="${pre}index.html">hsryuuu.github.io/</a><br>
        ├── <span class="t-folder">cheatsheets/</span><br>
        │&nbsp;&nbsp; ├── <a class="${markCurrent("claude-code")}" href="${csPre}claude-code.html">claude-code</a> <span class="t-new">NEW</span><br>
        │&nbsp;&nbsp; ├── <a class="${markCurrent("git")}" href="${csPre}git.html">git</a> <span class="t-new">NEW</span><br>
        │&nbsp;&nbsp; └── <a class="${markCurrent("linux")}" href="${csPre}linux.html">linux</a><br>
        ├── <span class="t-folder">links/</span><br>
        │&nbsp;&nbsp; └── <a class="${markCurrent("ai")}" href="${lnkPre}ai.html">ai</a> <span class="t-new">NEW</span>      </div>
     
    </div>
    <div class="sp-footer">Last updated: Mar 2025</div>
  `;
  document.body.appendChild(panel);

  // --- Toggle behavior ---
  function openSidebar() {
    panel.classList.add("open");
    overlay.classList.add("open");
    toggle.classList.add("hidden");
  }
  function closeSidebar() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
    toggle.classList.remove("hidden");
  }

  toggle.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);
  panel.querySelector(".sp-close").addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      closeSidebar();
    }
  });
})();
