(() => {
  const THEME_KEY = "pokedraft:theme";
  const root = document.documentElement;
  const button = document.querySelector("#theme-toggle");

  function savedTheme() {
    try {
      const theme = localStorage.getItem(THEME_KEY);
      return theme === "light" || theme === "dark" ? theme : "dark";
    } catch (_) {
      return "dark";
    }
  }

  function setTheme(theme, persist = true) {
    const nextTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    if (persist) {
      try { localStorage.setItem(THEME_KEY, nextTheme); } catch (_) {}
    }
    const light = nextTheme === "light";
    if (button) {
      const label = light ? "Ativar tema escuro" : "Ativar tema claro";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(light));
      const text = button.querySelector(".sr-only");
      if (text) text.textContent = label;
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", light ? "#f7f2f0" : "#080808");
  }

  setTheme(savedTheme(), false);
  button?.addEventListener("click", () => setTheme(root.dataset.theme === "light" ? "dark" : "light"));
})();
