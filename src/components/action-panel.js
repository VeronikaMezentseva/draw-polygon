export default class ActionPanel extends HTMLElement {
  constructor(canvas) {
      super();
      this.canvas = canvas;
      this.events = new EventTarget();
      this.clockwisePath = '';
      this.counterclockwisePath = '';
    }

    attachEventListeners() {
      const panel = this.querySelector('.action-panel');

      panel.addEventListener('click', (event) => {
        if (event.target.classList.contains('create-point-button')) {
          this.canvas.isCanvasActive = true;
        } else if (event.target.classList.contains('clear-button')) {
          this.canvas.clearCanvas();
          this.clockwisePath = '';
          this.counterclockwisePath = '';
          this.render();
        } else if (event.target.classList.contains('draw-button')) {
          this.canvas.drawPolygon();
        } else if (event.target.classList.contains('first-point-button')) {
          this.events.dispatchEvent(new Event('firstPointButtonPressed'));
        } else if (event.target.classList.contains('second-point-button')) {
          this.events.dispatchEvent(new Event('secondPointButtonPressed'));
        }
      });
    }

    handlePath() {
      const firstSelectedPoint = this.canvas.pointArr.find((point) => point.selectedAsFirst);
      const secondSelectedPoint = this.canvas.pointArr.find((point) => point.selectedAsSecond);
      if (firstSelectedPoint && secondSelectedPoint) {
        const pointNames = this.canvas.pointArr.map((point) => point.num);
        const firstPoint = firstSelectedPoint.num;
        const secondPoint = secondSelectedPoint.num;

        const pathes = this.makePathes(pointNames, firstPoint, secondPoint);
        this.clockwisePath = pathes.clockwiseArr;
        this.counterclockwisePath = pathes.counterclockwiseArr;
      }
    }

    makePathes(arr, start, end) {
      // arr = [5,2,7,6,8,1,3]
      // arr = [3,1,8,6,7,2,5]
      // start = 2
      // end = 1
      // [2,5,3,1]

      const startIndex = arr.indexOf(start);
      const endIndex = arr.indexOf(end);
      let clockwiseArr = [];
      let counterclockwiseArr = [];
      for (let i = startIndex; i % arr.length !== endIndex; i++) {
        clockwiseArr.push(arr[i%arr.length]);
      }
      clockwiseArr.push(arr[endIndex]);
      const reverseArr = arr.reverse();
      const startIndexReverse = reverseArr.indexOf(start);
      const endIndexReverse = reverseArr.indexOf(end);
      for (let i = startIndexReverse; i % reverseArr.length !== endIndexReverse; i++) {
        counterclockwiseArr.push(reverseArr[i%reverseArr.length]);
      }
      counterclockwiseArr.push(reverseArr[endIndexReverse]);
      return {
        clockwiseArr,
        counterclockwiseArr
      };
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
      canvas.events.addEventListener('twoPointsSelected', () => {
        this.handlePath();
        this.render();
      });
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
        <p>Path clockwisePath: ${this.clockwisePath}</p>
        <p>Path counterclockwisePath: ${this.counterclockwisePath}</p>
      </div>
    `;
    this.attachEventListeners();
    }
}

customElements.define('action-panel', ActionPanel);