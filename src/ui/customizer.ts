import Sortable from 'sortablejs';

import { buildCardSearchParams, buildCardUrl as createCardUrl, buildEmbedSnippets } from '../card-url.js';
import { techCatalog } from '../catalog.js';
import { encodeStackConfig, decodeStackConfig } from '../stack-config.js';
import { simpleIconById, simpleIconCatalog } from '../simple-icons.js';
import { themes } from '../themes.js';
import type { CardLayout, StackConfigV1 } from '../types.js';

type Language = 'en' | 'ko';
type ThemeName = 'shiny' | 'github_dark' | 'light';
type ColorKey = 'accent' | 'background' | 'border' | 'text' | 'tile';

interface CustomizerState {
  animated: boolean;
  colors: Record<ColorKey, string>;
  groups: Array<{ id: string; items: string[] }>;
  hideTitle: boolean;
  iconSize: number;
  layout: CardLayout;
  theme: ThemeName;
  title: string;
  username: string;
}

const STORAGE_KEY = 'github-tech-stack-card:config:v1';
const LANGUAGE_KEY = 'github-tech-stack-card:language';
const colorPattern = /^#[0-9A-F]{6}$/u;
const POPULAR_ICON_IDS = [
  'astro', 'react', 'vuedotjs', 'svelte', 'nextdotjs', 'nuxt', 'angular', 'typescript',
  'javascript', 'python', 'go', 'rust', 'kotlin', 'swift', 'flutter', 'nodedotjs',
  'bun', 'deno', 'docker', 'kubernetes', 'amazonwebservices', 'googlecloud', 'cloudflare',
  'vercel', 'firebase', 'supabase', 'postgresql', 'mongodb', 'redis', 'githubactions',
  'gitlab', 'figma', 'unity', 'unrealengine', 'pytorch', 'tensorflow',
];

const copy = {
  en: {
    accent: 'Accent', animation: 'Animation', animationHelp: 'Float icons and shimmer the border', appearance: 'Appearance',
    background: 'Background', border: 'Border', cardTitle: 'Card title', cardUrl: 'Card URL', compact: 'Compact',
    copied: 'Copied to your clipboard.', copy: 'Copy', copyFailed: 'Copy failed. Select the text and copy it manually.',
    accounts: 'accounts needed', addTechnology: 'Add technology', added: 'Added', addingTo: 'Adding to', allBundled: 'All logos are bundled',
    combinations: 'combinations', copyShare: 'Copy share link', customize: 'CUSTOMIZE', done: 'Done', dragHelp: 'Add any logo from the library and drag selected items to reorder them. Use the arrow buttons for keyboard control.',
    editorTitle: 'Make it yours', eyebrow: 'DYNAMIC SVG BUILDER', grid: 'Grid', heroAccent: 'uniquely yours.',
    heroCopy: 'Pick your technologies, tune every detail, and paste the result straight into your GitHub README.',
    heroStart: 'Build a stack card that feels', iconSize: 'Icon size', identity: 'Identity', invalidConfig: 'The shared configuration was invalid, so the default stack was loaded.',
    invalidUsername: 'Use 1–39 letters, numbers, or hyphens for the GitHub username.', layout: 'Layout', livePreview: 'LIVE PREVIEW',
    iconLibrary: 'brand icons', iconLibraryLabel: 'ICON LIBRARY', libraryHelp: 'Search by product, language, framework, cloud service, or tool.', libraryTitle: 'Add technologies',
    madeFor: 'Built for expressive GitHub profiles.', moveDown: 'Move down', moveLeft: 'Move left', moveRight: 'Move right', moveUp: 'Move up',
    outputTitle: 'Copy & paste', previewAlt: 'Live preview of your GitHub tech stack card', previewError: 'The preview could not be rendered. Check the current settings.',
    previewReady: 'Preview is up to date.', previewTitle: 'Your card', privacy: 'No account, tracking, or server-side storage. Your configuration stays in the URL and this browser.',
    popular: 'Popular technologies', remove: 'Remove', rendering: 'Rendering your card…', replay: 'Replay', reset: 'Reset all', resetDone: 'All settings were reset.', rows: 'Rows',
    searchPlaceholder: 'Search 3,453 technologies…', searchResults: 'results', shareCopied: 'Share link copied.', showTitle: 'Show title', showTitleHelp: 'Display the title above your stack',
    stackRequired: 'Keep at least one technology selected.', stackTooLarge: 'This card has reached the shareable URL limit. Remove a few technologies before adding more.', text: 'Text', theme: 'Theme', tile: 'Icon tile', technologies: 'Technologies',
    useIt: 'USE IT', username: 'GitHub username', viewGithub: 'View on GitHub',
  },
  ko: {
    accent: '강조색', animation: '애니메이션', animationHelp: '아이콘과 테두리에 움직임을 적용합니다', appearance: '디자인',
    background: '배경', border: '테두리', cardTitle: '카드 제목', cardUrl: '카드 URL', compact: '컴팩트',
    copied: '클립보드에 복사했습니다.', copy: '복사', copyFailed: '복사하지 못했습니다. 텍스트를 직접 선택해 주세요.',
    accounts: '필요한 계정', addTechnology: '기술 추가', added: '추가됨', addingTo: '추가할 카테고리', allBundled: '모든 로고가 내장되어 있습니다',
    combinations: '가지 조합', copyShare: '공유 링크 복사', customize: '커스터마이즈', done: '완료', dragHelp: '라이브러리에서 로고를 추가하고 드래그해 순서를 바꿔보세요. 키보드에서는 화살표 버튼을 사용할 수 있습니다.',
    editorTitle: '나만의 카드 만들기', eyebrow: '동적 SVG 빌더', grid: '그리드', heroAccent: '나답게 만들어 보세요.',
    heroCopy: '기술을 고르고 원하는 모습으로 꾸민 다음 GitHub README에 바로 붙여 넣으세요.',
    heroStart: '기술 스택 카드를', iconSize: '아이콘 크기', identity: '기본 정보', invalidConfig: '공유 설정이 올바르지 않아 기본 스택을 불러왔습니다.',
    invalidUsername: 'GitHub 사용자명은 영문, 숫자, 하이픈으로 1–39자까지 입력해 주세요.', layout: '레이아웃', livePreview: '실시간 미리보기',
    iconLibrary: '개 브랜드 로고', iconLibraryLabel: '아이콘 라이브러리', libraryHelp: '제품, 언어, 프레임워크, 클라우드 서비스 또는 도구를 검색하세요.', libraryTitle: '기술 추가',
    madeFor: '개성 있는 GitHub 프로필을 위해 만들었습니다.', moveDown: '아래로 이동', moveLeft: '왼쪽으로 이동', moveRight: '오른쪽으로 이동', moveUp: '위로 이동',
    outputTitle: '복사해서 사용하기', previewAlt: 'GitHub 기술 스택 카드 실시간 미리보기', previewError: '미리보기를 만들지 못했습니다. 현재 설정을 확인해 주세요.',
    previewReady: '최신 설정이 반영되었습니다.', previewTitle: '내 카드', privacy: '계정, 추적, 서버 저장소를 사용하지 않습니다. 설정은 URL과 이 브라우저에만 저장됩니다.',
    popular: '인기 기술', remove: '제거', rendering: '카드를 만들고 있습니다…', replay: '다시 재생', reset: '전체 초기화', resetDone: '모든 설정을 초기화했습니다.', rows: '행',
    searchPlaceholder: '3,453개 기술 검색…', searchResults: '개 결과', shareCopied: '공유 링크를 복사했습니다.', showTitle: '제목 표시', showTitleHelp: '스택 위에 카드 제목을 표시합니다',
    stackRequired: '기술을 하나 이상 선택해 주세요.', stackTooLarge: '공유 가능한 URL 길이에 도달했습니다. 기술을 몇 개 제거한 뒤 다시 추가해 주세요.', text: '글자', theme: '테마', tile: '아이콘 타일', technologies: '기술 선택',
    useIt: '사용하기', username: 'GitHub 사용자명', viewGithub: 'GitHub에서 보기',
  },
} as const;

type TranslationKey = keyof typeof copy.en;

function element<T extends HTMLElement>(selector: string): T {
  const result = document.querySelector<T>(selector);
  if (!result) throw new Error(`Missing element: ${selector}`);
  return result;
}

function defaultState(): CustomizerState {
  return {
    animated: true,
    colors: { ...themes.shiny! },
    groups: techCatalog.map((group) => ({ id: group.id, items: group.items.map((item) => item.id) })),
    hideTitle: false,
    iconSize: 34,
    layout: 'rows',
    theme: 'shiny',
    title: 'Tech Stack',
    username: 'Seungpyo1007',
  };
}

function iconUrl(id: string): string {
  return `/api/icon?id=${encodeURIComponent(id)}`;
}

function iconName(groupId: string, id: string): string {
  return techCatalog.find((group) => group.id === groupId)?.items.find((item) => item.id === id)?.name
    ?? simpleIconById.get(id)?.name
    ?? id;
}

function safeColor(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const normalized = value.startsWith('#') ? value.toUpperCase() : `#${value.toUpperCase()}`;
  return colorPattern.test(normalized) ? normalized : fallback;
}

function safeTheme(value: string | null): ThemeName {
  return value === 'github_dark' || value === 'light' || value === 'shiny' ? value : 'shiny';
}

function safeLayout(value: string | null): CardLayout {
  return value === 'grid' || value === 'compact' || value === 'rows' ? value : 'rows';
}

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback;
  return ['1', 'true', 'yes'].includes(value.toLowerCase());
}

function selectedConfig(groups: CustomizerState['groups']): StackConfigV1 {
  return { v: 1, groups: groups.filter((group) => group.items.length > 0).map((group) => ({ id: group.id, items: [...group.items] })) };
}

function stateFromParams(params: URLSearchParams): { state: CustomizerState; invalidConfig: boolean } {
  const fallback = defaultState();
  const theme = safeTheme(params.get('theme'));
  const preset = themes[theme]!;
  let groups = fallback.groups;
  let invalidConfig = false;
  const token = params.get('config');
  if (token) {
    const decoded = decodeStackConfig(token, params.get('username') ?? fallback.username);
    if (decoded.ok) {
      const selectedByGroup = new Map(decoded.config.groups.map((group) => [group.id, group.items]));
      const orderedIds = decoded.config.groups.map((group) => group.id);
      const missingIds = techCatalog.map((group) => group.id).filter((id) => !orderedIds.includes(id));
      groups = [...orderedIds, ...missingIds].map((id) => ({ id, items: [...(selectedByGroup.get(id) ?? [])] }));
    } else {
      invalidConfig = true;
    }
  }

  const requestedSize = Number.parseInt(params.get('icon_size') ?? '', 10);
  const iconSize = Number.isFinite(requestedSize) ? Math.min(48, Math.max(24, requestedSize)) : 34;
  const requestedUsername = params.get('username') ?? fallback.username;
  const username = /^[A-Za-z0-9-]{1,39}$/u.test(requestedUsername) ? requestedUsername : fallback.username;
  const requestedTitle = [...(params.get('title') ?? fallback.title)]
    .filter((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127)
    .join('')
    .trim();

  return {
    invalidConfig,
    state: {
      animated: parseBoolean(params.get('animation'), fallback.animated),
      colors: {
        accent: safeColor(params.get('title_color'), preset.accent),
        background: safeColor(params.get('bg_color'), preset.background),
        border: safeColor(params.get('border_color'), preset.border),
        text: safeColor(params.get('text_color'), preset.text),
        tile: safeColor(params.get('tile_color'), preset.tile),
      },
      groups,
      hideTitle: parseBoolean(params.get('hide_title'), fallback.hideTitle),
      iconSize,
      layout: safeLayout(params.get('layout')),
      theme,
      title: [...(requestedTitle || fallback.title)].slice(0, 48).join(''),
      username,
    },
  };
}

function resolveLanguage(): Language {
  const urlLanguage = new URLSearchParams(window.location.search).get('lang');
  if (urlLanguage === 'en' || urlLanguage === 'ko') return urlLanguage;
  const stored = readStorage(LANGUAGE_KEY);
  if (stored === 'en' || stored === 'ko') return stored;
  return navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

function initialState(): { state: CustomizerState; invalidConfig: boolean } {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('config')) return stateFromParams(urlParams);
  const stored = readStorage(STORAGE_KEY);
  if (stored) return stateFromParams(new URLSearchParams(stored));
  return { state: defaultState(), invalidConfig: false };
}

let language = resolveLanguage();
const initial = initialState();
let state = initial.state;
const invalidConfig = initial.invalidConfig;
let previewTimer: ReturnType<typeof setTimeout> | undefined;
let statusTimer: ReturnType<typeof setTimeout> | undefined;
let sortables: Sortable[] = [];
let libraryTargetGroup = 'web';
let libraryReturnFocus: HTMLElement | null = null;

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The generated URL still preserves the state when browser storage is unavailable.
  }
}

const form = element<HTMLFormElement>('#customizer-form');
const groupsRoot = element<HTMLDivElement>('#stack-groups');
const preview = element<HTMLImageElement>('#card-preview');
const previewLoading = element<HTMLDivElement>('#preview-loading');
const statusMessage = element<HTMLParagraphElement>('#status-message');
const usernameInput = element<HTMLInputElement>('#username');
const titleInput = element<HTMLInputElement>('#card-title');
const titleCount = element<HTMLElement>('#title-count');
const iconSizeInput = element<HTMLInputElement>('#icon-size');
const iconSizeOutput = element<HTMLOutputElement>('#icon-size-output');
const showTitleInput = element<HTMLInputElement>('#show-title');
const animationInput = element<HTMLInputElement>('#animation');
const outputUrl = element<HTMLInputElement>('#output-url');
const outputMarkdown = element<HTMLInputElement>('#output-markdown');
const outputHtml = element<HTMLInputElement>('#output-html');
const libraryBackdrop = element<HTMLDivElement>('#library-backdrop');
const libraryClose = element<HTMLButtonElement>('#library-close');
const libraryDone = element<HTMLButtonElement>('#library-done');
const librarySearch = element<HTMLInputElement>('#library-search');
const libraryResults = element<HTMLDivElement>('#library-results');
const librarySummary = element<HTMLElement>('#library-summary');
const libraryTarget = element<HTMLElement>('#library-target');

function t(key: TranslationKey): string {
  return copy[language][key];
}

function setStatus(message: string, kind: 'error' | 'success' | 'neutral' = 'neutral', temporary = false): void {
  if (statusTimer) clearTimeout(statusTimer);
  statusMessage.textContent = message;
  statusMessage.className = `status-message${kind === 'neutral' ? '' : ` is-${kind}`}`;
  if (temporary) {
    statusTimer = setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 2400);
  }
}

function applyLanguage(): void {
  document.documentElement.lang = language;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n as TranslationKey;
    if (copy[language][key]) node.textContent = t(key);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((input) => {
    input.placeholder = t(input.dataset.i18nPlaceholder as TranslationKey);
  });
  preview.alt = t('previewAlt');
  writeStorage(LANGUAGE_KEY, language);
  renderStackGroups();
  if (!libraryBackdrop.hidden) renderLibraryResults();
}

function cardParams(): URLSearchParams {
  return buildCardSearchParams({
    animated: state.animated,
    colors: state.colors,
    hideTitle: state.hideTitle,
    iconSize: state.iconSize,
    layout: state.layout,
    stackToken: encodeStackConfig(selectedConfig(state.groups)),
    theme: state.theme,
    title: state.title,
    username: state.username,
  });
}

function pageParams(): URLSearchParams {
  const params = cardParams();
  params.set('config', params.get('stack')!);
  params.delete('stack');
  params.set('lang', language);
  return params;
}

function buildCardUrl(): string {
  return createCardUrl(window.location.origin, {
    animated: state.animated,
    colors: state.colors,
    hideTitle: state.hideTitle,
    iconSize: state.iconSize,
    layout: state.layout,
    stackToken: encodeStackConfig(selectedConfig(state.groups)),
    theme: state.theme,
    title: state.title,
    username: state.username,
  });
}

function buildShareUrl(): string {
  const url = new URL('/', window.location.origin);
  url.search = pageParams().toString();
  return url.toString();
}

function updateOutputs(): string {
  const url = buildCardUrl();
  const snippets = buildEmbedSnippets(url);
  outputUrl.value = url;
  outputMarkdown.value = snippets.markdown;
  outputHtml.value = snippets.html;
  return url;
}

function schedulePreview(url: string): void {
  if (previewTimer) clearTimeout(previewTimer);
  preview.classList.remove('is-ready');
  previewLoading.hidden = false;
  previewTimer = setTimeout(() => {
    preview.src = url;
  }, 180);
}

function persistAndRenderPreview(): void {
  if (!/^[A-Za-z0-9-]{1,39}$/u.test(state.username)) {
    setStatus(t('invalidUsername'), 'error');
    return;
  }
  let params: URLSearchParams;
  try {
    params = pageParams();
  } catch {
    setStatus(t('stackTooLarge'), 'error', true);
    return;
  }
  writeStorage(STORAGE_KEY, params.toString());
  const shareUrl = new URL('/', window.location.origin);
  shareUrl.search = params.toString();
  window.history.replaceState({}, '', shareUrl);
  schedulePreview(updateOutputs());
}

function destroySortables(): void {
  sortables.forEach((sortable) => sortable.destroy());
  sortables = [];
}

function moveGroup(groupId: string, direction: -1 | 1): void {
  const index = state.groups.findIndex((group) => group.id === groupId);
  const destination = index + direction;
  if (index < 0 || destination < 0 || destination >= state.groups.length) return;
  const [group] = state.groups.splice(index, 1);
  if (group) state.groups.splice(destination, 0, group);
  renderStackGroups();
  persistAndRenderPreview();
}

function moveItem(groupId: string, itemId: string, direction: -1 | 1): void {
  const group = state.groups.find((candidate) => candidate.id === groupId);
  if (!group) return;
  const index = group.items.indexOf(itemId);
  const destination = index + direction;
  if (index < 0 || destination < 0 || destination >= group.items.length) return;
  const [item] = group.items.splice(index, 1);
  if (item) group.items.splice(destination, 0, item);
  renderStackGroups();
  persistAndRenderPreview();
}

function totalSelected(): number {
  return state.groups.reduce((total, group) => total + group.items.length, 0);
}

function setItemSelected(groupId: string, itemId: string, selected: boolean): boolean {
  const group = state.groups.find((candidate) => candidate.id === groupId);
  if (!group) return false;
  if (!selected && totalSelected() === 1 && group.items.includes(itemId)) {
    setStatus(t('stackRequired'), 'error', true);
    return false;
  }
  const previous = [...group.items];
  group.items = selected ? [...group.items.filter((id) => id !== itemId), itemId] : group.items.filter((id) => id !== itemId);
  try {
    encodeStackConfig(selectedConfig(state.groups));
  } catch {
    group.items = previous;
    setStatus(t('stackTooLarge'), 'error', true);
    return false;
  }
  renderStackGroups();
  persistAndRenderPreview();
  return true;
}

function syncGroupsFromDom(): void {
  const reordered: CustomizerState['groups'] = [];
  groupsRoot.querySelectorAll<HTMLElement>('.stack-group').forEach((groupNode) => {
    const existing = state.groups.find((group) => group.id === groupNode.dataset.groupId);
    if (!existing) return;
    const selectedItems = [...groupNode.querySelectorAll<HTMLElement>('.tech-chip')].map((item) => item.dataset.techId!).filter(Boolean);
    reordered.push({ id: existing.id, items: selectedItems });
  });
  state.groups = reordered;
  renderStackGroups();
  persistAndRenderPreview();
}

function openLibrary(groupId: string, returnFocus: HTMLElement): void {
  const catalogGroup = techCatalog.find((group) => group.id === groupId);
  if (!catalogGroup) return;
  libraryTargetGroup = groupId;
  libraryReturnFocus = returnFocus;
  libraryTarget.textContent = catalogGroup.name;
  librarySearch.value = '';
  libraryBackdrop.hidden = false;
  document.body.classList.add('modal-open');
  renderLibraryResults();
  requestAnimationFrame(() => librarySearch.focus());
}

function closeLibrary(): void {
  libraryBackdrop.classList.add('is-closing');
  window.setTimeout(() => {
    libraryBackdrop.hidden = true;
    libraryBackdrop.classList.remove('is-closing');
    document.body.classList.remove('modal-open');
    const fallbackFocus = groupsRoot.querySelector<HTMLButtonElement>(`.stack-group[data-group-id="${libraryTargetGroup}"] .add-tech-button`);
    (libraryReturnFocus?.isConnected ? libraryReturnFocus : fallbackFocus)?.focus();
  }, 180);
}

function searchIcons(query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) {
    return POPULAR_ICON_IDS.map((id) => simpleIconById.get(id)).filter((icon) => icon !== undefined);
  }
  return simpleIconCatalog
    .map((icon) => {
      const name = icon.name.toLocaleLowerCase();
      const id = icon.id.toLocaleLowerCase();
      const aliases = icon.aliases.map((alias) => alias.toLocaleLowerCase());
      const score = name === normalized || id === normalized ? 0
        : name.startsWith(normalized) || id.startsWith(normalized) ? 1
          : aliases.some((alias) => alias.startsWith(normalized)) ? 2
            : name.includes(normalized) || id.includes(normalized) ? 3
              : aliases.some((alias) => alias.includes(normalized)) ? 4
                : -1;
      return { icon, score };
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => a.score - b.score || a.icon.name.localeCompare(b.icon.name))
    .map((entry) => entry.icon);
}

function renderLibraryResults(): void {
  const matches = searchIcons(librarySearch.value);
  const visible = matches.slice(0, 72);
  const target = state.groups.find((group) => group.id === libraryTargetGroup);
  librarySummary.textContent = librarySearch.value.trim()
    ? `${matches.length.toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US')} ${t('searchResults')}`
    : t('popular');
  libraryResults.replaceChildren();

  visible.forEach((icon, index) => {
    const selected = target?.items.includes(icon.id) ?? false;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'library-item';
    button.dataset.selected = String(selected);
    button.style.setProperty('--item-index', String(index));
    button.setAttribute('aria-pressed', String(selected));
    const logo = document.createElement('span');
    logo.className = 'library-item-logo';
    logo.style.setProperty('--logo-color', icon.hex);
    const image = document.createElement('img');
    image.src = iconUrl(icon.id);
    image.alt = '';
    image.loading = 'lazy';
    logo.append(image);
    const label = document.createElement('span');
    label.className = 'library-item-copy';
    const name = document.createElement('strong');
    name.textContent = icon.name;
    const slug = document.createElement('small');
    slug.textContent = icon.id;
    label.append(name, slug);
    const action = document.createElement('span');
    action.className = 'library-item-action';
    action.textContent = selected ? '✓' : '+';
    action.title = selected ? t('added') : t('addTechnology');
    button.append(logo, label, action);
    button.addEventListener('click', () => {
      const changed = setItemSelected(libraryTargetGroup, icon.id, !selected);
      if (changed) renderLibraryResults();
    });
    libraryResults.append(button);
  });
}

function arrowButton(label: string, symbol: string, disabled: boolean, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'move-button';
  button.textContent = symbol;
  button.setAttribute('aria-label', label);
  button.title = label;
  button.disabled = disabled;
  button.addEventListener('click', onClick);
  return button;
}

function renderStackGroups(): void {
  destroySortables();
  groupsRoot.replaceChildren();
  state.groups.forEach((selectedGroup, groupIndex) => {
    const catalogGroup = techCatalog.find((group) => group.id === selectedGroup.id);
    if (!catalogGroup) return;
    const article = document.createElement('article');
    article.className = 'stack-group';
    article.dataset.groupId = selectedGroup.id;

    const header = document.createElement('div');
    header.className = 'stack-group-header';
    const drag = document.createElement('button');
    drag.type = 'button';
    drag.className = 'drag-handle group-drag-handle';
    drag.textContent = '⠿';
    drag.setAttribute('aria-label', `${catalogGroup.name}: ${t('moveUp')} / ${t('moveDown')}`);

    const heading = document.createElement('span');
    heading.className = 'stack-group-title';
    heading.textContent = catalogGroup.name;
    const count = document.createElement('span');
    count.className = 'stack-count';
    count.textContent = String(selectedGroup.items.length);
    heading.append(count);

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'add-tech-button';
    addButton.dataset.groupId = selectedGroup.id;
    addButton.innerHTML = `<span aria-hidden="true">+</span> ${t('addTechnology')}`;
    addButton.addEventListener('click', () => openLibrary(selectedGroup.id, addButton));

    const groupMoves = document.createElement('span');
    groupMoves.className = 'move-controls';
    groupMoves.append(
      arrowButton(t('moveUp'), '↑', groupIndex === 0, () => moveGroup(selectedGroup.id, -1)),
      arrowButton(t('moveDown'), '↓', groupIndex === state.groups.length - 1, () => moveGroup(selectedGroup.id, 1)),
    );
    header.append(drag, heading, addButton, groupMoves);

    const techList = document.createElement('div');
    techList.className = 'tech-list';
    selectedGroup.items.forEach((itemId, selectedIndex) => {
      const chip = document.createElement('div');
      chip.className = 'tech-chip';
      chip.dataset.techId = itemId;
      chip.style.setProperty('--chip-color', simpleIconById.get(itemId)?.hex ?? '#89CFF0');
      const image = document.createElement('img');
      image.src = iconUrl(itemId);
      image.alt = '';
      image.loading = 'lazy';
      const name = document.createElement('span');
      name.textContent = iconName(selectedGroup.id, itemId);
      const itemDrag = document.createElement('span');
      itemDrag.className = 'tech-drag-handle';
      itemDrag.textContent = '⠿';
      itemDrag.setAttribute('aria-hidden', 'true');
      const moves = document.createElement('span');
      moves.className = 'move-controls';
      moves.append(
        arrowButton(t('moveLeft'), '←', selectedIndex === 0, () => moveItem(selectedGroup.id, itemId, -1)),
        arrowButton(t('moveRight'), '→', selectedIndex === selectedGroup.items.length - 1, () => moveItem(selectedGroup.id, itemId, 1)),
      );
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'tech-remove';
      remove.textContent = '×';
      remove.title = t('remove');
      remove.setAttribute('aria-label', `${t('remove')} ${name.textContent}`);
      remove.addEventListener('click', () => setItemSelected(selectedGroup.id, itemId, false));
      chip.append(image, name, itemDrag, moves, remove);
      techList.append(chip);
    });

    article.append(header, techList);
    groupsRoot.append(article);
    sortables.push(Sortable.create(techList, {
      animation: 160,
      draggable: '.tech-chip',
      ghostClass: 'sortable-ghost',
      handle: '.tech-drag-handle',
      onEnd: syncGroupsFromDom,
    }));
  });
  sortables.push(Sortable.create(groupsRoot, {
    animation: 180,
    draggable: '.stack-group',
    ghostClass: 'sortable-ghost',
    handle: '.group-drag-handle',
    onEnd: syncGroupsFromDom,
  }));
}

function renderControls(): void {
  usernameInput.value = state.username;
  titleInput.value = state.title;
  titleCount.textContent = `${[...state.title].length}/48`;
  iconSizeInput.value = String(state.iconSize);
  iconSizeOutput.textContent = `${state.iconSize}px`;
  showTitleInput.checked = !state.hideTitle;
  animationInput.checked = state.animated;
  document.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.theme === state.theme)));
  document.querySelectorAll<HTMLButtonElement>('[data-layout]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.layout === state.layout)));
  (Object.keys(state.colors) as ColorKey[]).forEach((key) => {
    element<HTMLInputElement>(`[data-color="${key}"]`).value = state.colors[key];
    element<HTMLInputElement>(`[data-color-text="${key}"]`).value = state.colors[key];
  });
  renderStackGroups();
}

async function copyText(value: string, successMessage: string): Promise<void> {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(value);
    setStatus(successMessage, 'success', true);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    setStatus(copied ? successMessage : t('copyFailed'), copied ? 'success' : 'error', true);
  }
}

usernameInput.addEventListener('input', () => {
  state.username = usernameInput.value.trim();
  persistAndRenderPreview();
});
titleInput.addEventListener('input', () => {
  state.title = [...titleInput.value].slice(0, 48).join('');
  titleCount.textContent = `${[...state.title].length}/48`;
  persistAndRenderPreview();
});
iconSizeInput.addEventListener('input', () => {
  state.iconSize = Number(iconSizeInput.value);
  iconSizeOutput.textContent = `${state.iconSize}px`;
  persistAndRenderPreview();
});
showTitleInput.addEventListener('change', () => {
  state.hideTitle = !showTitleInput.checked;
  persistAndRenderPreview();
});
animationInput.addEventListener('change', () => {
  state.animated = animationInput.checked;
  persistAndRenderPreview();
});
document.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach((button) => button.addEventListener('click', () => {
  state.theme = safeTheme(button.dataset.theme ?? null);
  state.colors = { ...themes[state.theme]! };
  renderControls();
  persistAndRenderPreview();
}));
document.querySelectorAll<HTMLButtonElement>('[data-layout]').forEach((button) => button.addEventListener('click', () => {
  state.layout = safeLayout(button.dataset.layout ?? null);
  renderControls();
  persistAndRenderPreview();
}));
(Object.keys(state.colors) as ColorKey[]).forEach((key) => {
  const picker = element<HTMLInputElement>(`[data-color="${key}"]`);
  const textInput = element<HTMLInputElement>(`[data-color-text="${key}"]`);
  picker.addEventListener('input', () => {
    state.colors[key] = picker.value.toUpperCase();
    textInput.value = state.colors[key];
    persistAndRenderPreview();
  });
  textInput.addEventListener('change', () => {
    state.colors[key] = safeColor(textInput.value, state.colors[key]);
    picker.value = state.colors[key];
    textInput.value = state.colors[key];
    persistAndRenderPreview();
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach((button) => button.addEventListener('click', () => {
  language = button.dataset.language === 'ko' ? 'ko' : 'en';
  applyLanguage();
  persistAndRenderPreview();
}));
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => button.addEventListener('click', () => {
  const target = button.dataset.copy;
  const value = target === 'markdown' ? outputMarkdown.value : target === 'html' ? outputHtml.value : outputUrl.value;
  void copyText(value, t('copied'));
}));
element<HTMLButtonElement>('#share-button').addEventListener('click', () => void copyText(buildShareUrl(), t('shareCopied')));
element<HTMLButtonElement>('#reset-button').addEventListener('click', () => {
  state = defaultState();
  renderControls();
  persistAndRenderPreview();
  setStatus(t('resetDone'), 'success', true);
});
element<HTMLButtonElement>('#replay-button').addEventListener('click', () => {
  const url = updateOutputs();
  preview.classList.remove('is-ready');
  preview.removeAttribute('src');
  requestAnimationFrame(() => requestAnimationFrame(() => { preview.src = url; }));
});
preview.addEventListener('load', () => {
  previewLoading.hidden = true;
  preview.classList.add('is-ready');
  setStatus(t('previewReady'));
});
preview.addEventListener('error', () => {
  previewLoading.hidden = true;
  preview.classList.remove('is-ready');
  setStatus(t('previewError'), 'error');
});
form.addEventListener('submit', (event) => event.preventDefault());
librarySearch.addEventListener('input', renderLibraryResults);
libraryClose.addEventListener('click', closeLibrary);
libraryDone.addEventListener('click', closeLibrary);
libraryBackdrop.addEventListener('click', (event) => {
  if (event.target === libraryBackdrop) closeLibrary();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !libraryBackdrop.hidden) {
    closeLibrary();
    return;
  }
  if (event.key === '/' && libraryBackdrop.hidden && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
    event.preventDefault();
    const fallbackButton = groupsRoot.querySelector<HTMLButtonElement>('.add-tech-button');
    if (fallbackButton) openLibrary(state.groups[0]?.id ?? 'web', fallbackButton);
  }
});

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
  }, { passive: true });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.control-section, .output-panel').forEach((section) => revealObserver.observe(section));

applyLanguage();
renderControls();
persistAndRenderPreview();
if (invalidConfig) setStatus(t('invalidConfig'), 'error', true);
