// Temporary crowdfunding banner.
//
// Edit the settings below — nothing else needs touching.
//   URL      the crowdfunding page. While this is empty the banner stays hidden,
//            so a half-set-up banner can never go live with a dead link.
//   ENDS     last day the banner shows, as "YYYY-MM-DD". It disappears on its own
//            the day after. The date is never shown to visitors.
//            Leave empty to keep it up until it's removed.
//   MESSAGE  the line of text in the banner.
//   BUTTON   the button label.
//
// To take it down for good: delete the <script src="assets/js/banner.js"> line
// from each page (or just let ENDS pass).
const BANNER = {
  URL: "https://alumni.wne.edu/s/1919/cf20/interior.aspx?sid=1919&gid=2&pgid=2139",
  ENDS: "2026-10-22",
  MESSAGE: "Help GBR4 cross the finish line — support our crowdfunding campaign.",
  BUTTON: "Donate",
};

(function () {
  if (!BANNER.URL) return;

 // Hide automatically after the end of the ENDS day (local time).
 if (BANNER.ENDS) {
   const end = new Date(BANNER.ENDS + "T23:59:59");
   if (!isNaN(end) && new Date() > end) return;
 }

 // Remember a dismissal per campaign link, so a new campaign shows again.
 const key = "gbr-banner-closed:" + BANNER.URL;
  try {
    if (localStorage.getItem(key)) return;
  } catch (e) { /* storage blocked — just show the banner */ }

 const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

 // Inserted where this script tag sits (just above the header), synchronously,
 // so the page doesn't jump when it appears.
 document.currentScript.insertAdjacentHTML(
   "beforebegin",
   '<aside class="promo-banner" role="region" aria-label="Crowdfunding campaign">' +
   '<div class="promo-inner">' +
   '<p class="promo-text">' + esc(BANNER.MESSAGE) + "</p>" +
   '<a class="promo-btn" href="' + esc(BANNER.URL) + '" target="_blank" rel="noopener">' + esc(BANNER.BUTTON) + "</a>" +
   "</div>" +
   '<button class="promo-close" type="button" aria-label="Dismiss banner">&times;</button>' +
   "</aside>"
   );

 const banner = document.currentScript.previousElementSibling;
  banner.querySelector(".promo-close").addEventListener("click", () => {
    banner.remove();
    try { localStorage.setItem(key, "1"); } catch (e) {}
  });
})();
