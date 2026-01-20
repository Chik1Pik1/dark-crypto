/* ================== TELEGRAM AUTH ================== */

const tg = window.Telegram?.WebApp;

if (!tg || !tg.initData) {
  // НЕ Telegram → стоп
  document.body.innerHTML = `
    <div style="color:white;text-align:center;margin-top:40vh">
      ❌ Откройте магазин через Telegram бота
    </div>
  `;
  throw new Error("Not Telegram WebApp");
}

tg.ready();
tg.expand();

/* ================== USER ================== */

const tgUser = tg.initDataUnsafe?.user;

if (!tgUser || !tgUser.id) {
  document.body.innerHTML = `
    <div style="color:white;text-align:center;margin-top:40vh">
      ❌ Не удалось получить данные Telegram пользователя
    </div>
  `;
  throw new Error("Telegram user not found");
}

window.AUTH_USER = {
  id: tgUser.id,
  username: tgUser.username || null,
  first_name: tgUser.first_name || "",
  last_name: tgUser.last_name || ""
};

console.log("AUTH USER:", window.AUTH_USER);

/* ================== START APP ================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadProducts();
});
