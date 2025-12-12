class AthleteProgressTracker extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      const template = document.createElement("template");
      template.innerHTML = `
        <style>
          @import url("./acsd.css");
  
          :host {
            display: block;
          }
  
          .tracker {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
          }
  
          .category {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
            padding: var(--space-sm);
            border: var(--border-width) solid var(--color-border);
            border-radius: var(--radius-md);
            background: var(--color-surface);
          }
  
          .category-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: var(--space-sm);
            font-size: var(--font-size-sm);
          }
  
          .category-name {
            font-weight: var(--font-weight-strong);
          }
  
          .category-summary {
            color: var(--color-fg-muted);
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }
  
          .bar {
            height: 12px;
            background: var(--color-surface-muted);
            border-radius: var(--radius-pill);
            overflow: hidden;
          }
  
          .fill {
            height: 100%;
            width: 0%;
            background: var(--color-primary);
            border-radius: inherit;
            transition: width 150ms ease-out;
          }
  
          .controls {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            gap: var(--space-xs);
            margin-top: var(--space-xs);
          }
  
          .footer-row {
            display: flex;
            justify-content: flex-end;
            margin-top: var(--space-sm);
          }
        </style>
  
        <div class="tracker" aria-label="Student athlete weekly progress">
              <div class="category" data-key="homework">
                <div class="category-header">
                  <span class="category-name">Homework</span>
                  <span class="category-summary"></span>
                </div>
  
                <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                  <div class="fill"></div>
                </div>
  
                <div class="controls">
                  <button class="btn btn--sm btn--primary" type="button" data-action="add-completed">+ Done</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="add-total">+ Assigned</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-completed">- Done</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-total">- Assigned</button>
                  <button class="btn btn--sm btn--danger" type="button" data-action="reset-category">Finish</button>
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
                  <button class="btn btn--sm btn--primary" type="button" data-action="add-completed">+ Attended</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="add-total">+ Planned</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-completed">- Attended</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-total">- Planned</button>
                  <button class="btn btn--sm btn--danger" type="button" data-action="reset-category">Finish</button>
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
                  <button class="btn btn--sm btn--primary" type="button" data-action="add-completed">+ Played</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="add-total">+ Scheduled</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-completed">- Played</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-total">- Scheduled</button>
                  <button class="btn btn--sm btn--danger" type="button" data-action="reset-category">Finish</button>
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
                  <button class="btn btn--sm btn--primary" type="button" data-action="add-completed">+ Completed</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="add-total">+ Goal</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-completed">- Completed</button>
                  <button class="btn btn--sm btn--secondary" type="button" data-action="remove-total">- Goal</button>
                  <button class="btn btn--sm btn--danger" type="button" data-action="reset-category">Finish</button>
                </div>
              </div>
  
              <div class="footer-row">
                <button class="btn btn--danger" type="button" data-action="reset-all">Finish Week (Reset All)</button>
              </div>
        </div>
      `;
  
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  
      this._stats = {
        homework: { completed: 0, total: 0 },
        practices: { completed: 0, total: 0 },
        games: { completed: 0, total: 0 },
        lifts: { completed: 0, total: 0 },
      };
  
      this._currentPercent = { homework: 0, practices: 0, games: 0, lifts: 0 };
      this._rafIds = { homework: 0, practices: 0, games: 0, lifts: 0 };
  
      this._onClick = this._onClick.bind(this);
    }
  
    static get observedAttributes() {
      return [
        "homework-completed", "homework-total",
        "practices-completed", "practices-total",
        "games-completed", "games-total",
        "lifts-completed", "lifts-total",
      ];
    }
  
    connectedCallback() {
      this._readInitialAttributes();
      this._renderAll();
      this.shadowRoot.addEventListener("click", this._onClick);
    }
  
    disconnectedCallback() {
      this.shadowRoot.removeEventListener("click", this._onClick);
  
      ["homework", "practices", "games", "lifts"].forEach((k) => {
        if (this._rafIds?.[k]) cancelAnimationFrame(this._rafIds[k]);
      });
    }
  
    attributeChangedCallback() {
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
  
      ["homework", "practices", "games", "lifts"].forEach((k) => {
        read(k, "completed");
        read(k, "total");
        this._clamp(k);
      });
    }
  
    _clamp(key) {
      const s = this._stats[key];
      s.completed = Math.max(0, s.completed);
      s.total = Math.max(0, s.total);
      if (s.total < s.completed) s.total = s.completed;
    }
  
    _syncAttributes(key) {
      const { completed, total } = this._stats[key];
      this.setAttribute(`${key}-completed`, String(completed));
      this.setAttribute(`${key}-total`, String(total));
    }
  
    _prefersReducedMotion() {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }
  
    _updateSummaryOnly(key, completed, total, percentFloat) {
      const categoryEl = this.shadowRoot.querySelector(
        `.category[data-key="${key}"]`
      );
      if (!categoryEl) return;
  
      const summaryEl = categoryEl.querySelector(".category-summary");
      const barEl = categoryEl.querySelector(".bar");
  
      const pct = Math.round(percentFloat);
      if (summaryEl) summaryEl.textContent = `${completed} / ${total} (${pct}%)`;
      if (barEl) barEl.setAttribute("aria-valuenow", String(pct));
    }
  
    _animateSummary(key, completed, total, targetPercent) {
      if (this._prefersReducedMotion()) {
        this._currentPercent[key] = targetPercent;
        this._updateSummaryOnly(key, completed, total, targetPercent);
        return;
      }
  
      const startPercent = this._currentPercent[key] ?? 0;
      const endPercent = targetPercent;
      const duration = 350;
      const start = performance.now();
  
      if (this._rafIds[key]) cancelAnimationFrame(this._rafIds[key]);
  
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = startPercent + (endPercent - startPercent) * eased;
  
        this._currentPercent[key] = value;
        this._updateSummaryOnly(key, completed, total, value);
  
        if (t < 1) {
          this._rafIds[key] = requestAnimationFrame(tick);
        }
      };
  
      this._rafIds[key] = requestAnimationFrame(tick);
    }
  
    _onClick(event) {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
  
      const action = button.getAttribute("data-action");
  
      if (action === "reset-all") {
        ["homework", "practices", "games", "lifts"].forEach((k) => {
          this._stats[k].completed = 0;
          this._stats[k].total = 0;
          this._clamp(k);
          this._renderCategory(k);
          this._syncAttributes(k);
        });
  
        this.dispatchEvent(
          new CustomEvent("progress-changed", {
            detail: { category: "all" },
            bubbles: true,
            composed: true,
          })
        );
        return;
      }
  
      const categoryEl = button.closest(".category");
      if (!categoryEl) return;
  
      const key = categoryEl.getAttribute("data-key");
      if (!this._stats[key]) return;
  
      if (action === "add-completed") {
        this._stats[key].completed += 1;
        if (this._stats[key].total < this._stats[key].completed) {
          this._stats[key].total = this._stats[key].completed;
        }
      } else if (action === "add-total") {
        this._stats[key].total += 1;
      } else if (action === "remove-completed") {
        this._stats[key].completed -= 1;
      } else if (action === "remove-total") {
        this._stats[key].total -= 1;
      } else if (action === "reset-category") {
        this._stats[key].completed = 0;
        this._stats[key].total = 0;
      }
  
      this._clamp(key);
      this._renderCategory(key);
      this._syncAttributes(key);
  
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
      const categoryEl = this.shadowRoot.querySelector(
        `.category[data-key="${key}"]`
      );
      if (!categoryEl) return;
  
      const fillEl = categoryEl.querySelector(".fill");
  
      const percent =
        total > 0 ? Math.max(0, Math.min(100, (completed / total) * 100)) : 0;
  
      if (fillEl) fillEl.style.width = `${percent}%`;
  
      this._animateSummary(key, completed, total, percent);
    }
  }
  
  customElements.define("ath-progress-tracker", AthleteProgressTracker);
  