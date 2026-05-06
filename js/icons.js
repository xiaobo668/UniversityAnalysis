/**
 * 排名条小图标：专业按语义 key 匹配；学校为另一组循环图标。
 * stroke 使用 currentColor，由外层 CSS 控制颜色。
 */
(function () {
  function S(paths, sw) {
    const w = sw != null ? sw : 1.75;
    return `<g fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
  }

  /** 本科专业：与 data.js 中 majorTop20[].icon 一一对应 */
  const MAJOR_PATHS = {
    cs: `<path d="M7 8l-3 4 3 4"/><path d="M17 8l3 4-3 4"/><path d="M14 6l-4 12"/>`,
    ai: `<circle cx="7" cy="9" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="17" cy="15" r="2"/><circle cx="9" cy="17" r="2"/><path d="M8.5 10.5l6.5-2.5M15.5 9l1 5M16 14l-6 2.5M9.5 16.5L8 12"/>`,
    ee: `<rect x="5" y="9" width="3" height="6" rx="0.5"/><rect x="16" y="9" width="3" height="6" rx="0.5"/><path d="M8 12h8"/><path d="M4 7c2 1 3 2 4 5M20 7c-2 1-3 2-4 5"/>`,
    medicine: `<rect x="7" y="5" width="10" height="14" rx="2"/><path d="M12 8.5v7"/><path d="M8.5 12h7"/><path d="M6 18c1.5 1 3 1.5 6 1.5s4.5-.5 6-1.5"/>`,
    finance: `<path d="M4 17V7h16v10"/><path d="M7 14l3-3 2 2 5-5"/><circle cx="17" cy="9" r="1.5" fill="currentColor" stroke="none"/>`,
    electric: `<path d="M13 2L5 13h6l-2 9 10-12h-6l2-8z"/><path d="M3 20h18"/>`,
    software: `<path d="M12 2l10 6v4L12 18 2 12V8l10-6z"/><path d="M2 12l10 6 10-6"/><path d="M12 8v8"/>`,
    law: `<path d="M12 3v18"/><path d="M6 7h12"/><path d="M6 7l-2.5 8h5L6 7z"/><path d="M18 7l-2.5 8h5L18 7z"/>`,
    data: `<ellipse cx="12" cy="6" rx="7" ry="2"/><path d="M5 6v5c0 1.5 3 3 7 3s7-1.5 7-3V6"/><path d="M5 11v5c0 1.5 3 3 7 3s7-1.5 7-3v-5"/><path d="M8 14h8M9 17h4"/>`,
    comm: `<path d="M12 2v4"/><path d="M8.5 4.5a12 12 0 0 0-5 8"/><path d="M15.5 4.5a12 12 0 0 1 5 8"/><path d="M6 14h2.5"/><path d="M15.5 14H18"/><circle cx="12" cy="18" r="2"/>`,
    automation: `<path d="M4 18V14"/><path d="M4 10V6"/><path d="M10 18v-9"/><path d="M10 5V3"/><path d="M16 18v-5"/><path d="M16 11V6"/><path d="M20 18v-8"/><rect x="2" y="19" width="4" height="2" rx="0.5"/><rect x="8" y="19" width="4" height="2" rx="0.5"/><rect x="14" y="19" width="4" height="2" rx="0.5"/><rect x="18" y="19" width="4" height="2" rx="0.5"/>`,
    accounting: `<path d="M6 4h12v16l-1.5-1.5L15 20l-1.5-1.5L12 20l-1.5-1.5L9 20l-1.5 1.5L6 20V4z"/><path d="M9 9h6"/><path d="M9 13h4"/><path d="M9 17h7"/>`,
    mechanical: `<path d="M5 4l7 14"/><path d="M19 4l-7 14"/><path d="M7 19h3"/><path d="M14 19h3"/><circle cx="8.5" cy="19" r="1.5"/><circle cx="15.5" cy="19" r="1.5"/>`,
    dental: `<path d="M10 3h4a2.5 2.5 0 0 1 2.5 2.5V9c0 2.5-.8 9-1.8 10.2-.6.7-1.4.3-1.7-.8-.4-1.4-1-2.4-1.8-2.4s-1.4 1-1.8 2.4c-.3 1.1-1.1 1.5-1.7.8C7.8 18 7 11.5 7 9V5.5A2.5 2.5 0 0 1 10 3z"/>`,
    math: `<path d="M8 5H5v14h3"/><path d="M8 5l5.5 7L8 19"/><path d="M14 8h7"/><path d="M14 12h5"/><path d="M14 16h7"/>`,
    energy: `<circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5M5 5l2 2M17 17l2 2M19 5l-2 2M5 19l2-2"/>`,
    ic: `<rect x="7" y="7" width="10" height="10" rx="1"/><rect x="10" y="10" width="4" height="4" rx="0.5"/><path d="M12 7V5M12 19v-2M7 12H5M19 12h-2M9 7H7M17 7h-2M9 17H7M17 17h-2"/>`,
    arch: `<path d="M3 21h18"/><path d="M5 21V11l7-6 7 6v10"/><path d="M9 21V14h6v7"/><path d="M12 5l-1 2h2l-1-2z"/>`,
    stats: `<path d="M4 20V16"/><path d="M9 20V10"/><path d="M14 20V13"/><path d="M19 20V5"/><path d="M3 20h18"/>`,
    security: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="2"/><path d="M10.2 12l1.1 1.1 2.5-2.5"/>`,
    generic: `<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/>`,
  };

  function wrapSvg(inner) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${inner}</svg>`;
  }

  window.iconSvgForMajor = function (key) {
    const paths = MAJOR_PATHS[key] || MAJOR_PATHS.generic;
    const sw = key === "dental" || key === "math" ? 1.5 : 1.75;
    return wrapSvg(S(paths, sw));
  };

  window.RANK_ICONS = {
    /** 学校用图标（循环使用 8 款） */
    uni: [
      S('<path d="M12 3L2 9h3v10h4V14h6v5h4V9h3L12 3z"/>'),
      S('<circle cx="12" cy="8" r="3"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M12 11v3"/>'),
      S('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h8M8 12h6M8 16h4"/>'),
      S('<path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-6h6v6"/><path d="M12 4v3"/>'),
      S('<ellipse cx="12" cy="6" rx="6" ry="2"/><path d="M6 6v12c0 2 2.5 4 6 4s6-2 6-4V6"/>'),
      S('<path d="M3 21h18"/><path d="M5 21V12l7-3 7 3v9"/><circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none"/>'),
      S('<polygon points="12,2 22,8 22,16 12,22 2,16 2,8"/><path d="M12 8v8M8 12h8"/>'),
      S('<path d="M7 4h10v16H7z"/><path d="M10 8h4M10 12h4M10 16h2"/>'),
    ],
  };

  window.iconSvgUni = function (index) {
    const arr = window.RANK_ICONS.uni;
    return wrapSvg(arr[index % arr.length]);
  };
})();
