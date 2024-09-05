import { html, render } from "../libs/lit-3/lit-all.min.js";
import {
  getChromaticLetters,
  getScaleLetters,
  getScaleTypeNames,
  getScaleTypeByName,
  isNatural,
} from "./scales-api.js";

class ScaleDisplay extends HTMLElement {
  async connectedCallback() {
    this.keys = getChromaticLetters();
    this.scaleTypeNames = getScaleTypeNames();

    this.key = "C";
    this.scaleType = getScaleTypeByName("major");

    this.render();
  }

  onKeyClick(event) {
    this.key = event.currentTarget.value;
    this.render();
  }

  onScaleTypeNameClick(event) {
    this.scaleType = getScaleTypeByName(event.currentTarget.value);
    console.log("sevent.currentTarget.value: ", event.currentTarget.value);
    console.log("selected scale type: ", this.scaleType);
    this.render();
  }

  get scaleLetters() {
    let values = getScaleLetters(this.key, this.scaleType.name);
    return [...values, values[0]];
  }

  render() {
    render(
      html`
        <div
          class="row mt-4 mb-4 bg-secondary"
          style="padding-top:1px;padding-bottom:1px"
        >
          ${this.keys.map(
            (key) =>
              html`<button
                @click=${this.onKeyClick}
                value="${key}"
                type="button"
                class="col btn btn-lg wx-100 ${key === this.key
                  ? "btn-primary"
                  : isNatural(key)
                  ? "btn-light"
                  : "btn-dark"}"
                style="margin-left:0.5px;margin-right:0.5px"
              >
                ${key}
              </button>`
          )}
        </div>
        <div class="row mt-4 mb-4 p-2 pe-4">
          ${this.scaleTypeNames.map(
            (name) =>
              html`<button
                @click=${this.onScaleTypeNameClick}
                value="${name}"
                type="button"
                class="col btn btn-sm ms-1 ${name === this.scaleType.name
                  ? "btn-danger"
                  : "btn-outline-dark"}"
              >
                <span class="fs-6">${name}</span>
              </button>`
          )}
        </div>
        <h1 class="mt-4 text-center">${this.key} ${this.scaleType.name}</h1>
        <div class="d-flex">
          ${this.scaleLetters.map(
            (letter) =>
              html`<button type="button" class="btn btn-sm btn-light w-100">
                ${letter}
              </button>`
          )}
          <div></div>
        </div>
      `,
      this,
      { host: this }
    );
  }
}

customElements.define("scale-display", ScaleDisplay);
