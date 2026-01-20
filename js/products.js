
document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  App.products = data;
  renderProducts();
}

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  App.products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="favorite ${isFavorite(p.id) ? "active" : ""}" 
           onclick="toggleFavorite(${p.id})">❤</div>

      <img src="${p.image}" />
      <h3>${p.title}</h3>
      <p>${p.description || "Без описания"}</p>

      <div class="price">${p.price} USDT</div>

      <button class="button" onclick="buyProduct(${p.id})">
        Купить
      </button>
    `;

    container.appendChild(card);
  });
}
