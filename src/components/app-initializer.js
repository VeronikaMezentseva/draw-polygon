import ActionPanel from "./action-panel";
import DrawingCanvas from "./drawing-canvas";

export default class AppInitializer extends HTMLElement {
  constructor() {
      super();
      this.shadow = this.attachShadow(
          {mode: "open"}
      );
    }

    connectedCallback() {
      this.render();
      // this.shadowRoot.appendChild(new DrawingCanvas())

      const drawingCanvas = new DrawingCanvas();
      this.shadowRoot.appendChild(drawingCanvas);
 
      // Здесь мы используем setTimeout, чтобы дать DOM время на обновление
      setTimeout(() => {
        const canvas = drawingCanvas;
        console.log(canvas);
        this.shadowRoot.appendChild(new ActionPanel(canvas));
      }, 0);
    }
  
    render() {
      return this.shadowRoot.innerHTML = ``;
    }
}

customElements.define('app-initializer', AppInitializer);