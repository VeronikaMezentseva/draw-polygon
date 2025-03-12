export default class ActionPanel extends HTMLElement {
  constructor(canvas) {
      super();
      this.canvas = canvas;
    }

    attachEventListeners() {
      const panel = this.querySelector('.action-panel');

      panel.addEventListener('click', (event) => {
        if (event.target.classList.contains('create-point-button')) {
          this.canvas.isActive = true;
        } else if (event.target.classList.contains('clear-button')) {
          this.canvas.clearCanvas();
        } else if (event.target.classList.contains('draw-button')) {
          this.canvas.drawPolygon();
        }
      });
    }
    
    connectedCallback() {
      this.render();
      const canvas = this.canvas;
      canvas.events.addEventListener('pointAdded', () => this.render()); // сильно замедляет приложение
      canvas.events.addEventListener('pointsCleared', () => this.render());
    }
  
    render() {
      const pointsLength = this.canvas.pointArr.length;
      const isPolygonDrawn = this.canvas.isPolygonDrawn;
      const isDisabledClearButton = pointsLength > 0 ? false : true;
      const isDisabledDrawButton = pointsLength >= 3 && pointsLength <=15 ? false : true;
      console.log('rerender');
      this.innerHTML = `
      <style>
        .action-panel {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .action-panel_active {
          border: 1px solid green;
        }
        .button {
          padding: 5px 20px;
          width: 100%;
        }
      </style>
      <div class="action-panel">
        <button class="button create-point-button">Create points</button>
        <points-component numbers="${pointsLength}"></points-component>
        <button class="button clear-button" ${isDisabledClearButton && 'disabled'}>Clear</button>
        <button class="button draw-button" ${isDisabledDrawButton && 'disabled'}>Draw polygon</button>
      </div>
    `;
    this.attachEventListeners();
    }
}

customElements.define('action-panel', ActionPanel);