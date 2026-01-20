document.addEventListener("click", e => {
  if (e.target.classList.contains("card")) {
    e.target.style.transform = "scale(0.97)";
    setTimeout(() => e.target.style.transform = "", 150);
  }
});

function shareReferral() {
  if (!App.tg || !App.user) return;

  const link = `https://t.me/YOUR_BOT?start=ref_${App.user.id}`;
  App.tg.openTelegramLink(
    `https://t.me/share/url?url=${encodeURIComponent(link)}`
  );
}
