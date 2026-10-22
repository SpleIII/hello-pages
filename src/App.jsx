import { useMemo } from 'react';

import { BUILD_STEPS, FEATURES, REPOS, SNIPPET, STATS, THEMES } from './data.js';
import { useActiveSection, useClock, useConsole, useCopy, useCounter, useReveal, useTheme } from './hooks.js';

const SECTIONS = ['console', 'features', 'counter'];

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [now] = useClock();
  const [count, incCount, resetCount] = useCounter();
  const { lines, progress, done, replay } = useConsole(BUILD_STEPS);
  const [copyState, copy] = useCopy();
  const active = useActiveSection(SECTIONS);
  const root = useReveal();

  const themeLabel = useMemo(
    () => THEMES.find((item) => item.id === theme)?.label ?? 'Тёмная',
    [theme]
  );

  return (
    <div className="app" ref={root}>
      <div className="backdrop" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="./">
          <span className="brand__mark" aria-hidden="true">◧</span>
          <span className="brand__name">
            hello<span className="brand__slash">/pages</span>
          </span>
        </a>

        <nav className="nav" aria-label="Разделы страницы">
          <a href="#console" className={active === 'console' ? 'is-active' : ''}>Консоль</a>
          <a href="#features" className={active === 'features' ? 'is-active' : ''}>Сборка</a>
          <a href="#counter" className={active === 'counter' ? 'is-active' : ''}>Счётчик</a>
        </nav>

        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          <span className="theme-toggle__icon" aria-hidden="true">◐</span>
          {themeLabel}
        </button>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            react + vite · github pages
          </p>

          <h1 className="hero__title">
            React SPA, который собирается
            <br />
            <span className="hero__accent">в CI и живёт на Pages</span>
          </h1>

          <p className="hero__lead">
            Тот же дизайн, что и у статического сайта, но собранный на React и
            Vite. Тема, анимация консоли, счётчик и копирование команд — всё
            работает как на обычном сайте, только состояние живёт в React.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#console">Открыть консоль</a>
            <a className="btn btn--ghost" href="#features">Как это устроено</a>
          </div>

          <div className="snippet">
            <code className="snippet__code">{SNIPPET}</code>
            <button
              className="snippet__copy"
              type="button"
              onClick={() => copy(SNIPPET)}
            >
              {copyState === 'copied' ? 'скопировано' : copyState === 'failed' ? 'не вышло' : 'копировать'}
            </button>
          </div>
        </section>

        <section className="stats reveal">
          {STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat__value">{stat.value}</span>
              <span className="stat__label">{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="panel reveal" id="console">
          <div className="panel__head">
            <h2 className="panel__title">Консоль сборки</h2>
            <span className="panel__badge">ubuntu-latest</span>
          </div>
          <p className="panel__hint">
            Имитация прогона этого же пайплайна — перезапускается по кнопке.
          </p>

          <div className="console">
            <pre className="console__body" aria-live="polite">
              {lines.map((line, index) => (
                <div className={`log-line log-line--${line.kind}`} key={`${line.time}-${index}`}>
                  <span className="log-line__time">{line.time}</span>
                  <span className="log-line__tag">{line.kind === 'info' ? 'info' : line.kind}</span>
                  <span className="log-line__text">{line.text}</span>
                </div>
              ))}
              {done && <span className="log-cursor" aria-hidden="true" />}
            </pre>
            <div className="console__progress">
              <span className="console__progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="console__actions">
            <button className="btn btn--small" type="button" onClick={replay}>
              Проиграть снова
            </button>
            <span className="console__clock">{now}</span>
          </div>
        </section>

        <section className="features reveal" id="features">
          <h2 className="section-title">Как устроена публикация</h2>
          <p className="section-lead">
            Сборка и публикация разнесены по двум job’ам: деплой стартует
            только после успешной сборки.
          </p>

          <div className="cards">
            {FEATURES.map((feature) => (
              <article className="card" key={feature.index}>
                <span className="card__index">{feature.index}</span>
                <h3 className="card__title">{feature.title}</h3>
                <p
                  className="card__text"
                  dangerouslySetInnerHTML={{ __html: feature.text }}
                />
                <p className="card__meta">{feature.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel reveal" id="counter">
          <div className="panel__head">
            <h2 className="panel__title">Счётчик сборок</h2>
            <span className="panel__badge">localStorage</span>
          </div>
          <p className="panel__hint">
            Значение переживает перезагрузку страницы — оно хранится в
            браузере, а не на сервере.
          </p>

          <div className="counter__body">
            <output className="counter__value">{count}</output>
            <div className="counter__buttons">
              <button className="btn btn--small" type="button" onClick={incCount}>+1</button>
              <button className="btn btn--small btn--ghost" type="button" onClick={resetCount}>
                сброс
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          {REPOS.map((repo, index) => (
            <span key={repo.href}>
              {index > 0 && ' · '}
              <a className="footer__path" href={repo.href} target="_blank" rel="noreferrer">
                {repo.label}
              </a>
            </span>
          ))}
          {' · деплой по push в '}
          <code>main</code>
        </p>
      </footer>
    </div>
  );
}
