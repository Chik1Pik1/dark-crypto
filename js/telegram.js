// js/telegram.js

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const tgUser = tg.initDataUnsafe?.user;

let currentUser = null;

if (tgUser) {
  currentUser = {
    telegram_id: tgUser.id,
    username: tgUser.username || "",
    first_name: tgUser.first_name || ""
  };

  saveUser();
}

/* =========================
   SAVE USER TO SUPABASE
========================= */
async function saveUser() {
  await supabase
    .from("users")
    .upsert({
      id: currentUser.telegram_id,
      username: currentUser.username,
      first_name: currentUser.first_name
    });
}