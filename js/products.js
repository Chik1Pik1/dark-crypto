async function loadProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "Загрузка...";

  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    container.innerHTML = "Ошибка загрузки товаров";
    return;
  }

  container.innerHTML = "";

  data.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <button class="fav-btn" data-id="${product.id}">❤️</button>

      <img src="${product.image}" alt="">
      <h3>${product.title}</h3>

      <div class="price-box">
        ${product.discount > 0
          ? `<s>${product.price}</s> ${product.price - product.discount}`
          : product.price
        } TON
      </div>

      <div class="rating-box">
        ⭐ ${product.rating} | Осталось: ${product.stock}
      </div>

      <button onclick="buyProduct(${product.id}, ${product.price})">
        Купить
      </button>
    `;

    container.appendChild(card);
  });

  initFavorites();
}

window.loadProducts = loadProducts;
