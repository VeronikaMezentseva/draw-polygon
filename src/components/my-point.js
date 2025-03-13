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
        this.selected = false;
        this.addEventListener('click', (evt) => {
          evt.stopPropagation()
          evt.preventDefault();
          // вызывать экшн pointPressed
          this.events.dispatchEvent(new Event('pointPressed'));
          // if (this.canvas.pointSelectionFlag) {
          //   this.selected = !this.selected;
          //   this.render();
          // }
        });
      }

      // Метод для добавления слушателя события
      onPointPressed(callback) {
        this.events.addEventListener('pointPressed', callback);
      }

      connectedCallback() {
        this.render();
        this.events.addEventListener('firstPointButtonPressed', (evt) => {
          console.log(evt.target);
        })
      }

      handlePointClick() {

      }
    
      render() {
        return this.shadowRoot.innerHTML = `
        <style>
          .point {
            position: absolute;
            display: block;
            background-color: white;
            border: 1px solid black;
            border-radius: 50%;
            width: 10px;
            height: 10px;
            left: ${this.x - 5}px; /* Сдвиг для центрирования */
            top: ${this.y - 5}px;  /* Сдвиг для центрирования */
            z-index: 1;
          }
          .point::before {
            content: '${this.num}';
            position: absolute;
            bottom: 10px;
          }
          .point:hover {
            border: 1px solid blue;
            cursor: pointer;
            color: blue;
          }
          .point_selected {
            border: 1px solid blue;
            color: blue;
          }
        </style>
        <div class="point ${this.selected && 'point_selected'}">
            
        </div>
      `;
      }
}

// Регистрируем веб-компонент Point
customElements.define('my-point', MyPoint);