import { html, render } from "../libs/lit-3/lit-all.min.js";
import {
  getChromaticLetters,
  getScaleLetters,
  getScaleLetterPairs,
  getScaleTypeNames,
  getScaleTypeByName,
  getScaleTypeTones,
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

  get scaleTypeTones() {
    let values = getScaleTypeTones(this.scaleType.name);
    return [...values, values[0]];
  }

  get scaleLetters() {
    let values = getScaleLetters(this.key, this.scaleType.name);
    return [...values, values[0]];
  }

  get thirdAboveScaleLetters() {
    let values = getScaleLetterPairs(this.key, this.scaleType.name, 2);
    return [...values, values[0]];
  }

  get fifthAboveScaleLetters() {
    let values = getScaleLetterPairs(this.key, this.scaleType.name, 4);
    return [...values, values[0]];
  }

  get sixthBellowScaleLetters() {
    let values = getScaleLetterPairs(this.key, this.scaleType.name, -5);
    return [...values, values[0]];
  }

  get scaleHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr class="fs-6">
        ${this.scaleTypeTones.map(
          (tone) => html`<th class="bg-secondary-subtle">${tone}</th>`
        )}
      </tr>
      <tr>
        ${this.scaleLetters.map(
          (letter) => html`<td class="fw-bold">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get thirdsHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${this.thirdAboveScaleLetters.map(
          (letter) => html`<td class="bg-warning-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${this.scaleLetters.map(
          (letter) => html`<td class="bg-warning-subtle fw-bold">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get sixthsHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${this.scaleLetters.map(
          (letter) => html`<td class="bg-success-subtle fw-bold">${letter}</td>`
        )}
      </tr>
      <tr>
        ${this.sixthBellowScaleLetters.map(
          (letter) => html`<td class="bg-success-subtle">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get triadsAboveHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${this.fifthAboveScaleLetters.map(
          (letter) => html`<td class="bg-danger-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${this.thirdAboveScaleLetters.map(
          (letter) => html`<td class="bg-danger-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${this.scaleLetters.map(
          (letter) => html`<td class="bg-danger-subtle fw-bold">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get triadsBellowHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${this.scaleLetters.map(
          (letter) => html`<td class="bg-info-subtle fw-bold">${letter}</td>`
        )}
      </tr>
      <tr>
        ${this.fifthAboveScaleLetters.map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${this.sixthBellowScaleLetters.map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  render() {
    render(
      html`
        <div class="ps-2 pe-2">
          <div
            class="row p-2 bg-secondary"
            style="padding-top:1px;padding-bottom:1px"
          >
            ${this.keys.map(
              (key) =>
                html`<button
                  @click=${this.onKeyClick}
                  value="${key}"
                  type="button"
                  class="col btn btn-sm w-100 ${key === this.key
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
          <div class="row p-2 pt-1 pb-1 bg-warning">
            ${this.scaleTypeNames.map(
              (name) =>
                html`<button
                  @click=${this.onScaleTypeNameClick}
                  value="${name}"
                  type="button"
                  class="col btn btn-sm ms-1 ${name === this.scaleType.name
                    ? "btn-danger"
                    : "bg-warning-subtle"}"
                  style="margin-top:1px; margin-bottom:1px"
                >
                  <span class="fs-6">${name}</span>
                </button>`
            )}
          </div>
          <h1 class="mt-2 text-center fw-bold">
            ${this.key} ${this.scaleType.name}
          </h1>

          ${this.scaleHtml} ${this.thirdsHtml} ${this.sixthsHtml}
          ${this.triadsAboveHtml} ${this.triadsBellowHtml}
        </div>
      `,
      this,
      { host: this }
    );
  }
}

customElements.define("scale-display", ScaleDisplay);
