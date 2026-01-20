async function buyProduct(productId) {
  const product = App.products.find(p => p.id === productId);
  if (!product) {
    alert("Товар не найден");
    return;
  }

  const order = {
    product_id: product.id,
    amount: product.price,
    sender: App.user?.id?.toString() || "guest",
    receiver: "shop",
    status: "new"
  };

  const { error } = await supabase
    .from("orders")
    .insert(order);

  if (error) {
    console.error(error);
    alert("Ошибка покупки");
    return;
  }

  alert("Покупка оформлена");
}
