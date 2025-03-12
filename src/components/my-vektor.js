export default class MyVektor extends HTMLElement {
  constructor(x1, y1, x2, y2) {
      super();
      this.shadow = this.attachShadow(
          {mode: "open"}
      );
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
    }

    connectedCallback() {
      this.render();
    }
  
    render() {
      return this.shadowRoot.innerHTML = `
      <style>
      .vektor {
        position: absolute;
        pointer-events: none; /* Чтобы не мешать кликам по канвасу */
        z-index: 1;
      }
    </style>
      <div class="vektor">
        <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
          <line x1="${this.x1}" y1="${this.y1}" x2="${this.x2}" y2="${this.y2}" style="stroke:black;stroke-width:2" />
        </svg> 
      </div>
    `;
    }
}

customElements.define('my-vektor', MyVektor);