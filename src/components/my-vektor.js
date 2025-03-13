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
      this.active = false;
    }

    connectedCallback() {
      this.render();
    }
  
    render() {
      return this.shadowRoot.innerHTML = `
      <style>
      .vektor-container {
        position: absolute;
        pointer-events: none; /* Чтобы не мешать кликам по канвасу */
        z-index: 1;
      }
      .line {
        fill: none;
        stroke-width: 2;
        stroke: black;
      }
      .line_active {
        stroke: blue;
      }
    </style>
      <div class="vektor-container">
        <svg class="vektor" height="200" width="200" xmlns="http://www.w3.org/2000/svg">
          <line class="line ${this.active && 'line_active'}" x1="${this.x1}" y1="${this.y1}" x2="${this.x2}" y2="${this.y2}" />
        </svg> 
      </div>
    `;
    }
}

customElements.define('my-vektor', MyVektor);