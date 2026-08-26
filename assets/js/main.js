// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// Copy the contact address. mailto: silently does nothing for anyone without a
// mail client registered with their OS, so this is the reliable path.
document.querySelectorAll(".copy-mail").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const address = btn.dataset.mail;
    const restore = () => {
      btn.textContent = "Copy";
      btn.classList.remove("is-copied");
    };
    try {
      await navigator.clipboard.writeText(address);
      btn.textContent = "Copied";
      btn.classList.add("is-copied");
      setTimeout(restore, 1800);
    } catch {
      // clipboard blocked (insecure context, or permission denied) — select the
      // address instead so the visitor can copy it by hand
      const link = btn.parentElement.querySelector("a");
      const range = document.createRange();
      range.selectNodeContents(link);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      btn.textContent = "Select & copy";
      setTimeout(restore, 2600);
    }
  });
});

// Highlights slideshow. Written so the markup is already correct with JS off:
// slide 1 carries is-active in the HTML, so a failure here leaves a single
// static photo rather than an empty frame.
document.querySelectorAll(".highlights").forEach((root) => {
  const slides = [...root.querySelectorAll(".hl-slide")];
  const bar = root.querySelector(".hl-progress span");
  const currentEl = root.querySelector('[data-hl="current"]');
  if (slides.length < 2) return;

  // Dots are built from however many slides exist rather than hand-written in
  // the HTML. Adding a photo is then a single <figure> in index.html - no
  // second edit to keep a dot list in sync, which is the kind of thing that
  // silently drifts. (With JS off there are no dots, but there's also no
  // slideshow to drive, so a row of dead dots would be worse than none.)
  const dotWrap = root.querySelector(".hl-dots");
  dotWrap.innerHTML = "";
  const dots = slides.map((_, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "hl-dot" + (i === 0 ? " is-active" : "");
    d.setAttribute("role", "tab");
    d.setAttribute("aria-selected", i === 0 ? "true" : "false");
    d.setAttribute("aria-label", `Highlight ${i + 1}`);
    dotWrap.appendChild(d);
    return d;
  });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const interval = Number(root.dataset.interval) || 5200;

  let index = 0;
  let paused = reduced;
  let startedAt = 0;
  let raf = null;

  root.querySelector('[data-hl="total"]').textContent = String(slides.length);

  // Only the first slide ships with a real src; the rest carry data-src and are
  // fetched here, a couple ahead of being shown. Native loading="lazy" is no
  // help for a carousel — every slide sits at inset:0 inside the stage, so the
  // moment the section scrolls into view the browser considers all of them
  // visible and downloads the entire set at once. With ~27 photos that was
  // several megabytes in one burst for images most visitors never reach.
  function ensureLoaded(i) {
    for (let k = 0; k <= 2; k++) {
      const img = slides[(i + k) % slides.length].querySelector("img[data-src]");
      if (img) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      }
    }
  }

  function show(next) {
    index = (next + slides.length) % slides.length;
    ensureLoaded(index);
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    currentEl.textContent = String(index + 1);
    startedAt = performance.now();
    if (bar) bar.style.width = "0%";
  }

  function tick(now) {
    if (!paused) {
      const elapsed = now - startedAt;
      if (bar) bar.style.width = Math.min(100, (elapsed / interval) * 100) + "%";
      if (elapsed >= interval) show(index + 1);
    }
    raf = requestAnimationFrame(tick);
  }

  function setPaused(state) {
    paused = state;
    // resuming restarts the current slide's clock instead of firing instantly
    if (!paused) startedAt = performance.now();
  }

  root.querySelector('[data-hl="prev"]').addEventListener("click", () => { show(index - 1); });
  root.querySelector('[data-hl="next"]').addEventListener("click", () => { show(index + 1); });
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));

  // There is no play/pause button — the slideshow just cycles. It still holds
  // while hovered or keyboard-focused, which is what keeps it usable: a photo
  // someone is actually looking at (or tabbing through) shouldn't slide away
  // mid-look, and it satisfies WCAG 2.2.2's "mechanism to pause" without
  // putting another control on screen.
  let hovered = false;
  let focused = false;
  const sync = () => { if (!reduced) setPaused(hovered || focused); };
  root.addEventListener("mouseenter", () => { hovered = true; sync(); });
  root.addEventListener("mouseleave", () => { hovered = false; sync(); });
  root.addEventListener("focusin", () => { focused = true; sync(); });
  root.addEventListener("focusout", () => { focused = false; sync(); });

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
  });

  // Don't burn frames animating a slideshow that's scrolled off screen.
  const vis = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        if (!raf) { startedAt = performance.now(); raf = requestAnimationFrame(tick); }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }
  }, { threshold: 0.25 });
  vis.observe(root);

  setPaused(reduced);
  show(0);
});

// Reveal-on-scroll
const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        observer.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
