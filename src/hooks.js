/* =========================================================
   Хуки страницы: тема, часы, счётчик, анимация консоли,
   появление блоков и подсветка активного раздела.
   ========================================================= */

import { useCallback, useEffect, useRef, useState } from 'react';

const THEME_KEY = 'hello-pages-theme';
const COUNTER_KEY = 'hello-pages-counter';

const formatTime = (date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

/* ---------- тема ---------- */

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return [theme, toggle];
};

/* ---------- часы ---------- */

export const useClock = () => {
  const [now, setNow] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setNow(formatTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return [now];
};

/* ---------- счётчик ---------- */

export const useCounter = () => {
  const [value, setValue] = useState(() => {
    try {
      const stored = Number.parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
      return Number.isFinite(stored) && stored >= 0 ? stored : 0;
    } catch {
      return 0;
    }
  });

  const write = useCallback((next) => {
    setValue(next);
    try {
      localStorage.setItem(COUNTER_KEY, String(next));
    } catch {
      /* игнорируем */
    }
  }, []);

  const inc = useCallback(() => setValue((current) => current + 1), []);
  const reset = useCallback(() => write(0), [write]);

  return [value, inc, reset];
};

/* ---------- анимация консоли ---------- */

export const useConsole = (steps) => {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    setLines([]);
    setProgress(0);
    setDone(false);

    const timers = [];
    let delay = 0;

    steps.forEach((step, index) => {
      delay += step.kind === 'warn' ? 420 : 260;
      timers.push(
        window.setTimeout(() => {
          setLines((current) => [...current, { ...step, time: formatTime(new Date()) }]);
          setProgress(Math.round(((index + 1) / steps.length) * 100));
        }, delay)
      );
    });

    timers.push(window.setTimeout(() => setDone(true), delay + 200));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [run, steps]);

  const replay = useCallback(() => setRun((current) => current + 1), []);

  return { lines, progress, done, replay };
};

/* ---------- появление блоков при скролле ---------- */

export const useReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return undefined;
    }

    const targets = root.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
};

/* ---------- подсветка активного раздела ---------- */

export const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) {
      return undefined;
    }

    // Активен первый раздел, чей низ ещё ниже отметки в 35% высоты окна:
    // значит, отметка попала в него. Если отметка оказалась ниже всех
    // разделов (страница прокручена до конца) — остаётся последний.
    const update = () => {
      // Страница прокручена до самого низа: последний раздел не может
      // дойти до отметки, поэтому подсвечиваем его принудительно.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      const line = window.innerHeight * 0.35;
      let current = sections[sections.length - 1].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().bottom > line) {
          current = section.id;
          break;
        }
      }

      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ids]);

  return active;
};

/* ---------- копирование в буфер ---------- */

export const useCopy = (timeout = 1600) => {
  const [state, setState] = useState('idle');

  const copy = useCallback(
    async (text) => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // Запасной вариант для браузеров без Clipboard API.
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        ok = document.execCommand('copy');
        helper.remove();
      }

      setState(ok ? 'copied' : 'failed');
      window.setTimeout(() => setState('idle'), timeout);
    },
    [timeout]
  );

  return [state, copy];
};
