---
name: cheat-sheet-design
description: >
  치트시트 웹 페이지 디자인 스킬. 탭 기반 카테고리 네비게이션, 키캡 스타일 단축키, 카드 레이아웃,
  물음표 툴팁이 있는 인터랙티브 치트시트를 생성한다. "치트시트 만들어", "cheat sheet",
  "단축키 페이지", "레퍼런스 카드" 요청 시 사용.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---

# Cheat Sheet Design Skill

개발 도구, 라이브러리, 프레임워크 등의 **인터랙티브 치트시트 웹 페이지**를 생성하는 스킬.
`/Users/happyhsryu/dev/personal/hsryuuu_github_io/cheatsheets/` 디렉토리에 배포된다.

## 참조 구현

실제 동작하는 참조 구현:
- **HTML**: `/Users/happyhsryu/dev/personal/hsryuuu_github_io/cheatsheets/claude-code.html`
- **CSS**: `/Users/happyhsryu/dev/personal/hsryuuu_github_io/cheatsheets/claude-code.css`

새 치트시트 제작 시 반드시 이 파일들을 읽고 구조와 패턴을 참조할 것.

## 디자인 시스템

### 색상 토큰 (CSS Custom Properties)

모든 치트시트는 공통 다크 테마를 사용한다. 주제별 accent 색상만 변경 가능.

```css
:root {
  /* Backgrounds */
  --bg-deep: #08090c;      /* 페이지 배경 */
  --bg-card: #151820;      /* 카드 배경 */
  --bg-card-hover: #1a1f2b;
  --bg-tab: #12151d;
  --bg-tab-active: #1c2232;

  /* Borders */
  --border: #1e2335;
  --border-hover: #2d3450;

  /* Accent — 주제별로 변경 가능 */
  --accent: #e8a44a;       /* 주요 강조색 */
  --accent-dim: #c4883a;
  --accent-glow: rgba(232, 164, 74, 0.08);
  --accent-blue: #5b8dd9;  /* 섹션 제목 */
  --accent-green: #5ec269; /* NEW 배지 */

  /* Text */
  --text: #c8cdd8;         /* 본문 */
  --text-dim: #8990ab;     /* 보조 (≥5:1 대비율) */
  --text-bright: #edf0f7;  /* 강조 */

  /* Keycap */
  --key-bg: #1a1f2e;
  --key-border: #2a3148;
  --key-text: #d0d6e4;

  /* Tooltip */
  --tooltip-bg: #1c2133;
}
```

### 타이포그래피

| 용도 | 폰트 | 비고 |
|------|------|------|
| 제목 / 키캡 / 코드 | `JetBrains Mono` | monospace, 600–800 weight |
| 본문 / UI | `Pretendard` | 한국어 지원 sans-serif |

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 최소 폰트 크기

- 본문: `0.82rem` (≈13px)
- 키캡/섹션 제목: `0.75rem` (12px) — 이보다 작으면 안 됨
- 배지: `0.65rem` (≈10.4px) — 예외적 최소값

## 페이지 구조

### HTML 시맨틱 구조

```
<body>
  <a class="skip-link">본문으로 건너뛰기</a>     ← 접근성
  <header class="header">                        ← 제목 + 참조 링크
  <div class="search-bar">                       ← 전역 검색
  <nav class="tabs-wrapper" aria-label="...">    ← 탭 네비게이션 (sticky)
    <div role="tablist">
      <button role="tab" aria-selected aria-controls>
  <main class="content-area" id="main-content">  ← 탭 패널들
    <div class="tab-panel" role="tabpanel">
      <div class="section-group">
        <div class="section-title">              ← 소제목
        <div class="cards">                      ← 카드 그리드
          <div class="card">
  <footer>
```

### 카드 구조 (핵심 패턴)

각 항목은 2행 카드로 구성된다:
- **1행**: 왼쪽에 키/명령어, 오른쪽에 `?` 버튼
- **2행**: 간단한 한국어 설명

```html
<div class="card" data-search="검색용 키워드들">
  <div class="card-header">
    <div class="card-keys">
      <div class="key-combo">
        <kbd>Ctrl</kbd><span class="key-plus">+</span><kbd>C</kbd>
      </div>
    </div>
    <button class="help-btn" aria-label="상세 설명 보기">?</button>
    <div class="tooltip">마우스 오버 시 표시되는 상세 한국어 설명</div>
  </div>
  <div class="card-body">
    <span class="card-desc">간단 설명 <span class="card-badge">NEW</span></span>
  </div>
</div>
```

### 키캡 스타일 변형

| 유형 | 클래스 | 용도 |
|------|--------|------|
| 기본 키캡 | `<kbd>` | 단일 키 (Ctrl, A, Esc) |
| 넓은 키캡 | `<kbd class="wide">` | 긴 텍스트 키 (Enter, Space) |
| 명령어 키캡 | `<kbd class="cmd">` | 슬래시 명령, CLI 플래그 |
| 명령어+넓음 | `<kbd class="cmd wide">` | 긴 명령어 (/compact, --worktree) |

### 키 조합 표기법

```html
<!-- 단일 키 -->
<kbd>A</kbd>

<!-- 조합 키 -->
<div class="key-combo">
  <kbd>Ctrl</kbd><span class="key-plus">+</span><kbd>C</kbd>
</div>

<!-- 연속 키 (Esc × 2) -->
<div class="key-combo">
  <kbd>Esc</kbd><span class="key-plus">×</span><kbd>2</kbd>
</div>

<!-- 슬래시 명령 -->
<kbd class="cmd wide">/compact</kbd>

<!-- CLI 플래그 -->
<kbd class="cmd wide">--worktree name</kbd>
```

### 배지

```html
<span class="card-badge">NEW</span>
<span class="card-badge danger">위험</span>
```

### 노트 카드 (전체 너비 안내)

```html
<div class="card note-card" data-search="...">
  <div class="card-body">
    <span class="card-desc">안내 메시지</span>
  </div>
</div>
```

## 탭 구성

탭은 치트시트 주제에 맞게 6–10개로 구성. 각 탭에 아이콘(유니코드 문자) + 한국어 라벨.

```html
<button class="tab active" data-tab="ID" role="tab"
        aria-selected="true" aria-controls="panel-ID">
  <span class="tab-icon" aria-hidden="true">⌨</span>탭 이름
</button>
```

탭 전환 시 JavaScript에서 `aria-selected` 업데이트 필수.

## 검색 기능

모든 카드의 `data-search` 속성에 검색 키워드를 포함한다:
- 한국어 + 영어 키워드 모두 포함
- 명령어/단축키 원문 포함
- 공백으로 구분된 AND 검색

```html
<div class="card" data-search="ctrl c 취소 입력 생성 cancel">
```

검색 시 모든 탭 패널이 열리고, 매칭되지 않는 카드와 빈 섹션은 숨겨진다.

## 접근성 체크리스트

새 치트시트 생성 시 반드시 확인:

- [ ] `<a class="skip-link">` — 본문 건너뛰기 링크
- [ ] `<label class="sr-only">` — 검색 input에 숨김 라벨
- [ ] `role="tablist/tab/tabpanel"` — 탭 ARIA 역할
- [ ] `aria-selected` — 활성 탭 표시 (JS에서 동적 업데이트)
- [ ] `aria-controls` — 탭 → 패널 연결
- [ ] `aria-label="상세 설명 보기"` — 모든 `?` 버튼
- [ ] `aria-hidden="true"` — 장식용 아이콘 (탭 아이콘, SVG)
- [ ] `aria-live="polite"` — 검색 결과 카운트
- [ ] `rel="noopener"` — 모든 `target="_blank"` 링크
- [ ] `:focus-visible` — 모든 인터랙티브 요소 (탭, 버튼, 링크, input)
- [ ] `::before` 터치 타겟 확장 — `?` 버튼 (24px 시각 + 44px 터치)
- [ ] 시맨틱 태그 — `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] `--text-dim` 대비율 ≥ 5:1
- [ ] 최소 font-size `0.75rem` (12px)
- [ ] `type="search"` — 검색 input

## 반응형 & 인쇄

### 반응형 (≤640px)
- 카드 그리드 → 1열
- 탭 → 수평 스크롤
- 툴팁 → 화면 하단 fixed 위치

### 인쇄 (`@media print`)
- 배경 → 흰색
- 모든 탭 패널 → `display: block`
- 탭 바, 검색, 툴팁 버튼 → 숨김

## 새 치트시트 생성 워크플로

1. **참조 구현 읽기**: `claude-code.html`과 `claude-code.css`를 먼저 읽는다
2. **CSS 재사용**: `claude-code.css`를 복사하여 `{name}.css`로 만들고, accent 색상만 변경
3. **HTML 뼈대 작성**: 위 시맨틱 구조를 따라 탭과 카드 구성
4. **카드 작성 규칙**:
   - 1행: 키/명령어 (키캡 스타일) + `?` 버튼
   - 2행: 간단 한국어 설명 (1줄 이내)
   - 툴팁: 상세 한국어 설명 (2–3줄)
   - `data-search`: 한국어+영어 키워드
5. **접근성 체크리스트** 전체 확인
6. **index.html에 카드 추가**: 홈페이지 목록에 새 치트시트 링크 추가

## 파일 명명 규칙

```
cheatsheets/
├── {name}.html          ← 치트시트 HTML
├── {name}.css           ← 치트시트 CSS (분리 필수)
├── claude-code.html     ← 참조 구현
└── claude-code.css      ← 참조 CSS
```

## 콘텐츠 작성 원칙

- **설명은 한국어**로 작성 (기술 용어/코드는 원문 유지)
- **간단 설명**: 핵심만, 1줄, 동사형 종결 (예: "세션 종료", "컨텍스트 압축")
- **상세 설명 (툴팁)**: 어떤 상황에서 왜 유용한지, 관련 팁 포함, 2–3줄
- **NEW 배지**: 최신 버전에서 추가된 기능에만
- **danger 배지**: 위험한 옵션에만 (예: `--dangerously-skip-permissions`)
- **카테고리**: 기능별로 논리적 그룹핑, 탭 6–10개, 섹션 2–5개/탭
