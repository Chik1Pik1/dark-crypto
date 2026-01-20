alert("app.js загружен");

async function loadProducts() {
  alert("loadProducts вызван");

  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    alert("SUPABASE ERROR: " + error.message);
    return;
  }

  alert("Товаров: " + data.length);

  const grid = document.getElementById("products-grid");
  if (!grid) {
    alert("products-grid НЕ НАЙДЕН");
    return;
  }

  data.forEach(p => {
    const d = document.createElement("div");
    d.style.color = "white";
    d.innerText = p.title;
    grid.appendChild(d);
  });
}

loadProducts();
