document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram?.WebApp;

  const loginScreen = document.getElementById("tgLoginScreen");
  const app = document.getElementById("app");

  if (!tg || !tg.initData) {
    // НЕ Telegram WebApp
    loginScreen.style.display = "flex";
    app.style.display = "none";
    return;
  }

  // Telegram OK
  tg.ready();
  tg.expand();

  loginScreen.style.display = "none";
  app.style.display = "block";

  // user
  const user = tg.initDataUnsafe?.user;
  if (!user) {
    alert("Telegram не передал данные пользователя");
    return;
  }

  window.AUTH_USER = user;

  // профиль
  const profile = document.getElementById("tgProfile");
  if (profile) {
    profile.innerHTML = `
      <div class="tg-profile">
        <div>
          <b>${user.first_name}</b><br>
          <span>@${user.username || ""}</span>
        </div>
      </div>
    `;
  }

// ===== PROFILE =====
const avatar = user.photo_url
  ? `<img src="${user.photo_url}" class="tg-avatar">`
  : `<div class="tg-avatar-placeholder">${user.first_name[0]}</div>`;

document.getElementById("tgProfile").innerHTML = `
  ${avatar}
  <div>
    <b>${user.first_name}</b><br>
    <span>@${user.username || ""}</span>
  </div>
`;

// ===== REFERRAL =====
const refBlock = document.getElementById("refBlock");
if (refBlock) {
  const refLink = `https://t.me/YOUR_BOT_USERNAME?start=${user.id}`;
  refBlock.innerHTML = `
    <input value="${refLink}" readonly>
    <button onclick="navigator.clipboard.writeText('${refLink}')">
      Скопировать
    </button>
  `;
}
  

  // старт приложения
  initNavigation();
  loadProducts();
});
