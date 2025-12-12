class AthleteCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      const template = document.createElement("template");
      template.innerHTML = `
        <style>
          @import url("./styles.css");
  
          /* This makes the custom element behave like a block and center itself */
          :host {
            display: block;
            width: min(600px, calc(100% - 2rem));
            margin: 4rem auto;   /* centers horizontally */
          }
  
          .card {
            background: var(--color-surface, #ffffff);
            border-radius: var(--radius-md, 0.5rem);
            border: 1px solid var(--color-border, #e5e7eb);
            padding: var(--space-md, 1rem);
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            gap: var(--space-sm, 0.5rem);
          }
  
          .card__header {
            margin-bottom: var(--space-sm, 0.5rem);
            border-bottom: 1px solid var(--color-border, #e5e7eb);
            padding-bottom: var(--space-xs, 0.25rem);
          }
  
          .card__footer {
            margin-top: var(--space-sm, 0.5rem);
            padding-top: var(--space-xs, 0.25rem);
            border-top: 1px solid var(--color-border, #e5e7eb);
            font-size: var(--font-size-sm, 0.875rem);
            color: var(--color-fg-muted, #6b7280);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
          }
        </style>
  
        <article class="card">
          <header class="card__header">
            <slot name="header"></slot>
          </header>
          <section class="card__body">
            <slot></slot>
          </section>
          <footer class="card__footer">
            <slot name="footer"></slot>
          </footer>
        </article>
      `;
  
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
  
  customElements.define("ath-card", AthleteCard);
  