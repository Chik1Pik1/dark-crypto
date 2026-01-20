function loadFavorites() {
  App.favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(App.favorites));
}

function isFavorite(id) {
  return App.favorites.includes(id);
}

function toggleFavorite(id) {
  if (isFavorite(id)) {
    App.favorites = App.favorites.filter(f => f !== id);
  } else {
    App.favorites.push(id);
  }

  saveFavorites();
  renderProducts();
}
