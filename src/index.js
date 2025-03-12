import TestComponent from "../src/components/test-components";
import DrawingCanvas from "./components/drawing-canvas";
import Point from "./components/my-point";
import ActionPanel from "./components/action-panel";
import AppInitializer from "./components/app-initializer";
import MyVektor from "./components/my-vektor";
import PointsComponent from "./components/points-paragraph";

// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

class HelloWorld extends HTMLElement {
    constructor() {
        super();

        // We need an encapsulation of our component to not
        // interfer with the host, nor be vulnerable to outside
        // changes --> Solution = SHADOW DOM
        this.shadow = this.attachShadow(
            {mode: "open"}    // Set mode to "open", to have access to
                              // the shadow dom from inside this component
        );
    }

    // Triggers when the element is added to the document *and*
    // becomes part of the page itself (not just a child of a detached DOM)
    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                h1 {
                    color: red;
                }
            </style>
            <h1>
                Drawing Canvas:
            </h1>
        `;
    }
}

// Register our first Custom Element named <hello-world>
customElements.define('hello-world', HelloWorld);