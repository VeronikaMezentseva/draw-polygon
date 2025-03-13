export default class ActionPanel extends HTMLElement {
  constructor(canvas) {
      super();
      this.canvas = canvas;
      this.events = new EventTarget();
    }

    attachEventListeners() {
      const panel = this.querySelector('.action-panel');

      panel.addEventListener('click', (event) => {
        if (event.target.classList.contains('create-point-button')) {
          this.canvas.isCanvasActive = true;
        } else if (event.target.classList.contains('clear-button')) {
          this.canvas.clearCanvas();
        } else if (event.target.classList.contains('draw-button')) {
          this.canvas.drawPolygon();
        } else if (event.target.classList.contains('first-point-button')) {
          this.events.dispatchEvent(new Event('firstPointButtonPressed'));
        } else if (event.target.classList.contains('second-point-button')) {
          this.events.dispatchEvent(new Event('secondPointButtonPressed'));
        }
      });
    }
    
    connectedCallback() {
      this.render();
      const canvas = this.canvas;
      canvas.events.addEventListener('pointAdded', () => this.render());
      canvas.events.addEventListener('pointsCleared', () => this.render());
      this.events.addEventListener('firstPointButtonPressed', (evt) => {
        canvas.secondPointSelectionFlag = false;
        canvas.firstPointSelectionFlag = !canvas.firstPointSelectionFlag;
      });
      this.events.addEventListener('secondPointButtonPressed', (evt) => {
        canvas.firstPointSelectionFlag = false;
        canvas.secondPointSelectionFlag = !canvas.secondPointSelectionFlag;
      });

      canvas.events.addEventListener('pointSelected', () => this.render());
    }
  
    render() {
      const pointsLength = this.canvas.pointArr.length;
      const isDisabledClearButton = pointsLength > 0 ? false : true;
      const isDisabledDrawButton = pointsLength >= 3 && pointsLength <=15 ? false : true;
      const firstSelectedPoint = this.canvas.pointArr.find((point) => point.selectedAsFirst);
      const secondSelectedPoint = this.canvas.pointArr.find((point) => point.selectedAsSecond);
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
          max-width: 200px;
        }
        .path-button-container {
          display: flex;
          gap: 30px;
        }
      </style>
      <div class="action-panel">
        <div>
          <p>Create polygon</p>
          <button class="button create-point-button">Create points</button>
          <points-component numbers="${pointsLength}"></points-component>
          <button class="button draw-button" ${isDisabledDrawButton && 'disabled'}>Draw polygon</button>
        </div>
        <div>
          <p>Create path</p>
          <div class="path-button-container">
            <button class="button first-point-button"}>First point:</button>
            <p>${firstSelectedPoint ? `p${firstSelectedPoint.num}` : ''}</p>
          </div>
          <div class="path-button-container">
            <button class="button second-point-button"}>Second point:</button>
            <p>${secondSelectedPoint ? `p${secondSelectedPoint.num}` : ''}</p>
          </div>
          <button class="button clear-button" ${isDisabledClearButton && 'disabled'}>Clear</button>
        </div>
        <p>Path: </p>
      </div>
    `;
    this.attachEventListeners();
    }
}

customElements.define('action-panel', ActionPanel);