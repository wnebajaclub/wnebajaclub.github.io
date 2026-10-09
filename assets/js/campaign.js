// Temporary crowdfunding section on the homepage (index.html, #crowdfunding).
//
// Where the numbers come from:
//   campaign.json  goal / raised / donors / days left, refreshed from the WNE
//                  crowdfunding page every 30 minutes by the "Crowdfunding sync"
//                  GitHub Action (.github/workflows/crowdfunding-sync.yml).
//                  "url" is the donation page, "ends" is the last day the
//                  section shows ("YYYY-MM-DD"); edit those two by hand if needed.
//
// The race track fills left to right toward a checkered finish line at the
// same percent as the amount raised. When the campaign is over, delete the #crowdfunding section
// and this script's <script> tag from index.html, campaign.json, and the
// workflow file.
(function () {
  const section = document.getElementById("crowdfunding");
  if (!section) return;

  const $ = (k) => section.querySelector('[data-cf="' + k + '"]');
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const endOf = (ymd) => (ymd ? new Date(ymd + "T23:59:59") : null);

  const track = section.querySelector(".cf-track");

  let shown = 0; // fraction currently painted (0..1)
  let anim = null;

  // Start the fill once the track scrolls into view (it sits below the hero).
  let inView = false, pending = null;
  const fig = section.querySelector(".cf-race");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        inView = true;
        io.disconnect();
        if (pending != null) animateTo(pending);
      }
    }, { threshold: 0.35 });
    io.observe(fig);
  } else {
    inView = true;
  }

  function setFill(f) {
    shown = f;
    track.style.setProperty("--p", f.toFixed(4));
  }

  function animateTo(target) {
    if (anim) cancelAnimationFrame(anim);
    if (reduceMotion) return setFill(target);
    const from = shown, start = performance.now();
    const dur = 900 + 1400 * Math.abs(target - from);
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      setFill(from + (target - from) * ease(t));
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  function render(d) {
    const goal = Number(d.goal) || 0;
    const raised = Number(d.raised) || 0;
    const frac = goal > 0 ? Math.min(1, raised / goal) : 0;
    const pct = goal > 0 ? Math.floor((raised / goal) * 100) : 0;

    $("raised").textContent = money(raised);
    $("goal").textContent = money(goal);
    $("pct").textContent = pct;
    $("pctLbl").textContent = frac >= 1 ? "of our goal" : "of the way there";
    $("m25").textContent = money(goal * 0.25);
    $("m50").textContent = money(goal * 0.5);
    $("m75").textContent = money(goal * 0.75);
    $("m100").textContent = money(goal);

    if (d.donors != null) {
      $("donors").textContent = Number(d.donors).toLocaleString("en-US");
      $("donorsLabel").textContent = Number(d.donors) === 1 ? "donor" : "donors";
    }

    // Days left: count down from the end date so it stays right between syncs.
    const end = endOf(d.ends);
    let days = end ? Math.max(0, Math.ceil((end - new Date()) / 86400000)) : d.daysLeft;
    if (days == null) {
      $("daysWrap").hidden = true;
    } else {
      $("days").textContent = days;
      $("daysLabel").textContent = days === 1 ? "day left" : "days left";
    }

    if (d.url) $("link").href = d.url;

    section.classList.toggle("cf-done", frac >= 1);
    section.querySelector(".cf-cap").textContent =
      frac >= 1 ? "We crossed the finish line \u2014 thank you!" : "Help us cross the finish line!";
    $("figure").setAttribute(
      "aria-label",
      "Progress track: " + pct + "% of the way to the " + money(goal) + " finish line"
    );
    if (inView) animateTo(frac);
    else pending = frac;
  }

  // Values already in the HTML are the fallback if campaign.json can't load.
  const fallback = {
    goal: Number($("goal").textContent.replace(/[^\d.]/g, "")),
    raised: Number($("raised").textContent.replace(/[^\d.]/g, "")),
    donors: Number($("donors").textContent),
    daysLeft: Number($("days").textContent),
    url: $("link").href,
    ends: section.dataset.ends,
  };

  const fallbackEnd = endOf(section.dataset.ends);
  if (fallbackEnd && new Date() > fallbackEnd) return; // campaign over: stay hidden
  section.hidden = false;

  fetch("campaign.json?t=" + Date.now(), { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d) => {
      const end = endOf(d.ends);
      if (end && new Date() > end) {
        section.hidden = true;
        return;
      }
      render(Object.assign({}, fallback, d));
    })
    .catch(() => render(fallback));
})();
