(() => {
  const root = document.documentElement;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

  const applySystemTheme = () => {
    root.dataset.theme = systemPreference.matches ? "dark" : "light";
  };

  applySystemTheme();
  systemPreference.addEventListener("change", applySystemTheme);
})();
