export default class PointsParagraph extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const numbers = this.getAttribute("numbers");
    const style = document.createElement("style");
    style.textContent = `
        p {
          color: ${numbers >= 3 && numbers <= 15 ? "#1bcc35" : "#DC2E45"};
        }
      `;

    this.paragraph = document.createElement("p");

    this.shadowRoot.append(style, this.paragraph);
  }

  connectedCallback() {
    this.updateNumbers();
  }

  static get observedAttributes() {
    return ["numbers"];
  }

  attributeChangedCallback(name) {
    if (name === "numbers") {
      this.updateNumbers();
    }
  }

  updateNumbers() {
    const numbers = this.getAttribute("numbers");
    if (numbers) {
      this.paragraph.textContent = `Created ${numbers} points`;
    }
  }
}

customElements.get('points-paragraph') || customElements.define('points-paragraph', PointsParagraph);

// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
