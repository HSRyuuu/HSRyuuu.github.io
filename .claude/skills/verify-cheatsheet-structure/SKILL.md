---
name: verify-cheatsheet-structure
description: 치트시트 HTML/CSS 구조 일관성 및 접근성(ARIA, skip-link, 키보드) 검증. 치트시트 생성/수정 후 사용.
---

# verify-cheatsheet-structure

## Purpose

모든 치트시트가 공통 구조와 접근성 요구사항을 준수하는지 검증합니다:

1. **HTML 필수 요소** — skip-link, header, search bar, tabs, main content 구조
2. **접근성 (A11y)** — ARIA roles, labels, sr-only, focus 관련 속성
3. **CSS 토큰 일관성** — 필수 CSS custom properties가 모두 정의되어 있는지
4. **폰트 로딩** — JetBrains Mono + Pretendard가 올바르게 로드되는지
5. **외부 링크 보안** — `target="_blank"` 링크에 `rel="noopener"` 포함

## When to Run

- 새 치트시트를 생성한 후
- 기존 치트시트의 HTML 구조를 수정한 후
- 접근성 관련 요소(ARIA, 라벨 등)를 변경한 후
- CSS 파일의 변수 구조를 변경한 후

## Related Files

| File | Purpose |
|------|---------|
| `cheatsheets/claude-code.html` | 참조 구현 (HTML) |
| `cheatsheets/claude-code.css` | 참조 구현 (CSS) |
| `cheatsheets/git.html` | Git 치트시트 |
| `cheatsheets/git.css` | Git 스타일 |
| `cheatsheets/linux.html` | Linux 치트시트 |
| `cheatsheets/linux.css` | Linux 스타일 |
| `sidebar.js` | 공통 사이드바 (모든 치트시트에 삽입) |

## Workflow

모든 치트시트 HTML 파일(`cheatsheets/*.html`)에 대해 아래 검사를 반복합니다.

### Step 1: HTML 언어 속성

**도구:** Grep

```
pattern: <html lang="ko">
path: cheatsheets/{name}.html
```

**PASS:** `<html lang="ko">`가 존재
**FAIL:** lang 속성이 없거나 "ko"가 아닌 경우

### Step 2: Skip Link

**도구:** Grep

```
pattern: class="skip-link"
path: cheatsheets/{name}.html
```

`<a href="#main-content" class="skip-link">본문으로 건너뛰기</a>` 패턴이 존재해야 합니다.

**PASS:** skip-link가 존재하고 `#main-content`를 가리킴
**FAIL:** skip-link가 없거나 잘못된 target을 가리키는 경우

### Step 3: Header 구조

**도구:** Grep

```
pattern: class="back-link" href="\.\./index\.html"
path: cheatsheets/{name}.html
```

**PASS:** `../index.html`을 가리키는 back-link가 header 안에 존재
**FAIL:** back-link가 없거나 잘못된 경로를 가리키는 경우

### Step 4: 검색바 접근성

**도구:** Grep (각 패턴별)

```
pattern: <label for="searchInput" class="sr-only">
path: cheatsheets/{name}.html
```

```
pattern: type="search" id="searchInput"
path: cheatsheets/{name}.html
```

```
pattern: id="searchCount" aria-live="polite"
path: cheatsheets/{name}.html
```

**PASS:** 세 요소 모두 존재 (sr-only 라벨, search input, aria-live 카운트)
**FAIL:** 하나라도 누락된 경우

### Step 5: 탭 ARIA 구조

**도구:** Grep

```
pattern: role="tablist"
path: cheatsheets/{name}.html
```

```
pattern: role="tab".*aria-selected.*aria-controls
path: cheatsheets/{name}.html
```

```
pattern: role="tabpanel"
path: cheatsheets/{name}.html
```

추가로, `aria-controls="panel-{id}"` 값과 실제 `id="panel-{id}"` tabpanel이 매칭되는지 확인합니다.

**PASS:** tablist, tab(aria-selected + aria-controls), tabpanel 모두 존재하고 ID가 매칭
**FAIL:** ARIA role이 누락되거나 tab-panel ID가 불일치하는 경우

### Step 6: Main Content 영역

**도구:** Grep

```
pattern: id="main-content"
path: cheatsheets/{name}.html
```

**PASS:** `id="main-content"`가 존재 (skip-link의 target)
**FAIL:** 해당 ID가 없는 경우

### Step 7: 카드 data-search 속성

**도구:** Grep

```
pattern: class="card"
path: cheatsheets/{name}.html
output_mode: count
```

```
pattern: data-search=
path: cheatsheets/{name}.html
output_mode: count
```

card 수와 data-search 수를 비교합니다. (note-card 등 일부 카드는 예외 가능)

**PASS:** 대부분의 card에 data-search 속성이 존재
**FAIL:** data-search가 없는 card가 다수인 경우 (전체 card의 20% 이상 누락)

### Step 8: 도움말 버튼 접근성

**도구:** Grep

```
pattern: class="help-btn" aria-label=
path: cheatsheets/{name}.html
output_mode: count
```

**PASS:** help-btn에 aria-label이 존재
**FAIL:** aria-label이 없는 help-btn이 있는 경우

### Step 9: 외부 링크 보안

**도구:** Grep

```
pattern: target="_blank"
path: cheatsheets/{name}.html
output_mode: count
```

```
pattern: target="_blank".*rel="noopener"
path: cheatsheets/{name}.html
output_mode: count
```

두 카운트가 일치해야 합니다.

**PASS:** 모든 `target="_blank"` 링크에 `rel="noopener"` 포함
**FAIL:** `rel="noopener"`가 누락된 외부 링크가 있는 경우

### Step 10: Sidebar 스크립트 포함

**도구:** Grep

```
pattern: src="\.\./sidebar\.js"|src="sidebar\.js"
path: cheatsheets/{name}.html
```

**PASS:** sidebar.js 스크립트 태그가 존재
**FAIL:** sidebar.js가 포함되지 않은 경우

### Step 11: CSS 필수 토큰 검증

각 `cheatsheets/{name}.css` 파일에 대해 필수 CSS custom properties가 정의되어 있는지 확인합니다.

**도구:** Grep (각 토큰별)

필수 토큰 목록:
- `--bg-deep`, `--bg-base`, `--bg-card`, `--bg-card-hover`
- `--bg-tab`, `--bg-tab-active`
- `--border`, `--border-hover`
- `--accent`, `--accent-dim`, `--accent-glow`
- `--text`, `--text-dim`, `--text-bright`
- `--key-bg`, `--key-border`, `--key-text`
- `--tooltip-bg`
- `--radius`, `--radius-sm`

```
pattern: --bg-deep:
path: cheatsheets/{name}.css
```

(각 토큰에 대해 반복)

**PASS:** 모든 필수 토큰이 `:root`에 정의됨
**FAIL:** 하나 이상의 필수 토큰이 누락된 경우

### Step 12: 폰트 로딩

**도구:** Grep

```
pattern: JetBrains\+Mono.*Pretendard|Pretendard.*JetBrains\+Mono
path: cheatsheets/{name}.html
```

또는 개별 확인:

```
pattern: JetBrains.Mono
path: cheatsheets/{name}.html
```

```
pattern: Pretendard
path: cheatsheets/{name}.html
```

**PASS:** 두 폰트 모두 Google Fonts 링크에 포함
**FAIL:** 폰트가 누락된 경우

## Output Format

```markdown
### {name}.html 검증 결과

| # | 검사 항목 | 결과 | 상세 |
|---|-----------|------|------|
| 1 | HTML lang="ko" | PASS/FAIL | |
| 2 | Skip link | PASS/FAIL | |
| 3 | Header back-link | PASS/FAIL | |
| 4 | 검색바 접근성 | PASS/FAIL | 누락: [요소] |
| 5 | 탭 ARIA 구조 | PASS/FAIL | 누락: [역할] |
| 6 | Main content ID | PASS/FAIL | |
| 7 | Card data-search | PASS/FAIL | N/M cards |
| 8 | Help btn aria-label | PASS/FAIL | N개 누락 |
| 9 | 외부 링크 noopener | PASS/FAIL | N개 누락 |
| 10 | Sidebar.js 포함 | PASS/FAIL | |
| 11 | CSS 필수 토큰 | PASS/FAIL | 누락: [토큰] |
| 12 | 폰트 로딩 | PASS/FAIL | 누락: [폰트] |
```

## Exceptions

1. **index.html** — 메인 페이지는 치트시트가 아니므로 이 검증의 대상이 아님. 인라인 CSS 사용과 다른 변수 네이밍은 의도적 설계
2. **note-card** — `class="card note-card"` 카드는 data-search가 있어도 help-btn이 없을 수 있음 (안내 카드이므로 정상)
3. **CSS accent 값 차이** — `--accent` 계열 변수의 실제 색상값은 페이지마다 다른 것이 정상 (토큰 존재 여부만 검사)
4. **drafts/ 디렉토리** — `drafts/` 안의 파일은 작업 중이므로 구조 검증에서 제외
