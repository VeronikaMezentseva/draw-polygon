export default class TestComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow(
        {mode: "open"}
    );
}
  // The browser calls this method when the element is
  // added to the DOM.
  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
    <style>
      h2 {
          color: #E36374;
      }
      div {
        display: block;
        width: 200px;
        height: 200px;
      }
    </style>
    <div>
      <h2>
        dddddddddddd
      </h2>
    </div>
    `;
  }
}

// Register the CurrentDate component using the tag name <current-date>.
customElements.define("test-component", TestComponent);
