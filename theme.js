(() => {
  const root = document.documentElement;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const storageKey = "bryan-busby-theme";

  const readSavedTheme = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved === "light" || saved === "dark" ? saved : null;
    } catch (_) {
      return null;
    }
  };

  const systemTheme = () => systemPreference.matches ? "dark" : "light";
  const applyTheme = theme => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  };

  applyTheme(readSavedTheme() || systemTheme());

  const icons = {
    light: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path></svg>`,
    dark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 15.2A8.5 8.5 0 0 1 8.8 3.9 8.5 8.5 0 1 0 20.1 15.2Z"></path></svg>`
  };

  const updateButton = button => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    button.innerHTML = icons[nextTheme];
    button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    button.title = `Switch to ${nextTheme} mode`;
  };

  const installToggle = () => {
    const style = document.createElement("style");
    style.textContent = `
      .theme-toggle {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 100;
        display: grid;
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        place-items: center;
        color: var(--text, #111111);
        background: var(--bg, #ffffff);
        border: 1px solid var(--line, currentColor);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: none;
      }
      .theme-toggle:hover { border-color: currentColor; }
      .theme-toggle:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 3px;
      }
      .theme-toggle svg {
        width: 1.15rem;
        height: 1.15rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      @media (max-width: 640px) {
        .theme-toggle { top: .7rem; right: .7rem; }
      }
    `;
    document.head.appendChild(style);

    const button = document.querySelector(".theme-toggle") || document.createElement("button");
    button.className = "theme-toggle";
    button.type = "button";
    updateButton(button);
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (_) {
        // The selected theme still applies for the current page.
      }
      updateButton(button);
    });
    if (!button.isConnected) document.body.appendChild(button);
  };

  systemPreference.addEventListener("change", () => {
    if (!readSavedTheme()) applyTheme(systemTheme());
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installToggle, { once: true });
  } else {
    installToggle();
  }
})();
