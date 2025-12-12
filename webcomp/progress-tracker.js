class AthleteProgressTracker extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      const template = document.createElement("template");
      template.innerHTML = `
        <style>
          @import url("./styles.css");
  
          :host {
            display: block;
            margin-top: var(--space-md, 1rem);
          }
  
          .tracker {
            display: flex;
            flex-direction: column;
            gap: var(--space-md, 1rem);
          }
  
          .title {
            font-weight: 600;
            font-size: var(--font-size-h3, 1.25rem);
            text-align: left;
            margin-bottom: var(--space-xs, 0.25rem);
          }
  
          .category {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs, 0.25rem);
          }
  
          .category-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-size: var(--font-size-sm, 0.9rem);
          }
  
          .category-name {
            font-weight: 600;
          }
  
          .category-summary {
            color: var(--color-fg-muted, #6b7280);
          }
  
          .bar {
            height: 12px;
            background: var(--color-surface-muted, #e5e7eb);
            border-radius: 999px;
            overflow: hidden;
          }
  
          .fill {
            height: 100%;
            width: 0%;
            background: var(--color-accent, #16a34a);
            border-radius: inherit;
            transition: width 0.15s linear;
          }
  
          .controls {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
            margin-top: var(--space-xs, 0.25rem);
          }
  
          .controls button {
            font: inherit;
            font-size: var(--font-size-sm, 0.8rem);
            padding: 0.15rem 0.6rem;
            border-radius: var(--radius-sm, 0.25rem);
            border: 1px solid var(--color-border, #d1d5db);
            background: var(--color-surface, #ffffff);
            cursor: pointer;
            transition:
              background-color var(--transition-fast, 150ms ease-out),
              transform var(--transition-fast, 150ms ease-out);
          }
  
          .controls button:hover {
            background-color: var(--color-surface-muted, #e5e7eb);
          }
  
          .controls button:active {
            transform: translateY(1px);
          }
  
          .controls button:focus-visible {
            outline: 2px solid var(--color-focus-ring, #2563eb);
            outline-offset: 2px;
          }
        </style>
  
        <section class="tracker" aria-label="Student athlete weekly progress">
          <h3 class="title">Weekly Progress</h3>
  
          <div class="category" data-key="homework">
            <div class="category-header">
              <span class="category-name">Homework</span>
              <span class="category-summary"></span>
            </div>
            <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="fill"></div>
            </div>
            <div class="controls">
              <button type="button" data-action="add-completed">+1 Done</button>
              <button type="button" data-action="add-total">+1 Assigned</button>
            </div>
          </div>
  
          <div class="category" data-key="practices">
            <div class="category-header">
              <span class="category-name">Practices</span>
              <span class="category-summary"></span>
            </div>
            <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="fill"></div>
            </div>
            <div class="controls">
              <button type="button" data-action="add-completed">+1 Attended</button>
              <button type="button" data-action="add-total">+1 Planned</button>
            </div>
          </div>
  
          <div class="category" data-key="games">
            <div class="category-header">
              <span class="category-name">Games</span>
              <span class="category-summary"></span>
            </div>
            <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="fill"></div>
            </div>
            <div class="controls">
              <button type="button" data-action="add-completed">+1 Played</button>
              <button type="button" data-action="add-total">+1 Scheduled</button>
            </div>
          </div>
  
          <div class="category" data-key="lifts">
            <div class="category-header">
              <span class="category-name">Lifts</span>
              <span class="category-summary"></span>
            </div>
            <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="fill"></div>
            </div>
            <div class="controls">
              <button type="button" data-action="add-completed">+1 Completed</button>
              <button type="button" data-action="add-total">+1 Goal</button>
            </div>
          </div>
        </section>
      `;
  
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  
      // default internal state
      this._stats = {
        homework:   { completed: 0, total: 0 },
        practices:  { completed: 0, total: 0 },
        games:      { completed: 0, total: 0 },
        lifts:      { completed: 0, total: 0 },
      };
  
      this._onClick = this._onClick.bind(this);
    }
  
    static get observedAttributes() {
      // Optional: allow starting values via attributes like:
      // homework-completed="3" homework-total="4"
      return [
        "homework-completed",
        "homework-total",
        "practices-completed",
        "practices-total",
        "games-completed",
        "games-total",
        "lifts-completed",
        "lifts-total",
      ];
    }
  
    connectedCallback() {
      this._readInitialAttributes();
      this._renderAll();
  
      this.shadowRoot.addEventListener("click", this._onClick);
    }
  
    disconnectedCallback() {
      this.shadowRoot.removeEventListener("click", this._onClick);
    }
  
    attributeChangedCallback() {
      // Whenever an attribute changes, just reread and rerender
      if (this.isConnected) {
        this._readInitialAttributes();
        this._renderAll();
      }
    }
  
    _readInitialAttributes() {
      const map = this._stats;
  
      const read = (key, type) => {
        const attr = this.getAttribute(`${key}-${type}`);
        if (attr !== null && !Number.isNaN(Number(attr))) {
          map[key][type] = Number(attr);
        }
      };
  
      read("homework", "completed");
      read("homework", "total");
      read("practices", "completed");
      read("practices", "total");
      read("games", "completed");
      read("games", "total");
      read("lifts", "completed");
      read("lifts", "total");
    }
  
    _onClick(event) {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
  
      const categoryEl = button.closest(".category");
      if (!categoryEl) return;
  
      const key = categoryEl.getAttribute("data-key");
      const action = button.getAttribute("data-action");
  
      if (!this._stats[key]) return;
  
      if (action === "add-completed") {
        this._stats[key].completed += 1;
        if (this._stats[key].total < this._stats[key].completed) {
          this._stats[key].total = this._stats[key].completed;
        }
      } else if (action === "add-total") {
        this._stats[key].total += 1;
      }
  
      this._renderCategory(key);
  
      // Fire a CustomEvent so outside code could listen
      this.dispatchEvent(
        new CustomEvent("progress-changed", {
          detail: {
            category: key,
            completed: this._stats[key].completed,
            total: this._stats[key].total,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  
    _renderAll() {
      ["homework", "practices", "games", "lifts"].forEach((key) =>
        this._renderCategory(key)
      );
    }
  
    _renderCategory(key) {
      const { completed, total } = this._stats[key];
      const categoryEl = this.shadowRoot.querySelector(`.category[data-key="${key}"]`);
      if (!categoryEl) return;
  
      const summaryEl = categoryEl.querySelector(".category-summary");
      const barEl = categoryEl.querySelector(".bar");
      const fillEl = categoryEl.querySelector(".fill");
  
      const percent = total > 0 ? Math.max(0, Math.min(100, (completed / total) * 100)) : 0;
  
      if (summaryEl) {
        summaryEl.textContent = `${completed} / ${total} (${Math.round(percent)}%)`;
      }
  
      if (fillEl) {
        fillEl.style.width = `${percent}%`;
      }
  
      if (barEl) {
        barEl.setAttribute("aria-valuenow", String(Math.round(percent)));
      }
    }
  }
  
  customElements.define("ath-progress-tracker", AthleteProgressTracker);
  