/* ================== CONFIG ================== */

// Адрес, на который приходят TON
const RECEIVER_ADDRESS = "UQBpzDQz7lc5asBeR0v8donW-BH4ddm0vFxH29piQkei0n00";

/* ================== BUY PRODUCT ================== */

window.buyProduct = async function (productId, price) {
  // Проверка кошелька
  if (!window.walletConnected || !window.walletAddress) {
    if (typeof window.showNotification === "function") {
      window.showNotification("Подключите кошелёк");
    } else {
      alert("Подключите кошелёк");
    }
    return;
  }

  // Проверка баланса
  if (window.walletBalance < price) {
    alert("Недостаточно средств");
    return;
  }

  // Проверка товара
  const product = window.productsCache?.find(p => p.id === productId);
  if (!product) {
    alert("Товар не найден");
    return;
  }

  if (product.stock <= 0) {
    alert("Товар закончился");
    return;
  }

  /* ================== CREATE ORDER ================== */

  const { data: order, error } = await window.supabase
    .from("orders")
    .insert([{
      product_id: productId,
      amount: price,
      receiver: RECEIVER_ADDRESS,
      status: "pending"
    }])
    .select()
    .single();

  if (error || !order) {
    alert("Ошибка создания заказа:\n" + error?.message);
    return;
  }

  /* ================== SEND TRANSACTION ================== */

  try {
    await window.tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [{
        address: RECEIVER_ADDRESS,
        amount: (price * 1e9).toFixed(0),
        payload: btoa(`order:${order.id}`)
      }]
    });

    if (typeof window.showNotification === "function") {
      window.showNotification("Платёж отправлен. Ожидаем подтверждение ⏳");
    } else {
      alert("Платёж отправлен");
    }

  } catch (e) {
    console.error(e);
    alert("Оплата отменена или произошла ошибка");
  }
};