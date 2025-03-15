export default class PointsComponent extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      const numbers = this.getAttribute('numbers');
      const style = document.createElement('style');
      style.textContent = `
        p {
          color: ${numbers >= 3 && numbers <=15 ? '#1bcc35' : '#DC2E45'};
        }
      `;

      this.paragraph = document.createElement('p');

      this.shadowRoot.append(style, this.paragraph);
  }

  connectedCallback() {
      this.updateNumbers();
  }

  static get observedAttributes() {
      return ['numbers'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'numbers') {
          this.updateNumbers();
      }
  }

  updateNumbers() {
      const numbers = this.getAttribute('numbers');
      if (numbers) {
          this.paragraph.textContent = `Created ${numbers} points`;
      }
  }
}

customElements.define('points-component', PointsComponent);

// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later