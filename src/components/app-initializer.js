import ActionPanel from "./action-panel";
import DrawingCanvas from "./drawing-canvas";

export default class AppInitializer extends HTMLElement {
  constructor() {
      super();
    }

    connectedCallback() {
      this.render();
      const container = document.querySelector('.container');

      const drawingCanvas = new DrawingCanvas();
      container.appendChild(drawingCanvas);
 
      setTimeout(() => {
        const actionPanel = new ActionPanel(drawingCanvas)
        container.appendChild(actionPanel);
      }, 0);
    }
  
    render() {
      return this.innerHTML = `
      <style>
        .container {
          display: flex;
          justify-content: center;
          gap: 30px;
          max-width: 900px;
        }
      </style>
      <div class="container"></div>
      `;
    }
}

customElements.define('app-initializer', AppInitializer);