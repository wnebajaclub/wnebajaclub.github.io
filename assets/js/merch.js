// Temporary merch store section on the homepage (index.html, #merch).
//
// Everything you might need to change lives on the <section id="merch"> tag:
//   data-store-url   the Piesco / Chipply store link. The big buttons go here;
//                    each product card goes to that item inside this store.
//   data-start       when the section appears (ISO time with ET offset)
//   data-end         when it disappears, and what the "closes in" timer counts to
//
// Before data-start it stays hidden. To check it on the real site early, add
// ?merch=preview to the URL (e.g. wneu-bajasae.com/?merch=preview).
//
// When the store is over, delete the #merch section, this script's <script>
// tag in index.html, this file, and the "MERCH STORE" block in style.css.
(function () {
  const section = document.getElementById("merch");
  if (!section) return;

  // Product list from the Piesco store. Prices are the store's starting prices.
  // Columns: name, price, "from" price?, photo, store category, store product ID.
  //
  // Where each card links:
  //   product ID filled in  -> that item's page (store link + &apid=<ID>)
  //   product ID null       -> the item's category page (store link + &acid=...)
  // To find an item's product ID: open the item in the live store and copy the
  // number after "apid=" in the address bar.
  // Every photo shows the Golden Bear Racing (Baja) design, not Propulsion.
  // Most items come in both designs, so if you swap a photo, check the logo.
  const PRODUCTS = [
    ["Carhartt Midweight Hoodie", 53, false, "33314026/600/616e8f82-28d2-4020-bea2-6c44f2423e11", "hoods", null],
    ["Champion Eco Fleece Hoodie", 36, true, "33023653/600/c24399a9-4610-4bdf-9c11-5ec31606ab39", "hoods", null],
    ["Champion Eco Fleece Crewneck", 29, false, "33023652/600/4f2117ed-dbe0-4302-9096-85d78beb085a", "hoods", null],
    ["Carhartt Thermal-Lined Duck Jacket", 95, true, "33315814/600/cd376613-55b0-46ee-8366-4d982c7db17d", "jackets", null],
    ["Sport-Tek Competitor 1/4-Zip", 24, true, "33023655/600/7843762b-9aa9-4b9c-861e-52ce95aa0a06", "polos", null],
    ["Port Authority UV Micro-Mesh 1/4-Zip", 30, true, "33023651/600/cb5c0f5a-c7d8-4f4f-9950-c66ed811030a", "polos", null],
    ["Sport-Tek RacerMesh Polo", 21, true, "33023654/600/15c21521-171b-4a0b-881b-cc0763241bfc", "polos", null],
    ["Dickies Long Sleeve Work Shirt", 45, false, "33023656/600/c57ef2d1-c71b-4811-82f0-5ab3f74652ec", "work", null],
    ["Dickies Short Sleeve Work Shirt", 41, false, "33023657/600/974d01bc-6811-4e64-84c1-71d6934d491e", "work", null],
    ["Port Authority Northwest Slicker", 61, true, "33023658/600/afd8aebf-812d-474f-a483-0ef80fcbcd7e", "jackets", null],
    ["Under Armour Rival Fleece Joggers", 53, true, "33023647/600/35019243-47de-46fd-95d9-f6bc419edec3", "pants", null],
    ["Under Armour Rival Fleece Pants", 53, true, "33023646/600/f82622a8-2277-44eb-ae33-3b9c18b0742f", "pants", null],
    ["Under Armour Hustle 6.0 Backpack", 56, true, "33023648/600/4911a6ca-976a-4b97-a14d-c083d2a4ad51", "bags", null],
    ["Carhartt Watch Cap", 27, true, "33023659/600/feb0f44b-aa9d-4ba5-a269-8bb310bca0e3", "hats", null],
    ["Carhartt Mesh Back Cap", 32, true, "33023660/600/92ae2c0f-c7c5-4940-b28c-986fb7e7eeee", "hats", null],
    ["Richardson Trucker Cap", 19, true, "33315982/600/6fd6da25-6cb1-428b-aac1-911d83490d21", "hats", null],
    ["Port & Co Core Blend Tee", 14, true, "33314334/600/eac80938-2f58-47b4-8d72-812abd5002fe", "shirts", null],
    ["Port & Co Long Sleeve Tee", 19, true, "33314342/600/3a23b15f-98fb-455b-8dff-2b0f0085e29c", "shirts", null],
    ["Sport-Tek Competitor Tee", 15, true, "33314346/600/38f8e61e-8d18-4e15-b983-284d0e6aa942", "shirts", null],
    ["Sport-Tek Long Sleeve Competitor Tee", 17, true, "33314352/600/d81cc859-fa67-4aec-8384-1f79597c7dac", "shirts", null],
  ];
  const IMG_BASE = "https://cdn.chipply.net/images/productprocess/10048/682244/";

  // Store category IDs (the "acid=" number on each category tab in the store).
  const CATEGORIES = {
    hoods: 2900544,   // Hoods / Crews
    polos: 2900542,   // Polos and 1/4 Zips
    work: 2900543,    // Work Shirts
    jackets: 2900546, // Jackets
    pants: 2900547,   // Pants
    hats: 2900540,    // Headwear
    bags: 2900541,    // Backpacks
    shirts: 2914801,  // Shirts
  };

  const now = new Date();
  const start = new Date(section.dataset.start);
  const end = new Date(section.dataset.end);
  const preview = /[?&]merch=preview\b/.test(location.search);
  if (!preview && (now < start || now > end)) return; // stay hidden

  const url = section.dataset.storeUrl;
  section.querySelectorAll("[data-merch-link]").forEach((a) => (a.href = url));

  // Product rail
  const rail = section.querySelector(".merch-rail");
  const frag = document.createDocumentFragment();
  const itemUrl = (category, productId) => {
    try {
      const u = new URL(url);
      u.searchParams.delete("action");
      u.searchParams.delete("acid");
      u.searchParams.delete("apid");
      if (productId) u.searchParams.set("apid", productId);
      else if (CATEGORIES[category]) u.searchParams.set("acid", CATEGORIES[category]);
      return u.toString();
    } catch (e) {
      return url;
    }
  };

  PRODUCTS.forEach(([name, price, from, img, category, productId]) => {
    const a = document.createElement("a");
    a.className = "merch-card";
    a.href = itemUrl(category, productId);
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML =
      '<span class="merch-img"><img alt="" loading="lazy" decoding="async" width="600" height="600"></span>' +
      '<span class="merch-name"></span>' +
      '<span class="merch-price">' + (from ? "<small>from</small> " : "") + "$" + price + "</span>";
    const im = a.querySelector("img");
    im.src = IMG_BASE + img + ".jpg";
    im.onerror = () => a.classList.add("no-img");
    a.querySelector(".merch-name").textContent = name;
    a.setAttribute("aria-label", name + ", " + (from ? "from " : "") + "$" + price + " — shop the team store");
    frag.appendChild(a);
  });
  rail.appendChild(frag);

  // Scroll arrows
  const step = () => Math.max(240, rail.clientWidth * 0.8);
  const prev = section.querySelector(".merch-prev");
  const next = section.querySelector(".merch-next");
  prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));
  const syncArrows = () => {
    prev.disabled = rail.scrollLeft < 8;
    next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
  };
  rail.addEventListener("scroll", syncArrows, { passive: true });
  window.addEventListener("resize", syncArrows);

  // Countdown to close
  const cd = section.querySelector(".merch-countdown");
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let ms = end - new Date();
    if (ms <= 0) {
      if (!preview) { section.hidden = true; return; }
      ms = 0;
    }
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    cd.querySelector('[data-u="d"]').textContent = d;
    cd.querySelector('[data-u="h"]').textContent = pad(h);
    cd.querySelector('[data-u="m"]').textContent = pad(m);
    cd.querySelector('[data-u="s"]').textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  section.hidden = false;
  syncArrows();
})();
