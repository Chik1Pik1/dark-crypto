// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadProducts();
  initSnow();
});

/* =========================
   NAVIGATION
========================= */
function initNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".page");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      pages.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.page).classList.add("active");
    });
  });
}

/* =========================
   LOAD PRODUCTS
========================= */
async function loadProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = "<p>Ошибка загрузки товаров</p>";
    console.error(error);
    return;
  }

  data.forEach(product => {
    grid.appendChild(renderProduct(product));
  });
}

/* =========================
   RENDER PRODUCT CARD
========================= */
function renderProduct(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const finalPrice = product.discount
    ? (product.price - product.price * product.discount / 100).toFixed(2)
    : product.price.toFixed(2);

  card.innerHTML = `
    <div class="favorite-btn" data-id="${product.id}">❤️</div>

    <div class="product-image" style="background-image:url('${product.image}')"></div>

    <div class="product-title">${product.title}</div>
    <div class="product-rating">⭐ ${product.rating || "0.0"}</div>
    <div class="product-stock">Осталось: ${product.stock}</div>

    <div class="price-box">
      <div class="price">${finalPrice} TON</div>
      ${product.discount ? `<div class="old-price">${product.price} TON</div>` : ""}
      ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ""}
    </div>

    <button class="buy-btn" data-id="${product.id}">
      Купить
    </button>
  `;

  // click animation
  card.addEventListener("click", e => {
    if (!e.target.classList.contains("buy-btn")) {
      card.style.transform = "scale(0.98)";
      setTimeout(() => card.style.transform = "", 120);
    }
  });

  return card;
  
}
/* =========================
   SNOW EFFECT
========================= */
function initSnow() {
  const canvas = document.getElementById("snow");
  const ctx = canvas.getContext("2d");

  let w, h;
  const flakes = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  for (let i = 0; i < 80; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      d: Math.random() + 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();

    flakes.forEach(f => {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    });

    ctx.fill();
    update();
  }

  function update() {
    flakes.forEach(f => {
      f.y += f.d;
      if (f.y > h) {
        f.y = -5;
        f.x = Math.random() * w;
      }
    });
  }

  (function animate() {
    draw();
    requestAnimationFrame(animate);
  })();
}