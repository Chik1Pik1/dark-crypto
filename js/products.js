/* ================== PRODUCTS STATE ================== */

window.productsCache = [];

/* ================== LOAD PRODUCTS ================== */

window.loadProducts = async function () {
  const { data, error } = await window.supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    alert("Ошибка загрузки товаров:\n" + error.message);
    return;
  }

  window.productsCache = data || [];
  renderProducts();
};

/* ================== HELPERS ================== */

function getStockClass(stock) {
  if (stock >= 10) return "stock-high";
  if (stock >= 5) return "stock-mid";
  return "stock-low";
}

/* ================== RENDER ================== */

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  window.productsCache.forEach(p => {
    const finalPrice = p.discount
      ? p.price - (p.price * p.discount) / 100
      : p.price;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>

      <p class="description">${p.description || ""}</p>

      <div class="info-badge ${getStockClass(p.stock)}">
        <div>⭐ ${p.rating}</div>
        <div>📦 ${p.stock}</div>
        ${p.discount ? `<div class="discount">-${p.discount}%</div>` : ""}
      </div>

      <div class="price">${finalPrice} TON</div>

      <button class="buy" ${p.stock <= 0 ? "disabled" : ""}>
        Купить
      </button>
    `;

    const buyBtn = card.querySelector(".buy");
    buyBtn.onclick = () => {
      if (typeof window.buyProduct === "function") {
        window.buyProduct(p.id, finalPrice);
      } else {
        alert("Функция покупки недоступна");
      }
    };

    container.appendChild(card);
  });
}
