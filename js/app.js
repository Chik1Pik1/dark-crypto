window.App = {
  tg: null,
  user: null,
  favorites: [],
  products: []
};

document.addEventListener("DOMContentLoaded", () => {
  initTelegram();
  loadFavorites();
});
  
function initTelegram() {
  if (!window.Telegram || !Telegram.WebApp) return;

  App.tg = Telegram.WebApp;
  App.tg.expand();

  const user = App.tg.initDataUnsafe?.user;
  if (!user) return;

  App.user = user;

  const avatar = document.getElementById("user-avatar");
  const name = document.getElementById("user-name");

  avatar.src = user.photo_url || "assets/images/avatar-placeholder.png";
  name.textContent = user.first_name;
}
