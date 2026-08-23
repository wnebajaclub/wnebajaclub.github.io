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
