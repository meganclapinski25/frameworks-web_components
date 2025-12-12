class AthleteCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      const template = document.createElement("template");
      template.innerHTML = `
        <style>
          @import url("./acsd.css");
  
          :host {
            display: block;
            width: 100%;
            max-width: 40rem;     
            margin-inline: auto;  
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