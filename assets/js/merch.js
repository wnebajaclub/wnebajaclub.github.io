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
    ["Carhartt Midweight Hoodie", 58, false, "33314026/600/616e8f82-28d2-4020-bea2-6c44f2423e11", "hoods", null],
    ["Champion Eco Fleece Hoodie", 40, true, "33023653/600/aa31e1ff-4ed4-42b3-b65b-99e49405a3b5", "hoods", null],
    ["Champion Eco Fleece Crewneck", 32, false, "33348190/600/2065e6d0-21ac-4cb7-856b-2c7568bae902", "hoods", null],
    ["Carhartt Thermal-Lined Duck Jacket", 110, true, "33315814/600/cd376613-55b0-46ee-8366-4d982c7db17d", "jackets", null],
    ["Sport-Tek Competitor 1/4-Zip", 26, true, "33023655/600/7843762b-9aa9-4b9c-861e-52ce95aa0a06", "polos", null],
    ["Port Authority UV Micro-Mesh 1/4-Zip", 33, true, "33023651/600/2ac6b604-f5e5-4fce-af21-2d77d8a165de", "polos", null],
    ["Sport-Tek RacerMesh Polo", 23, true, "33023654/600/72641def-3d4d-4ec5-a5bf-fa4b9e26a9c6", "polos", null],
    ["Dickies Long Sleeve Work Shirt", 50, false, "33023656/600/c57ef2d1-c71b-4811-82f0-5ab3f74652ec", "work", null],
    ["Dickies Short Sleeve Work Shirt", 45, false, "33023657/600/974d01bc-6811-4e64-84c1-71d6934d491e", "work", null],
    ["Port Authority Northwest Slicker", 67, true, "33023658/600/afd8aebf-812d-474f-a483-0ef80fcbcd7e", "jackets", null],
    ["Under Armour Rival Fleece Joggers", 58, true, "33023647/600/35019243-47de-46fd-95d9-f6bc419edec3", "pants", null],
    ["Under Armour Rival Fleece Pants", 58, true, "33023646/600/f82622a8-2277-44eb-ae33-3b9c18b0742f", "pants", null],
    ["Under Armour Hustle 6.0 Backpack", 61, true, "33023648/600/beb61678-7a82-4e26-a9ba-56f8bdcf7b2b", "bags", null],
    ["Carhartt Watch Cap", 29, true, "33023659/600/9bbdffdc-efdf-4247-ab03-f744f81bafe4", "hats", null],
    ["Carhartt Mesh Back Cap", 35, true, "33023660/600/92ae2c0f-c7c5-4940-b28c-986fb7e7eeee", "hats", null],
    ["Richardson Trucker Cap", 22, true, "33315982/600/6fd6da25-6cb1-428b-aac1-911d83490d21", "hats", null],
    ["Port & Co Core Blend Tee", 17, true, "33314334/600/c7da4654-2549-4d1a-84ce-5c1698126bf5", "shirts", null],
    ["Port & Co Long Sleeve Tee", 22, true, "33314342/600/df7d2042-de14-461a-a8c9-8202ea73c3d8", "shirts", null],
    ["Sport-Tek Competitor Tee", 18, true, "33314346/600/7a32a19d-85b5-479f-8c15-57a5000860a7", "shirts", null],
    ["Sport-Tek Long Sleeve Competitor Tee", 20, true, "33314352/600/40b92809-2d5e-41b1-b9e7-f4a9199c2787", "shirts", null],
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
