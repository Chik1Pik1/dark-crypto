let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function initFavorites() {
  document.querySelectorAll(".fav-btn").forEach(btn => {
    const id = btn.dataset.id;
    if (favorites.includes(id)) btn.textContent = "💖";

    btn.onclick = () => {
      if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        btn.textContent = "❤️";
      } else {
        favorites.push(id);
        btn.textContent = "💖";
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    };
  });
}

window.initFavorites = initFavorites;
