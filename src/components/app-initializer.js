import ActionPanel from "./action-panel";
import DrawingCanvas from "./drawing-canvas";

export default class AppInitializer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    const container = document.querySelector(".container");

    const drawingCanvas = new DrawingCanvas();
    this.canvas = drawingCanvas;
    container.appendChild(drawingCanvas);

    const actionPanel = new ActionPanel(drawingCanvas);
    this.panel = actionPanel;
    container.appendChild(actionPanel);

    this.initializePolygon();
  }

  initializePolygon() {
    const points = JSON.parse(localStorage.getItem("points"));
    if (points) {
      points.forEach((point) => {
        this.canvas.renderPointByCoords(point.x, point.y, point.name);
      });
      this.canvas.drawPolygon(points);
      this.panel.render();
    }
  }

  render() {
    return (this.innerHTML = `
      <style>
        .container {
          display: flex;
          justify-content: center;
          gap: 30px;
          max-width: 900px;
        }
      </style>
      <div class="container"></div>
      `);
  }
}

customElements.get('app-initializer') || customElements.define('app-initializer', AppInitializer);

// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
