/**
 * Canvas particle field that reacts to pointer movement.
 * Renders connected nodes on a fixed full-viewport layer.
 */
export class ParticleField {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: 0, y: 0, active: false };
    this.animId = 0;
    this.count = 80;
    this.connectDist = 140;
    this.mouseRadius = 180;

    this.onResize = this.onResize.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.tick = this.tick.bind(this);
  }

  /** Boot particle simulation and event listeners. */
  start() {
    this.onResize();
    this.spawnParticles();
    window.addEventListener("resize", this.onResize);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    window.addEventListener("pointerleave", this.onLeave);
    this.animId = requestAnimationFrame(this.tick);
  }

  /** Tear down animation loop and listeners. */
  stop() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerleave", this.onLeave);
  }

  onResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  /** @param {PointerEvent} event */
  onMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    this.mouse.active = true;
  }

  onLeave() {
    this.mouse.active = false;
  }

  spawnParticles() {
    this.particles = Array.from({ length: this.count }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      hue: Math.random() > 0.5 ? 270 : 190,
    }));
  }

  tick() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.w) p.vx *= -1;
      if (p.y < 0 || p.y > this.h) p.vy *= -1;

      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.mouseRadius) {
          const force = (this.mouseRadius - dist) / this.mouseRadius;
          p.vx -= (dx / dist) * force * 0.08;
          p.vy -= (dy / dist) * force * 0.08;
        }
      }

      p.vx *= 0.99;
      p.vy *= 0.99;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.85)`;
      this.ctx.fill();
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.connectDist) {
          const alpha = (1 - dist / this.connectDist) * 0.35;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(this.tick);
  }
}

/**
 * Binds pointer-driven 3D tilt to a host element.
 * @param {HTMLElement} el
 * @param {{ maxTilt?: number, perspective?: number }} opts
 */
export function bindTilt(el, opts = {}) {
  const maxTilt = opts.maxTilt ?? 14;
  const perspective = opts.perspective ?? 900;

  el.style.transformStyle = "preserve-3d";
  el.style.transition = "transform 0.12s ease-out";

  const onMove = (event) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (event.clientX - cx) / (rect.width / 2);
    const dy = (event.clientY - cy) / (rect.height / 2);
    const rotY = dx * maxTilt;
    const rotX = -dy * maxTilt;
    el.style.transform = `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
  };

  const onLeave = () => {
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);

  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
  };
}

/**
 * Observes elements and adds a `.is-visible` class when they enter the viewport.
 * @param {string} selector
 */
export function observeReveal(selector) {
  const nodes = document.querySelectorAll(selector);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  nodes.forEach((node) => io.observe(node));
  return io;
}
