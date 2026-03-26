import { useLayoutEffect, useRef } from 'react';

/**
 * Renderiza HTML del KB y añade botón "Copiar" a cada <pre> (scripts).
 */
export default function ChatRichHtml({ html, className }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const pres = root.querySelectorAll('pre');
    pres.forEach((pre) => {
      if (pre.dataset.koinCopyWrap === '1') return;
      pre.dataset.koinCopyWrap = '1';

      const wrap = document.createElement('div');
      wrap.className = 'koin-pre-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'koin-pre-copy-btn';
      btn.setAttribute('aria-label', 'Copiar código');
      btn.textContent = 'Copiar';

      const copy = async () => {
        const text = pre.textContent ?? '';
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          return;
        }
        btn.textContent = '¡Copiado!';
        const t = setTimeout(() => {
          btn.textContent = 'Copiar';
        }, 2000);
        btn._koinT = t;
      };

      btn.addEventListener('click', copy);
      wrap.appendChild(btn);
    });

    return () => {
      /* no remove listeners from detached nodes — html change replaces subtree */
    };
  }, [html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
