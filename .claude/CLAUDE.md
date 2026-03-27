# HSRyuuu Developer Hub

GitHub Pages로 호스팅되는 개발자 레퍼런스 사이트.

## Project Structure

```
hsryuuu.github.io/
├── index.html          # 메인 대시보드 (인라인 CSS)
├── sidebar.js          # 공통 사이드바 (JS로 동적 생성)
├── cheatsheets/
│   ├── claude-code.html / .css
│   ├── git.html / .css
│   └── linux.html / .css
└── drafts/             # 임시 시안 파일 (gitignore 대상)
```

## Design System — Parchment Theme

따뜻한 크림/오프화이트 톤의 라이트 테마. Claude Desktop 색감에서 영감.

### Color Tokens (공통)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-deep` | `#FBF8F4` | 페이지 배경 |
| `--bg-card` | `#FFFFFF` | 카드 배경 |
| `--border` | `#E2D8CC` | 기본 보더 |
| `--text` | `#4A3F34` | 본문 텍스트 |
| `--text-dim` | `#8A7D70` | 보조 텍스트 |
| `--text-bright` | `#2C2420` | 강조 텍스트 |
| `--accent-cmd` | `#2D6356` | 커맨드/코드 텍스트 (세이지 틸) |
| `--key-bg` | `#F3ECE2` | 키캡 배경 |

### Per-Page Accents

| Page | `--accent` | Description |
|------|-----------|-------------|
| Claude Code | `#B8614E` | 테라코타 |
| Git | `#C96442` | 따뜻한 오렌지레드 |
| Linux | `#2D6356` | 세이지 그린 (진한) |

### Index Page Variables

index.html은 별도 CSS 변수 네이밍을 사용 (`--indigo`, `--teal`, `--rose` 등).
치트시트 CSS와 변수명이 다르지만 같은 Parchment 팔레트 적용.

## Conventions

- **Font**: Pretendard (본문), JetBrains Mono (코드/키캡), Space Grotesk (index)
- **CSS**: 각 치트시트는 독립 CSS 파일. 공통 레이아웃 구조는 동일하되 `:root` 변수만 다름
- **Sidebar**: `sidebar.js`가 모든 페이지에 사이드바를 동적 삽입. 색상이 하드코딩되어 있으므로 테마 변경 시 반드시 함께 수정
- **Cheatsheet Layout**: 탭 기반 카테고리 > 섹션 그룹 > 카드 그리드. `kbd` 키캡 + `?` 툴팁 패턴
- **New cheatsheet 추가 시**: 기존 CSS를 복사 후 `:root`의 `--accent` 계열만 변경. `sidebar.js` 트리에 항목 추가

## Skills

| Skill | Description |
|-------|-------------|
| cheat-sheet-design | 치트시트 웹 페이지 디자인 (탭, 키캡, 카드, 툴팁) |
| verify-site-sync | index.html ↔ sidebar.js ↔ 실제 페이지 동기화 검증 및 자동 수정 |
| verify-cheatsheet-structure | 치트시트 HTML/CSS 구조 및 접근성 검증 |
| manage-skill | 세션 변경사항 분석 후 verify 스킬 누락 탐지 및 유지보수 |

## Commands

- 로컬 확인: `open index.html` (정적 사이트이므로 별도 빌드 불필요)
- 배포: GitHub Pages (main 브랜치 push 시 자동)
