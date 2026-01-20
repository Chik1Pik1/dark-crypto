/* ================== NOTIFICATIONS ================== */

window.showNotification = function (text) {
  let notification = document.getElementById("notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    document.body.appendChild(notification);
  }

  notification.innerText = text;
  notification.style.display = "block";
  notification.style.zIndex = "9999";

  clearTimeout(notification._timer);
  notification._timer = setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
};

/* ================== HELPERS ================== */

window.shortAddress = function (addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
};