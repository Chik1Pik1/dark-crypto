/* ================== APP ENTRY POINT ================== */

// Проверка Supabase
if (!window.supabase) {
  console.error("Supabase не подключён");
}

// Проверка TON Connect
if (!window.tonConnectUI) {
  console.error("TON Connect не инициализирован");
}

// Проверка основных DOM-элементов
document.addEventListener("DOMContentLoaded", () => {
  // Навигация
  if (typeof window.initNavigation === "function") {
    window.initNavigation();
  }

  // Загрузка товаров
  if (typeof window.loadProducts === "function") {
    window.loadProducts();
  } else {
    console.error("loadProducts() не найдена");
  }

  console.log("App initialized successfully");
});