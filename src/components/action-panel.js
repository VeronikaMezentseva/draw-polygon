// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class ActionPanel extends HTMLElement {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.events = new EventTarget();
    this.clockwisePath = "";
    this.counterclockwisePath = "";
    this.orderButtonText = "Clockwise order";
    this.currentPath = this.clockwisePath;
  }

  attachEventListeners() {
    const panel = this.querySelector(".action-panel");

    panel.addEventListener("click", (event) => {
      if (event.target.classList.contains("create-point-button")) {
        this.canvas.isCanvasActive = true;
      } else if (event.target.classList.contains("clear-button")) {
        this.canvas.clearCanvas();
        this.clockwisePath = "";
        this.counterclockwisePath = "";
        this.currentPath = "";
        this.orderButtonText = "Clockwise order";
        this.canvas.firstPointSelectionFlag = false;
        this.canvas.secondPointSelectionFlag = false;
        this.render();
      } else if (event.target.classList.contains("clear-storage-button")) {
        this.clearLocalStorage();
      } else if (event.target.classList.contains("draw-button")) {
        this.canvas.drawPolygon(this.canvas.pointArr);
        this.canvas.savePointsCoordsToLocalStorage(this.canvas.pointArr);
        this.render();
      } else if (event.target.classList.contains("first-point-button")) {
        this.events.dispatchEvent(new Event("firstPointButtonPressed"));
      } else if (event.target.classList.contains("second-point-button")) {
        this.events.dispatchEvent(new Event("secondPointButtonPressed"));
      } else if (event.target.classList.contains("order-button")) {
        this.canvas.events.dispatchEvent(new Event("changeOrder"));
        if (this.orderButtonText === "Clockwise order") {
          this.orderButtonText = "Counterclockwise order";
          this.currentPath = this.counterclockwisePath
            .map((point) => "p" + point)
            .join(" - ");
        } else {
          this.orderButtonText = "Clockwise order";
          this.currentPath = this.clockwisePath
            .map((point) => "p" + point)
            .join(" - ");
        }
        this.render();
      }
    });
  }

  handlePath() {
    const firstSelectedPoint = this.canvas.pointArr.find(
      (point) => point.selectedAsFirst
    );
    const secondSelectedPoint = this.canvas.pointArr.find(
      (point) => point.selectedAsSecond
    );
    if (firstSelectedPoint && secondSelectedPoint) {
      const pointNames = this.canvas.pointArr.map((point) => point.num);
      const firstPoint = firstSelectedPoint.num;
      const secondPoint = secondSelectedPoint.num;

      const pathes = this.makePathes(pointNames, firstPoint, secondPoint);
      this.clockwisePath = pathes.clockwiseArr;
      this.counterclockwisePath = pathes.counterclockwiseArr;

      this.canvas.events.dispatchEvent(
        new CustomEvent("pathesCreated", {
          detail: {
            clockwisePath: this.clockwisePath,
            counterclockwisePath: this.counterclockwisePath,
            order: this.orderButtonText,
          },
        })
      );
    }
  }

  makePathes(arr, start, end) {
    const startIndex = arr.indexOf(start);
    const endIndex = arr.indexOf(end);
    let clockwiseArr = [];
    let counterclockwiseArr = [];
    for (let i = startIndex; i % arr.length !== endIndex; i++) {
      clockwiseArr.push(arr[i % arr.length]);
    }
    clockwiseArr.push(arr[endIndex]);
    const reverseArr = arr.reverse();
    const startIndexReverse = reverseArr.indexOf(start);
    const endIndexReverse = reverseArr.indexOf(end);
    for (
      let i = startIndexReverse;
      i % reverseArr.length !== endIndexReverse;
      i++
    ) {
      counterclockwiseArr.push(reverseArr[i % reverseArr.length]);
    }
    counterclockwiseArr.push(reverseArr[endIndexReverse]);
    return {
      clockwiseArr,
      counterclockwiseArr,
    };
  }

  connectedCallback() {
    this.render();
    const canvas = this.canvas;
    canvas.events.addEventListener("pointAdded", () => this.render());
    canvas.events.addEventListener("pointsCleared", () => this.render());
    this.events.addEventListener("firstPointButtonPressed", () => {
      canvas.secondPointSelectionFlag = false;
      canvas.firstPointSelectionFlag = true;
      this.render();
    });
    this.events.addEventListener("secondPointButtonPressed", () => {
      canvas.firstPointSelectionFlag = false;
      canvas.secondPointSelectionFlag = true;
      this.render();
    });

    canvas.events.addEventListener("pointSelected", () => this.render());
    canvas.events.addEventListener("twoPointsSelected", () => {
      this.canvas.vektorArr.forEach((vektor) => {
        vektor.active = false;
        vektor.render();
      });
      this.handlePath();
      if (this.orderButtonText === "Clockwise order") {
        this.currentPath = this.clockwisePath
          .map((point) => "p" + point)
          .join(" - ");
      } else {
        this.currentPath = this.counterclockwisePath
          .map((point) => "p" + point)
          .join(" - ");
      }
      this.render();
    });
  }

  clearLocalStorage() {
    localStorage.removeItem("points");
  }

  render() {
    const pointsLength = this.canvas.pointArr.length;

    const isDisabledClearButton = pointsLength > 0 ? false : true;
    const isDisabledDrawButton =
      (pointsLength >= 3 && pointsLength <= 15 ? false : true) ||
      this.canvas.isPolygonDrawn;
    const isDisabledPointSelectingButtons = !this.canvas.isPolygonDrawn;
    const isCreatePointsButtonDisabled = this.canvas.isPolygonDrawn;
    const isChangeOrderButtonDisabled = !this.canvas.isPathCreated;

    const firstButtonPressed = this.canvas.firstPointSelectionFlag;
    const secondButtonPressed = this.canvas.secondPointSelectionFlag;

    const firstSelectedPoint = this.canvas.pointArr.find(
      (point) => point.selectedAsFirst
    );
    const secondSelectedPoint = this.canvas.pointArr.find(
      (point) => point.selectedAsSecond
    );
    const pointMap = {};
    this.canvas.pointArr.forEach((point) => {
      pointMap[point.num] = point;
    });
    const path = this.currentPath;

    this.innerHTML = `
      <style>
        .action-panel {
          display: flex;
          flex-direction: column;
          gap: 30px;
          width: 350px;
        }
        .action-panel_active {
          border: 1px solid green;
        }
        .main-paragraph {
          font-size: 22px;
          font-weight: bold;
        }
        .path {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .button {
          font-size: 16px;
          padding: 10px 20px;
          width: 100%;
          border: none;
          border-radius: 8px;
        }
        .button:hover:not(:disabled) {
          background-color: #d3eaea;
          outline: 1px solid white;
        }
        .button:disabled {
          opacity: .7;
          pointer: none;
        }
        p {
          margin: 5px 0px;
        }
        .first-point-button {
          max-width: 260px;
        }
        .button-pressed {
          outline: 3px solid rgb(38, 143, 235);
        }
        .second-point-button {
          max-width: 260px;
        }
        .path-button-container {
          display: flex;
          gap: 30px;
          align-items: flex-start;
        }
      </style>
      <div class="action-panel">
        <div>
          <p class="main-paragraph">Create polygon</p>
          <button class="button create-point-button" ${
            isCreatePointsButtonDisabled && "disabled"
          }>Create points</button>
          <points-paragraph numbers="${pointsLength}"></points-paragraph>
          <button class="button draw-button" ${
            isDisabledDrawButton && "disabled"
          }>Draw polygon</button>
        </div>
        <div>
          <p class="main-paragraph">Create path</p>
          <div class="path">        
            <div class="path-button-container">
              <button class="button first-point-button ${firstButtonPressed && 'button-pressed'}" ${
                isDisabledPointSelectingButtons && "disabled"
              }>First point:</button>
              <p>${firstSelectedPoint ? `p${firstSelectedPoint.num}` : ""}</p>
            </div>
            <div class="path-button-container">
              <button class="button second-point-button  ${secondButtonPressed && 'button-pressed'}" ${
                isDisabledPointSelectingButtons && "disabled"
              }>Second point:</button>
              <p>${secondSelectedPoint ? `p${secondSelectedPoint.num}` : ""}</p>
            </div>
            <button class="button order-button" ${
              isChangeOrderButtonDisabled && "disabled"
            }>${this.orderButtonText}</button>
            <button class="button clear-button" ${
              isDisabledClearButton && "disabled"
            }>Clear</button>
            <button class="button clear-storage-button">Clear local storage</button>
          </div>
        </div>
        <p class="main-paragraph">Path: ${path}</p>
      </div>
    `;
    this.attachEventListeners();
  }
}

customElements.get('action-panel') || customElements.define('action-panel', ActionPanel);

// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
