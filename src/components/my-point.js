// Компонент Point
export default class MyPoint extends HTMLElement {
    constructor(x, y, num) {
        super();
        this.shadow = this.attachShadow(
            {mode: "open"}
        );
        this.x = x;
        this.y = y;
        this.num = num;
        this.selected = false;
        this.addEventListener('click', (evt) => {
          evt.stopPropagation()
          evt.preventDefault();
          this.selected = !this.selected;
        });
      }

      connectedCallback() {
        this.render();
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
        </style>
        <div class="point">
            
        </div>
      `;
      }
}

// Регистрируем веб-компонент Point
customElements.define('my-point', MyPoint);