import MyPoint from "./my-point";
import MyVektor from "./my-vektor";

// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class DrawingCanvas extends HTMLElement {
  constructor() {
    super();
    this.isCanvasActive = false;
    this.isPolygonDrawn = false;
    this.firstPointSelectionFlag = false;
    this.secondPointSelectionFlag = false;
    this.isPathCreated = false;
    this.order = "Clockwise order";
    this.pointArr = [];
    this.vektorArr = [];
    this.events = new EventTarget();
  }

  connectedCallback() {
    this.render();
    this.canvas = this.querySelector(".drawing-canvas");
    this.canvas.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.renderPoint(event);
    });

    this.events.addEventListener("pathesCreated", (evt) => {
      this.vektorArr.forEach((vektor) => (vektor.active = false));
      const pointNames = this.pointArr.map((point) => point.num);
      const pathes = evt.detail;
      this.order = evt.detail.order;

      let indexesToFind = pathes.clockwisePath.filter(
        (point) =>
          pathes.clockwisePath.indexOf(point) !==
          pathes.clockwisePath.length - 1
      );

      const indexes = indexesToFind.map((value) => pointNames.indexOf(value));

      const vektorsToActivate = indexes.map((index) => this.vektorArr[index]);

      vektorsToActivate.forEach((vektor) => {
        vektor.active = true;
        vektor.render();
      });
      this.isPathCreated = true;

      if (this.order === "Clockwise order") {
        vektorsToActivate.forEach((vektor) => {
          vektor.render();
        });
      } else {
        const activeVektors = this.vektorArr.filter((vektor) => vektor.active);
        const deactiveVektors = this.vektorArr.filter(
          (vektor) => !vektor.active
        );
        activeVektors.forEach((vektor) => {
          vektor.active = false;
          vektor.render();
        });
        deactiveVektors.forEach((vektor) => {
          vektor.active = true;
          vektor.render();
        });
      }
    });

    this.events.addEventListener("changeOrder", () => {
      this.vektorArr.forEach((vektor) => {
        if (vektor.active) {
          vektor.active = false;
          vektor.render();
        } else {
          vektor.active = true;
          vektor.render();
        }
      });
    });
  }

  handlePointPressed(point) {
    if (this.firstPointSelectionFlag) {
      if (point.selectedAsSecond) {
        return;
      }
      this.pointArr.map((point) => {
        point.selectedAsFirst = false;
        point.render();
      });
      point.selectedAsFirst = true;
      this.events.dispatchEvent(new Event("pointSelected"));
      point.render();
    } else if (this.secondPointSelectionFlag) {
      if (point.selectedAsFirst) {
        return;
      }
      this.pointArr.map((point) => {
        point.selectedAsSecond = false;
        point.render();
      });
      point.selectedAsSecond = true;
      this.events.dispatchEvent(new Event("pointSelected"));
      point.render();
    }
    const isFirstPointSelected = this.pointArr.find(
      (point) => point.selectedAsFirst === true
    );
    const isSecondPointSelected = this.pointArr.find(
      (point) => point.selectedAsSecond === true
    );
    if (isFirstPointSelected && isSecondPointSelected) {
      this.events.dispatchEvent(new Event("twoPointsSelected"));
    }
  }

  renderPoint(event) {
    if (this.isCanvasActive && !this.isPolygonDrawn) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const point = new MyPoint(x, y, this.pointArr.length + 1, this);
      point.onPointPressed(() => {
        this.handlePointPressed(point);
      });
      this.pointArr.push(point);

      this.events.dispatchEvent(new Event("pointAdded"));

      this.canvas.appendChild(point);
    }
  }

  renderPointByCoords(x, y, pointName) {
    const point = new MyPoint(x, y, pointName, this);
    point.onPointPressed(() => {
      this.handlePointPressed(point);
    });
    this.pointArr.push(point);

    this.events.dispatchEvent(new Event("pointAdded"));

    this.canvas.appendChild(point);
  }

  clearCanvas() {
    this.pointArr.forEach((pointNodde) => {
      this.canvas.removeChild(pointNodde);
    });
    this.pointArr = [];

    this.vektorArr.forEach((vektorNode) => {
      this.canvas.removeChild(vektorNode);
    });
    this.vektorArr = [];

    this.isCanvasActive = false;
    this.events.dispatchEvent(new Event("pointsCleared"));
    this.isPolygonDrawn = false;
    this.isPathCreated = false;
  }

  findCenterPoint(points) {
    let x = 0,
      y = 0,
      i,
      len = points.length;

    for (i = 0; i < len; i++) {
      x += points[i].x;
      y += points[i].y;
    }
    return { x: x / len, y: y / len }; // return average position
  }

  findAngles(centerPoint, points) {
    let i,
      len = points.length,
      p,
      dx,
      dy;

    for (i = 0; i < len; i++) {
      p = points[i];
      dx = p.x - centerPoint.x;
      dy = p.y - centerPoint.y;
      p.angle = Math.atan2(dy, dx);
    }

    this.pointArr.sort(function (a, b) {
      if (a.angle > b.angle) return 1;
      else if (a.angle < b.angle) return -1;
      return 0;
    });
  }

  savePointsCoordsToLocalStorage(points) {
    const pointsToSave = points.map((point) => {
      return {
        x: point.x,
        y: point.y,
        name: point.num,
      };
    });
    localStorage.setItem("points", JSON.stringify(pointsToSave));
  }

  drawPolygon(points) {
    if (!this.isPolygonDrawn) {
      let vektorCoordinatesArr = [];
  
      const centerPoint = this.findCenterPoint(points);
      this.findAngles(centerPoint, points);
  
      for (let i = 0; i < points.length; i++) {
        if (i + 1 !== points.length) {
          vektorCoordinatesArr.push({
            x1: points[i].x,
            y1: points[i].y,
            x2: points[i + 1].x,
            y2: points[i + 1].y,
          });
        } else {
          vektorCoordinatesArr.push({
            x1: points[i].x,
            y1: points[i].y,
            x2: points[0].x,
            y2: points[0].y,
          });
        }
        this.isPolygonDrawn = true;
        this.isCanvasActive = false;
      }
  
      points.forEach((_, index) => {
        const vektor = new MyVektor(
          vektorCoordinatesArr[index].x1,
          vektorCoordinatesArr[index].y1,
          vektorCoordinatesArr[index].x2,
          vektorCoordinatesArr[index].y2,
          this.vektorArr.length + 1
        );
        this.vektorArr.push(vektor);
        this.canvas.appendChild(vektor);
      });
    }
  }

  render() {
    return (this.innerHTML = `
      <style>
        drawing-canvas {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          width: 100%;
          color: black;
          border: 1px solid black;
        }
        .drawing-canvas {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: white;
          flex: 1;
        }
      </style>
      <div class="drawing-canvas">
      </div>
    `);
  }
}

customElements.get('drawing-canvas') || customElements.define('drawing-canvas', DrawingCanvas);

// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
