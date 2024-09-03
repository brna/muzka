import { html, render } from "../libs/lit-3/lit-all.min.js";

class ScaleDisplay extends HTMLElement {
  async connectedCallback() {
    console.log(`ScaleDisplay connectedCallback ...`);
    this.render();
  }

  render() {
    render(html`<div>ScaleDisplay TODO</div> `, this, { host: this });
  }
}

customElements.define("scale-display", ScaleDisplay);
