---
name: verify-site-sync
description: index.html ↔ sidebar.js ↔ 실제 페이지 파일 간 동기화 검증 및 자동 수정. 페이지 추가/삭제 후 사용.
---

# verify-site-sync

## Purpose

페이지를 추가/삭제/이름변경할 때 **3곳**이 동기화되어야 합니다:

1. **파일 ↔ index.html** — 실제 HTML 파일마다 index.html에 카드가 있는지
2. **파일 ↔ sidebar.js** — 실제 HTML 파일마다 sidebar.js 트리에 링크가 있는지
3. **카운트 동기화** — index.html의 "N items" 텍스트가 실제 파일 수와 일치하는지
4. **CSS 쌍 존재** — 각 치트시트 HTML에 대응하는 CSS 파일이 있는지
5. **깨진 링크 없음** — index.html과 sidebar.js의 링크가 실제 파일을 가리키는지

## When to Run

- 새 치트시트/링크 페이지를 추가한 후
- 기존 페이지를 삭제하거나 이름을 변경한 후
- index.html의 카드 섹션이나 카운트를 수정한 후
- sidebar.js의 사이트 트리를 수정한 후

## Related Files

| File | Purpose |
|------|---------|
| `index.html` | 메인 대시보드 — 섹션별 카드 그리드 + 카운트 |
| `sidebar.js` | 공통 사이드바 — 사이트 트리 (모든 페이지에 삽입) |
| `cheatsheets/*.html` | 치트시트 HTML 파일들 |
| `cheatsheets/*.css` | 치트시트별 CSS 파일들 |
| `links/*.html` | 링크 페이지들 |

## Workflow

### Step 1: 실제 파일 목록 수집

**도구:** Glob

```
pattern: *.html    path: cheatsheets/
pattern: *.html    path: links/
```

각 디렉토리의 파일명을 추출하고 개수를 기록합니다.

### Step 2: index.html 카드 링크 검증

**도구:** Grep

```
pattern: href="cheatsheets/.*\.html"    path: index.html
pattern: href="links/.*\.html"          path: index.html
```

추출된 링크 목록과 Step 1의 실제 파일 목록을 대조합니다.

**PASS:** 모든 실제 파일에 대응하는 카드 링크가 index.html에 존재
**FAIL:** 실제 파일은 있는데 index.html에 카드가 없거나, 링크가 있는데 실제 파일이 없는 경우

### Step 3: sidebar.js 트리 링크 검증

**도구:** Grep

```
pattern: \.html    path: sidebar.js    output_mode: content
```

Step 1에서 수집한 모든 파일명이 sidebar.js에 포함되어 있는지 확인합니다.

**PASS:** 모든 실제 파일에 대응하는 링크가 sidebar.js 트리에 존재
**FAIL:** 실제 파일은 있는데 sidebar.js에 링크가 없는 경우

### Step 4: 섹션 카운트 텍스트 검증

**도구:** Grep

```
pattern: class="count".*items    path: index.html    output_mode: content
```

"N items" 텍스트의 N이 실제 치트시트 파일 수와 일치하는지 확인합니다.

**PASS:** N이 실제 파일 수와 일치
**FAIL:** 숫자가 다른 경우

### Step 5: CSS 쌍 존재 확인

**도구:** Glob

```
pattern: *.css    path: cheatsheets/
```

각 치트시트 HTML 파일에 대해 동일 이름의 CSS 파일이 존재하는지 확인합니다.

**PASS:** 모든 HTML 파일에 대응하는 CSS 파일이 존재
**FAIL:** HTML은 있는데 CSS가 없는 경우

### Step 6: 결과 보고 및 수정 여부 결정

검증 결과를 출력합니다:

```markdown
| # | 검사 항목 | 결과 | 상세 |
|---|-----------|------|------|
| 1 | 파일 ↔ index.html 카드 | PASS/FAIL | 누락: [파일명] |
| 2 | 파일 ↔ sidebar.js 트리 | PASS/FAIL | 누락: [파일명] |
| 3 | 섹션 카운트 (N items) | PASS/FAIL | 표시: N, 실제: M |
| 4 | CSS 쌍 존재 | PASS/FAIL | CSS 없음: [파일명] |
```

**모든 PASS인 경우:** "모든 페이지가 동기화되어 있습니다." 메시지를 표시하고 종료.

**FAIL이 있는 경우:** 아래 자동 수정 워크플로를 실행합니다.

---

## 자동 수정 워크플로

FAIL 항목이 있을 때 자동으로 수정을 적용합니다.

### Fix 1: index.html에 누락된 카드 추가

누락된 각 페이지에 대해:

**1a. 페이지 메타데이터 수집**

```
Read: {path}/{name}.html (첫 40줄)
```

`<title>` 태그와 `<h1>` 텍스트를 추출합니다.

**1b. 카드 삽입**

카테고리에 맞는 `<div class="grid">` 섹션을 찾아 카드를 삽입합니다.

**치트시트 카드 (col-6) 삽입 위치:** `<!-- ═══ Cheat Sheets ═══ -->` 섹션의 `</div><!-- grid -->` 직전

```html
<a class="card col-6" href="cheatsheets/{name}.html">
  <div class="accent-line" style="background:var(--{color})"></div>
  <div class="card-top">
    <div class="card-icon {color}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">{icon-path}</svg>
    </div>
    <span class="badge new">NEW</span>
  </div>
  <h3>{title}</h3>
  <p>{description}</p>
  <div class="card-tags">
    <span class="tag">{tag1}</span>
  </div>
</a>
```

**링크 카드 (col-12) 삽입 위치:** `<!-- ═══ Links ═══ -->` 섹션의 `</div><!-- grid -->` 직전

**아이콘 색상 가이드:**

| 색상 | 변수 | 용도 |
|------|------|------|
| indigo | `var(--indigo)` | CLI, 코드 도구 |
| teal | `var(--teal)` | 시스템, 서버 |
| rose | `var(--rose)` | Git, 버전 관리 |
| amber | `var(--amber)` | 링크, 리소스 |
| violet | `var(--violet)` | 기타, 실험적 |

### Fix 2: sidebar.js에 누락된 트리 항목 추가

**cheatsheets/ 항목 추가:**

기존 마지막 항목의 `└──`를 `├──`로 변경하고, 새 항목을 `└──`로 추가합니다:

```javascript
// 변경 전
│&nbsp;&nbsp; └── <a class="${markCurrent('linux')}" href="${csPre}linux.html">linux</a><br>

// 변경 후
│&nbsp;&nbsp; ├── <a class="${markCurrent('linux')}" href="${csPre}linux.html">linux</a><br>
│&nbsp;&nbsp; └── <a class="${markCurrent('{name}')}" href="${csPre}{name}.html">{name}</a> <span class="t-new">NEW</span><br>
```

**links/ 항목 추가:** 같은 패턴, `${lnkPre}` 프리픽스 사용.

### Fix 3: 카운트 업데이트

```
찾기: <span class="count">N items</span>
변경: <span class="count">{실제 파일 수} items</span>
```

Cheat Sheets 섹션의 카운트를 `cheatsheets/*.html`의 실제 파일 수로 변경합니다.

### Fix 4: 누락된 CSS 파일 생성

참조 구현(`claude-code.css`)을 복사하여 새 CSS 파일을 만들고, `:root`의 `--accent` 계열 변수만 변경합니다.

### Fix 5: 수정 후 재검증

Step 1–5를 다시 실행하여 모든 항목이 PASS인지 확인합니다.

```markdown
## 수정 완료

| 항목 | 변경 내용 |
|------|-----------|
| index.html | {name} 카드 추가, 카운트 N→M |
| sidebar.js | {name} 트리 항목 추가 |

재검증: ✅ 모든 항목 동기화됨
```

## Exceptions

1. **drafts/ 디렉토리** — `drafts/` 안의 HTML 파일은 배포 대상이 아니므로 동기화 검사에서 제외
2. **disabled 카드** — index.html의 `class="card disabled"` 또는 `class="link-card disabled"` 카드는 placeholder이므로 실제 파일이 없어도 정상
3. **sidebar.js의 SOON 항목** — `t-wip` 클래스가 붙은 항목은 예정 페이지이므로 파일이 없어도 정상
