// Компонент Point
export default class MyPoint extends HTMLElement {
    constructor(x, y, num, canvas) {
        super();
        this.shadow = this.attachShadow(
            {mode: "open"}
        );
        this.events = new EventTarget();
        this.x = x;
        this.y = y;
        this.num = num;
        this.canvas = canvas;
        this.selectedAsFirst = false;
        this.selectedAsSecond = false;
        this.addEventListener('click', (evt) => {
          evt.stopPropagation()
          evt.preventDefault();
          this.events.dispatchEvent(new Event('pointPressed'));
        });
      }

      // Метод для добавления слушателя события
      onPointPressed(callback) {
        this.events.addEventListener('pointPressed', callback);
      }

      connectedCallback() {
        this.render();
      }
    
      render() {
        return this.shadowRoot.innerHTML = `
        <style>
          .point {
            position: absolute;
            display: block;
            background-color: white;
            border: 2px solid black;
            font-size: 18px;
            font-weight: bold;
            color: #306573;
            border-radius: 50%;
            width: 10px;
            height: 10px;
            left: ${this.x - 5}px; /* Сдвиг для центрирования */
            top: ${this.y - 5}px;  /* Сдвиг для центрирования */
            z-index: 2;
          }
          .point::before {
            content: 'p${this.num}';
            position: absolute;
            bottom: 15px;
            z-index: 2;
          }
          .point:hover {
            border: 2px solid rgb(38, 143, 235);
            cursor: pointer;
            color: rgb(38, 143, 235);
          }
          .point_selected {
            background-color: #0197F6;
          }
        </style>
        <div class="point ${(this.selectedAsFirst || this.selectedAsSecond) && 'point_selected'}">
            
        </div>
      `;
      }
}

customElements.define('my-point', MyPoint);