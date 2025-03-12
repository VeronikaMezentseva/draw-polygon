import MyPoint from "./my-point";
import MyVektor from "./my-vektor";

export default class DrawingCanvas extends HTMLElement {
  constructor() {
    super();
    this.isActive = false;
    this.isPolygonDrawn = false;
    this.pointArr = [];
    this.vektorArr = [];

    this.events = new EventTarget(); // Используем EventTarget для генерации событий
  }
  
  connectedCallback() {
    this.render();
    this.canvas = this.querySelector('.drawing-canvas');
    this.canvas.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.renderPoint(event);
    });
  }

  renderPoint(event) {
    if (this.isActive) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(`Клик по координатам: (${x}, ${y})`);
      
      const point = new MyPoint(x, y, this.pointArr.length + 1);
      this.pointArr.push(point);

      this.events.dispatchEvent(new Event('pointAdded'));
  
      this.canvas.appendChild(point);
    }
  }

  clearCanvas() {
    this.pointArr.forEach((pointNodde) => {
      this.canvas.removeChild(pointNodde);
    })
    this.pointArr = [];

    this.vektorArr.forEach((vektorNode) => {
      this.canvas.removeChild(vektorNode);
    })
    this.vektorArr = [];

    this.isActive = false;

    this.events.dispatchEvent(new Event('pointsCleared')); // Генерируем событие
  }

  findCenterPoint(points) {
    var x = 0, y = 0, i, len = points.length;

    for (i = 0; i < len; i++) {
      x += points[i].x;
      y += points[i].y;
    }
    return {x: x / len, y: y / len};   // return average position
  }

  findAngles(centerPoint, points) {
    var i, len = points.length, p, dx, dy;

    for (i = 0; i < len; i++) {
      p = points[i];
      dx = p.x - centerPoint.x;
      dy = p.y - centerPoint.y;
      p.angle = Math.atan2(dy, dx);
    }

    this.pointArr.sort(function(a, b) {
      if (a.angle > b.angle) return 1;
      else if (a.angle < b.angle) return -1;
      return 0;
    });
  }

  drawPolygon() {
    let vektorCoordinatesArr = [];

    const centerPoint = this.findCenterPoint(this.pointArr);
    this.findAngles(centerPoint, this.pointArr);

    for (let i = 0; i < this.pointArr.length; i++) {
      if (i + 1 !== this.pointArr.length) {
        vektorCoordinatesArr.push({
          x1: this.pointArr[i].x,
          y1: this.pointArr[i].y,
          x2: this.pointArr[i + 1].x,
          y2: this.pointArr[i + 1].y
        })
      } else {
        vektorCoordinatesArr.push({
          x1: this.pointArr[i].x,
          y1: this.pointArr[i].y,
          x2: this.pointArr[0].x,
          y2: this.pointArr[0].y
        })
      }
    }

    this.pointArr.forEach((_, index) => {
      const vektor = new MyVektor(vektorCoordinatesArr[index].x1, vektorCoordinatesArr[index].y1, vektorCoordinatesArr[index].x2, vektorCoordinatesArr[index].y2);
      this.vektorArr.push(vektor);
      this.canvas.appendChild(vektor);
    })

    // this.events.dispatchEvent(new Event('polygonDrawn'));
  }

  render() {
    return this.innerHTML = `
      <style>
        .drawing-canvas {
          position: relative;
          width: 200px;
          height: 200px;
          background-color: rgb(151, 149, 171);
        }
      </style>
      <div class="drawing-canvas">
      </div>
    `;
  }
}

customElements.define("drawing-canvas", DrawingCanvas);
