(() => {
  const THEME_KEY = "pokedraft:theme";
  const root = document.documentElement;
  let bound = false;

  function readTheme() {
    const fromDom = root.getAttribute("data-theme");
    if (fromDom === "light" || fromDom === "dark") return fromDom;
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {}
    return "dark";
  }

  function setTheme(theme, persist = true) {
    const nextTheme = theme === "light" ? "light" : "dark";
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
    if (event) event.preventDefault();
    const current = readTheme();
    setTheme(current === "light" ? "dark" : "light", true);
  }

  window.__pokedraftToggleTheme = toggleTheme;
  setTheme(readTheme(), false);

  function bind() {
    if (bound) return;
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    bound = true;
    button.addEventListener("click", toggleTheme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
