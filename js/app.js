(function () {
  const D = window.UNI_DATA;
  if (!D) return;

  const $ = (sel, root = document) => root.querySelector(sel);

  function renderDisclaimer() {
    const el = $("#disclaimer-slot");
    if (el) el.textContent = D.disclaimer;
  }

  function heatWanFromRank20(rank) {
    const t = (rank - 1) / 19;
    const v = 9.88 - t * 4.76;
    return `${v.toFixed(2)}万`;
  }

  function barPctUniversity(rank) {
    const t = (rank - 1) / 19;
    return Math.max(24, Math.round(100 - t * 58));
  }

  function heatWanFromHeat0to100(h, maxH) {
    const n = Math.max(0, h / maxH);
    const v = 5.15 + n * 4.85;
    return `${v.toFixed(2)}万`;
  }

  function renderRankUniversities() {
    const root = $("#rank-board-uni");
    if (!root || typeof window.iconSvgUni !== "function") return;
    const rows = D.top20
      .map((u, i) => {
        const pct = barPctUniversity(u.rank);
        const heat = heatWanFromRank20(u.rank);
        const icon = window.iconSvgUni(i);
        return `
      <li class="rank-row">
        <span class="rank-row__num">${u.rank}</span>
        <div class="rank-row__track" aria-hidden="true">
          <div class="rank-row__bar" style="width:${pct}%">
            <span class="rank-row__name" title="${u.name} · ${u.city}">${u.name}</span>
            <span class="rank-row__icon">${icon}</span>
          </div>
        </div>
        <span class="rank-row__heat">${heat}</span>
      </li>`;
      })
      .join("");
    root.innerHTML = `
      <div class="rank-board__head">
        <div class="rank-board__title">综合院校示意 · 热度榜</div>
        <div class="rank-board__topn">TOP 20</div>
      </div>
      <div class="rank-board__cols" aria-hidden="true">
        <span>序号</span><span>学校</span><span>热度</span>
      </div>
      <ul class="rank-board__list">${rows}</ul>
    `;
  }

  function renderRankMajors() {
    const root = $("#rank-board-major");
    if (!root || !D.majorTop20 || typeof window.iconSvgForMajor !== "function") return;
    const maxH = Math.max(...D.majorTop20.map((m) => m.heat));
    const rows = D.majorTop20
      .map((m) => {
        const pct = Math.max(22, Math.round((m.heat / maxH) * 100));
        const heat = heatWanFromHeat0to100(m.heat, maxH);
        const icon = window.iconSvgForMajor(m.icon || "generic");
        return `
      <li class="rank-row">
        <span class="rank-row__num">${m.rank}</span>
        <div class="rank-row__track" aria-hidden="true">
          <div class="rank-row__bar" style="width:${pct}%">
            <span class="rank-row__name" title="${m.name}">${m.name}</span>
            <span class="rank-row__icon">${icon}</span>
          </div>
        </div>
        <span class="rank-row__heat">${heat}</span>
      </li>`;
      })
      .join("");
    root.innerHTML = `
      <div class="rank-board__head">
        <div class="rank-board__title">本科热门专业示意</div>
        <div class="rank-board__topn">TOP 20</div>
      </div>
      <div class="rank-board__cols" aria-hidden="true">
        <span>序号</span><span>热门专业</span><span>热度</span>
      </div>
      <ul class="rank-board__list">${rows}</ul>
    `;
  }

  let activeIndustry = 0;

  function renderIndustryTabs() {
    const tabs = $("#industry-tabs");
    if (!tabs) return;
    tabs.innerHTML = D.industries
      .map(
        (ind, i) =>
          `<button type="button" data-idx="${i}" class="${i === activeIndustry ? "active" : ""}" aria-pressed="${
            i === activeIndustry
          }">${ind.name}<span class="industry-tab-heat"> · ${ind.heat}</span></button>`
      )
      .join("");

    tabs.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeIndustry = Number(btn.dataset.idx);
        renderIndustryTabs();
        renderIndustryPanel();
      });
    });
  }

  function renderIndustryPanel() {
    const panel = $("#industry-panel");
    if (!panel) return;
    const ind = D.industries[activeIndustry];
    const list = ind.top10
      .map(
        (name, i) =>
          `<li><span class="badge">${i + 1}</span>${name}</li>`
      )
      .join("");
    panel.innerHTML = `
      <h3>${ind.name}<span class="industry-panel-heat">热度 ${ind.heat}/100</span></h3>
      <p class="desc">${ind.desc}</p>
      <ol class="ol-top10">${list}</ol>
    `;
  }

  function buildTrendChartOption() {
    const years = D.trendYears.map(String);
    const seriesMeta = D.trendSeries;

    /** 使用完整年份折线（不用 timeline），避免合并后只显示 2016 单点的问题 */
    return {
      backgroundColor: "transparent",
      title: {
        text: "2016–2025 热门行业示意热度",
        left: "center",
        top: 8,
        textStyle: { color: "#2d2640", fontSize: 14 },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255,255,255,.96)",
        borderColor: "rgba(88,72,120,.12)",
        textStyle: { color: "#2d2640", fontSize: 12 },
      },
      legend: {
        type: "scroll",
        orient: "horizontal",
        bottom: 4,
        textStyle: { color: "#6b6280", fontSize: 10 },
        pageTextStyle: { color: "#6b6280" },
        data: seriesMeta.map((s) => s.name),
      },
      grid: { left: 48, right: 12, top: 44, bottom: 88 },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          start: 0,
          end: 100,
          height: 20,
          bottom: 28,
          borderColor: "rgba(88,72,120,.12)",
          backgroundColor: "rgba(124,106,232,.06)",
          fillerColor: "rgba(124,106,232,.22)",
          handleStyle: { color: "#7c6ae8", borderColor: "rgba(124,106,232,.45)" },
          textStyle: { color: "#6b6280", fontSize: 10 },
          dataBackground: {
            lineStyle: { color: "rgba(88,72,120,.2)" },
            areaStyle: { color: "rgba(124,106,232,.06)" },
          },
        },
      ],
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: years,
        axisLabel: { color: "#6b6280", fontSize: 11 },
        axisLine: { lineStyle: { color: "rgba(88,72,120,.18)" } },
      },
      yAxis: {
        type: "value",
        name: "热度",
        min: 40,
        max: 100,
        nameTextStyle: { color: "#6b6280", fontSize: 11 },
        axisLabel: { color: "#6b6280" },
        splitLine: { lineStyle: { color: "rgba(88,72,120,.08)" } },
      },
      animationDuration: 1400,
      animationEasing: "cubicOut",
      series: seriesMeta.map((s, si) => ({
        name: s.name,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: true,
        data: s.values,
        lineStyle: { width: 2.2, color: s.color },
        itemStyle: { color: s.color },
        emphasis: { focus: "series" },
        animationDelay: si * 60,
      })),
    };
  }

  let trendChart = null;

  function initTrendChart() {
    const dom = $("#trend-chart");
    if (!dom || typeof echarts === "undefined") return;
    trendChart = echarts.init(dom);
    trendChart.setOption(buildTrendChartOption(), { notMerge: true });

    window.addEventListener("resize", () => trendChart && trendChart.resize());

    const replay = $("#btn-chart-replay");
    if (replay) {
      replay.addEventListener("click", () => {
        trendChart.clear();
        trendChart.setOption(buildTrendChartOption(), { notMerge: true });
      });
    }
  }

  function mindmapText() {
    return `mindmap
  root((中国大学分析示意))
    综合排名
      学校条形热度榜
      Top20示意
    专业排名
      本科Top20条形榜
    专业选校
      十大热门行业
      各行业Top10校
    趋势图
      近十年折线示意
      缩放与重播动画
    导出
      竖版海报PNG
      导图SVG或PNG`;
  }

  async function initMindmap() {
    const pre = $("#mindmap-source");
    if (!pre || typeof mermaid === "undefined") return;
    pre.textContent = mindmapText();
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "Source Han Sans SC, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif",
    });
    await mermaid.run({ nodes: [pre] });
  }

  function renderPosterCopy() {
    const sub = $("#poster-subline");
    if (sub) {
      const y0 = D.trendYears[0];
      const y1 = D.trendYears[D.trendYears.length - 1];
      sub.textContent = `数据跨度 ${y0}–${y1} · 十大行业 × 各校优势示意`;
    }
    const n3 = $("#poster-n3");
    if (n3) n3.textContent = String(D.trendYears.length);
    const n4 = $("#poster-n4");
    if (n4) {
      n4.textContent = "示意";
      n4.style.fontSize = "clamp(0.95rem, 4vw, 1.1rem)";
    }
  }

  async function downloadPoster() {
    const node = $("#poster-canvas");
    if (!node || typeof html2canvas === "undefined") return;
    const btn = $("#btn-download-poster");
    if (btn) btn.disabled = true;
    try {
      const canvas = await html2canvas(node, {
        scale: Math.min(3, (window.devicePixelRatio || 2) * 1.5),
        backgroundColor: "#0c1222",
        logging: false,
        useCORS: true,
      });
      const a = document.createElement("a");
      a.download = "中国大学与行业热度-海报.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
      alert("海报导出失败，请换用 Chrome / Edge 重试。");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function downloadMindmapSvg() {
    const svg = $("#mindmap-box svg");
    if (!svg) {
      alert("导图尚未渲染完成，请稍候再试。");
      return;
    }
    const ser = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([ser], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "中国大学分析-思维导图.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadMindmapPng() {
    const box = $("#mindmap-box");
    if (!box || typeof html2canvas === "undefined") return;
    const btn = $("#btn-download-mindmap");
    if (btn) btn.disabled = true;
    try {
      const canvas = await html2canvas(box, {
        scale: Math.min(2.5, window.devicePixelRatio || 2),
        backgroundColor: "#141c2f",
        logging: false,
        useCORS: true,
      });
      const a = document.createElement("a");
      a.download = "中国大学分析-思维导图.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
      downloadMindmapSvg();
      alert("PNG 导出失败，已尝试下载 SVG；若仍失败请对导图区域截图。");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function initNavHighlight() {
    const links = document.querySelectorAll("nav.main-nav a[data-nav]");
    const map = [...links].map((a) => ({ id: a.getAttribute("href").slice(1), el: a }));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = en.target.id;
          map.forEach(({ el }) => el.classList.toggle("active", el.getAttribute("href") === `#${id}`));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    map.forEach(({ id }) => {
      const sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
    links.forEach((a) => {
      a.addEventListener("click", () => {
        setTimeout(() => {
          const href = a.getAttribute("href").slice(1);
          links.forEach((x) => x.classList.toggle("active", x.getAttribute("href") === `#${href}`));
        }, 0);
      });
    });
  }

  function wirePosterButton() {
    const b = $("#btn-download-poster");
    if (b) b.addEventListener("click", downloadPoster);
    const m = $("#btn-download-mindmap");
    if (m) m.addEventListener("click", downloadMindmapPng);

    const extra = document.createElement("button");
    extra.type = "button";
    extra.className = "btn secondary";
    extra.textContent = "导出导图 SVG";
    extra.style.marginLeft = "0";
    extra.addEventListener("click", downloadMindmapSvg);
    m?.parentElement?.appendChild(extra);
  }

  renderDisclaimer();
  renderRankUniversities();
  renderRankMajors();
  renderIndustryTabs();
  renderIndustryPanel();
  renderPosterCopy();
  initTrendChart();
  wirePosterButton();
  initNavHighlight();
  initMindmap();
})();
