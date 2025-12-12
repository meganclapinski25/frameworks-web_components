// toggle.js

class AthleteToggle extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      this._checked = this.hasAttribute("checked");
      this._onClick = this._onClick.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
  
      const template = document.createElement("template");
      template.innerHTML = `
        <style>
          @import url("./acsd.css");
  
          :host {
            display: inline-flex;
            align-items: center;
            gap: var(--space-sm);
            cursor: pointer;
            user-select: none;
          }
  
          .toggle {
            display: inline-flex;
            align-items: center;
            gap: var(--space-sm);
            border-radius: var(--radius-pill);
            padding: var(--space-xs) var(--space-sm);
          }
  
          .toggle:focus-visible {
            outline: 2px solid var(--color-focus-ring);
            outline-offset: 3px;
          }
  
          .label {
            font-size: var(--font-size-sm);
            color: var(--color-fg);
          }
  
          .track {
            width: 44px;
            height: 24px;
            background: var(--color-border);
            border-radius: var(--radius-pill);
            position: relative;
            transition: background var(--transition-fast);
            border: var(--border-width) solid color-mix(in srgb, var(--color-border) 70%, transparent);
          }
  
          .thumb {
            width: 20px;
            height: 20px;
            background: var(--color-surface);
            border-radius: 50%;
            position: absolute;
            top: 1px;
            left: 1px;
            box-shadow: var(--shadow-sm);
            transition: transform var(--transition-fast);
          }
  
          .track.on {
            background: var(--color-primary);
            border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
          }
  
          .track.on .thumb {
            transform: translateX(20px);
          }
  
          /* Nice disabled state if you add disabled later */
          :host([disabled]) {
            opacity: 0.6;
            cursor: not-allowed;
          }
        </style>
  
        <div class="toggle" role="switch" tabindex="0" aria-checked="false">
          <div class="track">
            <div class="thumb"></div>
          </div>
          <span class="label"></span>
        </div>
      `;
  
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  
    static get observedAttributes() {
      // ✅ added "mode" so this component can optionally control theme:
      // <ath-toggle mode="theme" storage-key="theme"></ath-toggle>
      return ["label", "checked", "disabled", "mode", "storage-key"];
    }
  
    attributeChangedCallback(name) {
      if (name === "label") this._updateLabel();
  
      if (name === "checked") {
        this._checked = this.hasAttribute("checked");
        this._render();
        // ✅ if this is a theme toggle, apply theme whenever checked changes
        this._applyThemeIfNeeded();
      }
  
      if (name === "disabled") {
        const root = this.shadowRoot.querySelector(".toggle");
        if (root) root.tabIndex = this.hasAttribute("disabled") ? -1 : 0;
      }
    }
  
    connectedCallback() {
      this._updateLabel();
  
      // ✅ If this toggle is being used for dark mode, initialize from saved preference
      this._initThemeIfNeeded();
  
      this._render();
  
      const root = this.shadowRoot.querySelector(".toggle");
      root.addEventListener("click", this._onClick);
      root.addEventListener("keydown", this._onKeyDown);
    }
  
    disconnectedCallback() {
      const root = this.shadowRoot.querySelector(".toggle");
      if (!root) return;
      root.removeEventListener("click", this._onClick);
      root.removeEventListener("keydown", this._onKeyDown);
    }
  
    _updateLabel() {
      const labelText = this.getAttribute("label") || "Toggle";
      const labelEl = this.shadowRoot.querySelector(".label");
      if (labelEl) labelEl.textContent = labelText;
    }
  
    _onClick() {
      if (this.hasAttribute("disabled")) return;
      this.toggle();
    }
  
    _onKeyDown(event) {
      if (this.hasAttribute("disabled")) return;
  
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        this.toggle();
      }
    }
  
    // ============================
    // Theme-toggle functionality
    // ============================
  
    _isThemeMode() {
      return (this.getAttribute("mode") || "").toLowerCase() === "theme";
    }
  
    _storageKey() {
      return this.getAttribute("storage-key") || "theme";
    }
  
    _setTheme(isDark) {
      // Put the class on <html> so all CSS variables update
      document.documentElement.classList.toggle("theme-dark", isDark);
  
      // Save preference
      try {
        localStorage.setItem(this._storageKey(), isDark ? "dark" : "light");
      } catch {
        // ignore if blocked
      }
    }
  
    _initThemeIfNeeded() {
      if (!this._isThemeMode()) return;
  
      // Pull saved preference
      let saved = null;
      try {
        saved = localStorage.getItem(this._storageKey());
      } catch {
        saved = null;
      }
  
      const startDark = saved === "dark";
  
      // Sync component state to saved preference (and apply theme)
      if (startDark) this.setAttribute("checked", "");
      else this.removeAttribute("checked");
  
      this._checked = startDark;
      this._setTheme(startDark);
    }
  
    _applyThemeIfNeeded() {
      if (!this._isThemeMode()) return;
      this._setTheme(this._checked);
    }
  
    // ============================
    // Normal toggle behavior
    // ============================
  
    toggle() {
      this._checked = !this._checked;
  
      if (this._checked) this.setAttribute("checked", "");
      else this.removeAttribute("checked");
  
      this._render();
  
      // ✅ if theme mode, apply theme + persist
      this._applyThemeIfNeeded();
  
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { checked: this._checked },
          bubbles: true,
          composed: true,
        })
      );
    }
  
    _render() {
      const track = this.shadowRoot.querySelector(".track");
      const root = this.shadowRoot.querySelector(".toggle");
      if (!track || !root) return;
  
      track.classList.toggle("on", this._checked);
      root.setAttribute("aria-checked", String(this._checked));
    }
  
    get checked() {
      return this._checked;
    }
  
    set checked(value) {
      const bool = Boolean(value);
      if (bool) this.setAttribute("checked", "");
      else this.removeAttribute("checked");
    }
  }
  
  customElements.define("ath-toggle", AthleteToggle);
  