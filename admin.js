const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const discountInput = document.getElementById("discount");
const ratingInput = document.getElementById("rating");
const stockInput = document.getElementById("stock");
const imageFileInput = document.getElementById("imageFile");
const descriptionInput = document.getElementById("description");
const addBtn = document.getElementById("addProduct");
const productList = document.getElementById("productList");
const preview = document.getElementById("preview");

let selectedImage = null;

/* ---------- PREVIEW ---------- */

imageFileInput.onchange = () => {
  selectedImage = imageFileInput.files[0];
  if (!selectedImage) return;

  preview.src = URL.createObjectURL(selectedImage);
  preview.style.display = "block";
};

/* ---------- IMAGE UPLOAD ---------- */

async function uploadImage(file) {
  const fileName = Date.now() + "_" + file.name.replace(/\s+/g, "_");
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/product-images/${fileName}`;

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "apikey": SUPABASE_KEY,
      "Content-Type": file.type,
      "x-upsert": "true"
    },
    body: file
  });

  if (!res.ok) {
    alert("Ошибка загрузки картинки");
    return null;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
}

/* ---------- ADD PRODUCT ---------- */

async function addProduct() {
  if (!titleInput.value || !priceInput.value) {
    alert("Заполни название и цену");
    return;
  }

  if (!selectedImage) {
    alert("Выбери картинку");
    return;
  }

  const imageUrl = await uploadImage(selectedImage);
  if (!imageUrl) return;

  const product = {
    title: titleInput.value.trim(),
    price: Number(priceInput.value),
    discount: Number(discountInput.value) || 0,
    rating: Number(ratingInput.value) || 5,
    stock: Number(stockInput.value) || 0,
    image: imageUrl,
    description: descriptionInput.value.trim()
  };

  const { error } = await supabase
    .from("products")
    .insert([product]);

  if (error) {
  alert(
    "Ошибка добавления товара:\n\n" +
    (error.message || JSON.stringify(error))
  );
  return;
  }

  alert("Товар добавлен");

  titleInput.value = "";
  priceInput.value = "";
  discountInput.value = "";
  ratingInput.value = "";
  stockInput.value = "";
  descriptionInput.value = "";
  imageFileInput.value = "";
  preview.style.display = "none";
  selectedImage = null;

  loadProductsAdmin();
}

/* ---------- LOAD PRODUCTS ---------- */

async function loadProductsAdmin() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    productList.innerText = "Ошибка загрузки";
    return;
  }

  if (!data || !data.length) {
    productList.innerText = "Товаров нет";
    return;
  }

  productList.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-item";

    div.innerHTML = `
      <img src="${p.image}" style="width:100%;border-radius:12px;margin-bottom:8px;">
      <b>${p.title}</b><br>
      Цена: ${p.price} TON<br>
      Скидка: ${p.discount}%<br>
      Рейтинг: ${p.rating}<br>
      Остаток: ${p.stock}<br>
      <button class="delete-btn">Удалить</button>
      <hr>
    `;

    div.querySelector(".delete-btn").onclick = () => deleteProduct(p.id);
    productList.appendChild(div);
  });
}

/* ---------- DELETE ---------- */

async function deleteProduct(id) {
  if (!confirm("Удалить товар?")) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Ошибка удаления");
  } else {
    loadProductsAdmin();
  }
}

/* ---------- EVENTS ---------- */

addBtn.onclick = addProduct;
loadProductsAdmin();