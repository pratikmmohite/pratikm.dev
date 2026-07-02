import { ParticleField, bindTilt, observeReveal } from "./scene.js";

/** Loads HTML templates from templates.html into the DOM. */
async function loadTemplates() {
  const response = await fetch("./templates.html");
  const content = await response.text();
  document.getElementById("template-container").innerHTML = content;
}

/** @param {string} templateId */
function getTemplateContent(templateId) {
  const template = document.getElementById(templateId);
  return template ? template.content : document.createDocumentFragment();
}

/** @param {ShadowRoot} shadow @param {string} templateId */
function attachTemplateToShadowDom(shadow, templateId) {
  shadow.replaceChildren(getTemplateContent(templateId));
}

/** Fixed top navigation bar. */
class PNav extends HTMLElement {
  connectedCallback() {
    attachTemplateToShadowDom(this.attachShadow({ mode: "open" }), "p-nav");
  }
}

/** Full-viewport canvas particle background. */
class PParticles extends HTMLElement {
  connectedCallback() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    this.appendChild(canvas);
    this.field = new ParticleField(canvas);
    this.field.start();
  }

  disconnectedCallback() {
    this.field?.stop();
  }
}

/** Hero stat cards loaded from skills.json highlights. */
class PStats extends HTMLElement {
  url = "./resource/skills.json";

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<div class="stats"><p class="stats__loading">…</p></div>`;
    this.load();
  }

  async load() {
    try {
      const data = await fetch(this.url).then((r) => r.json());
      const html = data.highlights
        .map(
          (h) => `
          <div class="stat-card">
            <div class="stat-card__value">${h.value}</div>
            <div class="stat-card__label">${h.label}</div>
          </div>`
        )
        .join("");
      this.shadowRoot.innerHTML = `
        <style>
          .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.75rem; }
          .stat-card {
            padding: 1rem 0.5rem;
            border-radius: 10px;
            border: 1px solid rgba(139,92,246,0.22);
            background: rgba(16,16,30,0.72);
            text-align: center;
            transition: border-color 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1);
          }
          .stat-card:hover { border-color: rgba(34,211,238,0.35); transform: translateY(-3px); }
          .stat-card__value {
            font-family: "Syne", system-ui, sans-serif;
            font-size: 1.6rem; font-weight: 800; color: #22d3ee; line-height: 1;
          }
          .stat-card__label {
            font-size: 0.65rem; color: #64748b; margin-top: 0.3rem;
            text-transform: uppercase; letter-spacing: 0.08em;
          }
          @media (max-width: 600px) { .stats { grid-template-columns: repeat(2,1fr); } }
        </style>
        <div class="stats">${html}</div>`;
    } catch {
      this.shadowRoot.innerHTML = "";
    }
  }
}

/** 3D orbiting ring of skill nodes from skills.json. */
class PSkillOrbit extends HTMLElement {
  url = "./resource/skills.json";

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<p style="color:#64748b;font-size:0.85rem">Loading orbit…</p>`;
    this.load();
  }

  async load() {
    try {
      const data = await fetch(this.url).then((r) => r.json());
      const nodes = data.stack
        .map(
          (skill, i) => {
            const angle = (360 / data.stack.length) * i;
            return `<div class="orbit-node" style="--angle:${angle}deg;--color:${skill.color}">
              <span class="orbit-node__label">${skill.name}</span>
              <span class="orbit-node__bar" style="width:${skill.level}%"></span>
            </div>`;
          }
        )
        .join("");

      this.shadowRoot.innerHTML = `
        <style>
          .orbit-wrap {
            position: relative;
            height: 340px;
            display: flex;
            align-items: center;
            justify-content: center;
            perspective: 900px;
          }
          .orbit-ring {
            position: relative;
            width: 280px;
            height: 280px;
            transform-style: preserve-3d;
            animation: spin 30s linear infinite;
          }
          .orbit-ring:hover { animation-play-state: paused; }
          @keyframes spin {
            from { transform: rotateX(60deg) rotateZ(0deg); }
            to   { transform: rotateX(60deg) rotateZ(360deg); }
          }
          .orbit-core {
            position: absolute;
            top: 50%; left: 50%;
            width: 80px; height: 80px;
            margin: -40px 0 0 -40px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(139,92,246,0.5), transparent);
            border: 1px solid rgba(139,92,246,0.4);
            display: flex; align-items: center; justify-content: center;
            font-size: 0.65rem; font-weight: 700; color: #22d3ee;
            text-transform: uppercase; letter-spacing: 0.1em;
            box-shadow: 0 0 40px rgba(139,92,246,0.4);
          }
          .orbit-node {
            position: absolute;
            top: 50%; left: 50%;
            width: 110px;
            transform-style: preserve-3d;
            transform: rotateZ(var(--angle)) translateX(140px) rotateZ(calc(-1 * var(--angle)));
          }
          .orbit-node__label {
            display: block;
            padding: 0.4rem 0.65rem;
            border-radius: 8px;
            background: rgba(16,16,30,0.9);
            border: 1px solid var(--color);
            color: var(--color);
            font-size: 0.72rem;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 0 12px color-mix(in srgb, var(--color) 30%, transparent);
            white-space: nowrap;
          }
          .orbit-node__bar {
            display: block;
            height: 2px;
            margin-top: 4px;
            background: var(--color);
            border-radius: 2px;
            opacity: 0.6;
          }
          @media (max-width: 600px) {
            .orbit-wrap { height: 260px; }
            .orbit-ring { width: 200px; height: 200px; }
            .orbit-node { width: 90px; transform: rotateZ(var(--angle)) translateX(100px) rotateZ(calc(-1 * var(--angle))); }
            .orbit-node__label { font-size: 0.62rem; padding: 0.3rem 0.5rem; }
          }
        </style>
        <div class="orbit-wrap">
          <div class="orbit-ring">
            <div class="orbit-core">Stack</div>
            ${nodes}
          </div>
        </div>`;

      const ring = this.shadowRoot.querySelector(".orbit-ring");
      if (ring) {
        bindTilt(ring, { maxTilt: 10, perspective: 900 });
      }
    } catch {
      this.shadowRoot.innerHTML = `<p style="color:#f472b6">Could not load skills.</p>`;
    }
  }
}

/** 3D-tilt project cards loaded from index.json. */
class PProjectGrid extends HTMLElement {
  url = "./resource/index.json";
  tagColors = {
    cyan: "#22d3ee",
    violet: "#8b5cf6",
    pink: "#f472b6",
    lime: "#a3e635",
  };

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<p style="color:#64748b;padding:1rem">Loading projects…</p>`;
    this.load();
  }

  async load() {
    try {
      const projects = await fetch(this.url).then((r) => r.json());
      const cards = projects
        .map((p) => {
          const tags = (p.tags || [])
            .map(
              (t) =>
                `<span class="tag" style="--tc:${this.tagColors[t.color] || "#22d3ee"}">${t.text}</span>`
            )
            .join("");
          const isExternal = p.demo_link.startsWith("http");
          return `
            <article class="card" data-tilt>
              <div class="card__inner">
                <div class="card__glow" aria-hidden="true"></div>
                <span class="card__id">#${p.project_id}</span>
                <h3 class="card__title">${p.title}</h3>
                <p class="card__desc">${p.description || "An interactive web experiment."}</p>
                ${tags ? `<div class="card__tags">${tags}</div>` : ""}
                <div class="card__actions">
                  <a class="card__btn card__btn--demo" href="${p.demo_link}" ${isExternal ? 'target="_blank" rel="noopener"' : ""}>
                    Launch demo →
                  </a>
                  <a class="card__btn card__btn--code" href="${p.project_link}" target="_blank" rel="noopener">
                    Source
                  </a>
                </div>
              </div>
            </article>`;
        })
        .join("");

      this.shadowRoot.innerHTML = `
        <style>
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.25rem;
          }
          .card {
            perspective: 800px;
            cursor: default;
          }
          .card__inner {
            position: relative;
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid rgba(139,92,246,0.22);
            background: rgba(16,16,30,0.8);
            backdrop-filter: blur(12px);
            overflow: hidden;
            transition: border-color 0.3s;
            transform-style: preserve-3d;
            will-change: transform;
          }
          .card__glow {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.15), transparent 60%);
            pointer-events: none;
            transition: opacity 0.3s;
            opacity: 0;
          }
          .card:hover .card__glow { opacity: 1; }
          .card:hover .card__inner { border-color: rgba(34,211,238,0.4); }
          .card__id {
            font-size: 0.68rem;
            color: #64748b;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          .card__title {
            font-family: "Syne", system-ui, sans-serif;
            font-size: 1.2rem;
            font-weight: 800;
            color: #f1f5f9;
            margin: 0.4rem 0 0.6rem;
          }
          .card__desc {
            font-size: 0.82rem;
            line-height: 1.65;
            color: #94a3b8;
            margin-bottom: 1rem;
            min-height: 3.5em;
          }
          .card__tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.1rem; }
          .tag {
            padding: 0.2rem 0.55rem;
            border-radius: 999px;
            font-size: 0.68rem;
            font-weight: 700;
            color: var(--tc);
            border: 1px solid var(--tc);
            background: color-mix(in srgb, var(--tc) 12%, transparent);
          }
          .card__actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
          .card__btn {
            padding: 0.45rem 0.9rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .card__btn:hover { transform: translateY(-1px); }
          .card__btn--demo {
            background: linear-gradient(135deg, #8b5cf6, #6d28d9);
            color: white;
            box-shadow: 0 2px 12px rgba(139,92,246,0.35);
          }
          .card__btn--code {
            color: #22d3ee;
            border: 1px solid rgba(34,211,238,0.35);
          }
        </style>
        <div class="grid">${cards}</div>`;

      this.shadowRoot.querySelectorAll("[data-tilt]").forEach((card) => {
        const inner = card.querySelector(".card__inner");
        const glow = card.querySelector(".card__glow");
        if (!inner) return;

        card.addEventListener("pointermove", (e) => {
          const rect = card.getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width) * 100;
          const my = ((e.clientY - rect.top) / rect.height) * 100;
          if (glow) {
            glow.style.setProperty("--mx", `${mx}%`);
            glow.style.setProperty("--my", `${my}%`);
          }
          const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
          const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
          inner.style.transform = `perspective(800px) rotateX(${-dy * 10}deg) rotateY(${dx * 10}deg) translateZ(8px)`;
        });

        card.addEventListener("pointerleave", () => {
          inner.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
        });
      });
    } catch {
      this.shadowRoot.innerHTML = `<p style="color:#f472b6">Could not load projects.</p>`;
    }
  }
}

/** CSS 3D cube — auto-rotates and optionally follows pointer. */
class PCube extends HTMLElement {
  offset = "calc(var(--size) / 4)";
  size = "30vh";
  interactive = false;
  static observedAttributes = ["offset", "size", "interactive"];

  connectedCallback() {
    this.initFields();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = this.getCubeMarkup();
    if (this.interactive) {
      this.bindPointer();
    }
  }

  attributeChangedCallback(name, _old, val) {
    if (name === "offset") this.offset = val;
    if (name === "size") this.size = val;
    if (name === "interactive") this.interactive = val !== null;
    this.refreshView();
  }

  initFields() {
    this.offset = this.getAttribute("offset") ?? "calc(var(--size) / 4)";
    this.size = this.getAttribute("size") ?? "30vh";
    this.interactive = this.hasAttribute("interactive");
  }

  /** Pointer tracking for interactive tilt on the 3D scene. */
  bindPointer() {
    const scene = this.shadow?.querySelector(".scene");
    if (!scene) return;

    const onMove = (e) => {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      scene.style.setProperty("--rx", `${-dy * 22}deg`);
      scene.style.setProperty("--ry", `${dx * 22}deg`);
    };

    const onLeave = () => {
      scene.style.setProperty("--rx", "0deg");
      scene.style.setProperty("--ry", "0deg");
    };

    window.addEventListener("pointermove", onMove);
    this.addEventListener("pointerleave", onLeave);
    this._cleanup = () => window.removeEventListener("pointermove", onMove);
  }

  disconnectedCallback() {
    this._cleanup?.();
  }

  refreshView() {
    const scene = this.shadowRoot?.querySelector(".scene");
    if (scene) {
      scene.style.setProperty("--size", this.size);
      scene.style.setProperty("--offset", this.offset);
    }
  }

  getCubeMarkup() {
    const animClass = this.interactive ? "scene scene--interactive" : "scene";
    return `
      <style>
        :host { display: block; }
        .${animClass.split(" ")[0]} {
          --size: ${this.size};
          --offset: ${this.offset};
          --rx: 0deg;
          --ry: 0deg;
          height: var(--size);
          width: var(--size);
          transform-style: preserve-3d;
          animation: spin 8s linear infinite;
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.15s ease-out;
        }
        .scene--interactive:hover { animation-play-state: paused; }
        @keyframes spin {
          from { transform: rotateX(var(--rx)) rotateY(var(--ry)) rotate3d(1,1,1,0deg); }
          to   { transform: rotateX(var(--rx)) rotateY(var(--ry)) rotate3d(1,1,1,360deg); }
        }
        .box {
          position: absolute;
          width: 100%; height: 100%;
          border: 1px solid rgba(139,92,246,0.35);
          background: radial-gradient(var(--size), rgba(139,92,246,0.6) 0%, rgba(34,211,238,0.15) 60%, rgba(8,8,18,0.9) 100%);
          backface-visibility: visible;
        }
        .front  { transform: rotateY(0deg)   translateZ(var(--offset)); }
        .back   { transform: rotateY(180deg) translateZ(var(--offset)); }
        .left   { transform: rotateY(-90deg) translateZ(var(--offset)); }
        .right  { transform: rotateY(90deg)  translateZ(var(--offset)); }
        .top    { transform: rotateX(90deg)  translateZ(var(--offset)); }
        .bottom { transform: rotateX(-90deg) translateZ(var(--offset)); }
      </style>
      <div class="${animClass}">
        <div class="box front"></div>
        <div class="box back"></div>
        <div class="box left"></div>
        <div class="box right"></div>
        <div class="box top"></div>
        <div class="box bottom"></div>
      </div>`;
  }
}

class PLoadHtml extends HTMLElement {
  path = "";
  static observedAttributes = ["path"];

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.refreshView();
  }

  attributeChangedCallback(name, _old, val) {
    if (name === "path") this.path = val;
    this.refreshView();
  }

  refreshView() {
    if (!this.shadow) return;
    this.shadow.innerHTML = "<div>Loading…</div>";
    fetch(this.path)
      .then((r) => r.text())
      .then((html) => { this.shadow.innerHTML = html; })
      .catch(() => { this.shadow.innerHTML = "<div>Failed to load.</div>"; });
  }
}

await loadTemplates();

customElements.define("p-nav", PNav);
customElements.define("p-particles", PParticles);
customElements.define("p-stats", PStats);
customElements.define("p-skill-orbit", PSkillOrbit);
customElements.define("p-project-grid", PProjectGrid);
customElements.define("p-cube", PCube);
customElements.define("p-load", PLoadHtml);

observeReveal(".reveal");
