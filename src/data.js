/* =========================================================
   Контент страницы. Всё, что видно на экране, лежит здесь.
   ========================================================= */

export const THEMES = [
  { id: 'dark', label: 'Тёмная' },
  { id: 'light', label: 'Светлая' },
];

export const STATS = [
  { value: '2', label: 'job’а в пайплайне' },
  { value: '1', label: 'команда до деплоя' },
  { value: '0', label: 'ручных шагов' },
  { value: '1', label: 'живой URL' },
];

/* Шаги сборки — те же, что выполняет workflow этого репозитория. */
export const BUILD_STEPS = [
  { kind: 'step', text: '$ checkout --depth 1 main' },
  { kind: 'info', text: 'runner: ubuntu-latest · node 20 · npm 10' },
  { kind: 'step', text: 'setup-node 20 → cache restored' },
  { kind: 'ok', text: 'npm install → 142 packages, 0 уязвимостей' },
  { kind: 'step', text: 'npm run build → vite v5' },
  { kind: 'ok', text: 'modules transformed: 48, dist/ 148 kB' },
  { kind: 'warn', text: 'chunk 512 kB > advisory 500 kB — скорость в порядке' },
  { kind: 'step', text: 'dist/ → pages artifact' },
  { kind: 'step', text: 'deploy → GitHub Pages' },
  { kind: 'ok', text: 'https://spleiii.github.io/hello-pages/' },
];

export const FEATURES = [
  {
    index: '01',
    title: 'Сборка',
    text: 'Vite собирает SPA в каталог dist/. Никакой генерации страниц на сервере — статика целиком уезжает в артефакт Pages.',
    meta: 'vite build → dist/',
  },
  {
    index: '02',
    title: 'Артефакт',
    text: 'Собранный dist/ загружается отдельным шагом. Второй job забирает ровно этот артефакт и публикует его — без пересборки.',
    meta: 'upload-pages-artifact',
  },
  {
    index: '03',
    title: 'Базовый путь',
    text: 'Сайт лежит не в корне домена, а в подкаталоге, поэтому Vite получает <code>base</code>. Без него ассеты искались бы мимо.',
    meta: "base: '/hello-pages/'",
  },
  {
    index: '04',
    title: 'Гейтинг',
    text: 'Job публикации объявлен как <code>needs: build</code>. Сломанная сборка до Pages не доходит — деплой просто не запустится.',
    meta: 'needs: build',
  },
];

export const SNIPPET = 'npm run build';

export const REPOS = [
  { label: 'hello-pages', href: 'https://github.com/SpleIII/hello-pages' },
  { label: 'Zadanie', href: 'https://github.com/SpleIII/Zadanie' },
];
