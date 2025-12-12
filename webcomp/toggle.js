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
          @import url("./styles.css");
  
          :host {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
          }
  
          .label {
            font-size: var(--font-size-sm, 0.9rem);
            color: var(--color-fg, #111827);
          }
  
          .track {
            width: 40px;
            height: 20px;
            background: var(--color-border, #d1d5db);
            border-radius: 999px;
            position: relative;
            transition: background var(--transition-fast, 150ms ease-out);
          }
  
          .thumb {
            width: 18px;
            height: 18px;
            background: var(--color-surface, #ffffff);
            border-radius: 50%;
            position: absolute;
            top: 1px;
            left: 1px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            transition: transform var(--transition-fast, 150ms ease-out);
          }
  
          .track.on {
            background: var(--color-accent, #2563eb);
          }
  
          .track.on .thumb {
            transform: translateX(20px);
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
      return ["label", "checked"];
    }
  
    attributeChangedCallback(name, _old, _value) {
      if (name === "label") {
        this._updateLabel();
      }
      if (name === "checked") {
        this._checked = this.hasAttribute("checked");
        this._render();
      }
    }
  
    connectedCallback() {
      this._updateLabel();
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
      this.toggle();
    }
  
    _onKeyDown(event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        this.toggle();
      }
    }
  
    toggle() {
      this._checked = !this._checked;
      if (this._checked) {
        this.setAttribute("checked", "");
      } else {
        this.removeAttribute("checked");
      }
      this._render();
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
      if (bool) {
        this.setAttribute("checked", "");
      } else {
        this.removeAttribute("checked");
      }
    }
  }
  
  customElements.define("ath-toggle", AthleteToggle);
  