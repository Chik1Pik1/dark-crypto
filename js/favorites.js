/* ================== FAVORITES STATE ================== */

const FAVORITES_KEY = "favorite_products";

window.favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

/* ================== HELPERS ================== */

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(window.favorites));
}

function isFavorite(productId) {
  return window.favorites.includes(productId);
}

/* ================== TOGGLE ================== */

window.toggleFavorite = function (productId) {
  if (isFavorite(productId)) {
    window.favorites = window.favorites.filter(id => id !== productId);
  } else {
    window.favorites.push(productId);
  }

  saveFavorites();

  if (typeof window.renderProducts === "function") {
    window.renderProducts();
  }

  renderFavorites();
};

/* ================== RENDER FAVORITES ================== */

function renderFavorites() {
  const container = document.getElementById("favorites");
  if (!container) return;

  container.innerHTML = "";

  const favProducts = window.productsCache.filter(p =>
    window.favorites.includes(p.id)
  );

  if (!favProducts.length) {
    container.innerHTML = "<p>Избранное пусто</p>";
    return;
  }

  favProducts.forEach(p => {
    const item = document.createElement("div");
    item.className = "card";

    item.innerHTML = `
      <img src="${p.image}">
      <h3>${p.title}</h3>
      <div class="price">${p.price} TON</div>
      <button class="remove-fav">❌ Убрать</button>
    `;

    item.querySelector(".remove-fav").onclick = () =>
      window.toggleFavorite(p.id);

    container.appendChild(item);
  });
}