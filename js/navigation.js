/* ================== NAVIGATION ================== */

window.initNavigation = function () {
  const navButtons = document.querySelectorAll("[data-tab]");
  const sections = document.querySelectorAll("[data-section]");

  if (!navButtons.length || !sections.length) {
    console.warn("Navigation: buttons or sections not found");
    return;
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
};

/* ================== SWITCH TAB ================== */

function switchTab(tabName) {
  const navButtons = document.querySelectorAll("[data-tab]");
  const sections = document.querySelectorAll("[data-section]");

  sections.forEach(section => {
    section.style.display =
      section.dataset.section === tabName ? "block" : "none";
  });

  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
}

/* ================== DEFAULT TAB ================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();

  // Открываем маркет по умолчанию
  switchTab("market");
});