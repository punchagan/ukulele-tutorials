export const isFavorite = (videoId) => {
  if (!process.browser) {
    return;
  }
  const favorites = JSON.parse(localStorage.getItem("favorites", []) || "{}");
  return Boolean(favorites[videoId]);
};

export const toggleFavorite = (videoId, isFavorite) => {
  if (!window) {
    return;
  }
  const favorites = JSON.parse(localStorage.getItem("favorites", []) || "{}");

  if (isFavorite) {
    favorites[videoId] = true;
  } else {
    delete favorites[videoId];
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
};
