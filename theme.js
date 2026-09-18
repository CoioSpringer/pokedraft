(() => {
  const THEME_KEY = "pokedraft:theme";
  const root = document.documentElement;

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
    root.setAttribute("data-theme", nextTheme);
    if (persist) {
      try { localStorage.setItem(THEME_KEY, nextTheme); } catch (_) {}
    }
    const light = nextTheme === "light";
    const label = light ? "Ativar tema escuro" : "Ativar tema claro";
    document.querySelectorAll("#theme-toggle").forEach((button) => {
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(light));
      const text = button.querySelector(".sr-only");
      if (text) text.textContent = label;
    });
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", light ? "#f7f2f0" : "#080808");
  }

  function toggleTheme(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const current = root.dataset.theme === "light" ? "light" : "dark";
    setTheme(current === "light" ? "dark" : "light");
  }

  window.__pokedraftToggleTheme = toggleTheme;
  setTheme(savedTheme(), false);

  function bind() {
    document.querySelectorAll("#theme-toggle").forEach((button) => {
      button.addEventListener("click", toggleTheme);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
