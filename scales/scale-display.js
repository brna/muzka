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

  get scaleHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr class="fs-6">
        ${getScaleTypeTones(this.scaleType.name).map(
          (tone) => html`<th class="bg-secondary-subtle">${tone}</th>`
        )}
      </tr>
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="fw-bold">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get thirdsHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 2).map(
          (letter) => html`<td class="bg-warning-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="bg-warning-subtle fw-bold">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get sixthsHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="bg-success-subtle fw-bold">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, -5).map(
          (letter) => html`<td class="bg-success-subtle">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get triadsFromBaseHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 4).map(
          (letter) => html`<td class="bg-danger-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 2).map(
          (letter) => html`<td class="bg-danger-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="bg-danger-subtle fw-bold">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get triadsFromThirdsHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="bg-info-subtle fw-bold">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 4).map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, -5).map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get triadsFromThirdsHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="bg-info-subtle fw-bold">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 4).map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, -5).map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get triadsFromFifthsHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, -5).map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="bg-info-subtle fw-bold">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 4).map(
          (letter) => html`<td class="bg-info-subtle">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  get tetradsFromBaseHtml() {
    return html` <table class="table mt-2 border border-5 fs-3">
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 6).map(
          (letter) => html`<td class="bg-danger-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 4).map(
          (letter) => html`<td class="bg-danger-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetterPairs(this.key, this.scaleType.name, 2).map(
          (letter) => html`<td class="bg-danger-subtle">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) => html`<td class="bg-danger-subtle fw-bold">${letter}</td>`
        )}
      </tr>
    </table>`;
  }

  getAccordionItem(id, title, body, expanded) {
    return html`<div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button ${!expanded ? "collapsed" : undefined}"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#${id}"
          aria-expanded="${expanded ? "true" : "false"}"
          aria-controls="${id}"
        >
          ${title}
        </button>
      </h2>
      <div
        id="${id}"
        class="accordion-collapse collapse ${expanded ? "show" : undefined}"
        data-bs-parent="#accordionTables"
      >
        <div class="accordion-body">${body}</div>
      </div>
    </div>`;
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

          ${this.scaleHtml}

          <div class="accordion" id="accordionTables">
            ${this.getAccordionItem(
              "thirdsTable",
              "Thirds",
              this.thirdsHtml,
              true
            )}
            ${this.getAccordionItem(
              "sixthsTable",
              "Sixths",
              this.sixthsHtml,
              false
            )}
            ${this.getAccordionItem(
              "triadsFromBaseTable",
              "Triads",
              this.triadsFromBaseHtml,
              false
            )}
            ${this.getAccordionItem(
              "triadsFromThirdsTable",
              " Triads starting from the third",
              this.triadsFromThirdsHtml,
              false
            )}
            ${this.getAccordionItem(
              "triadsFromFifthsTable",
              "Triads starting from the fifth",
              this.triadsFromFifthsHtml,
              false
            )}
            ${this.getAccordionItem(
              "tetradsFromBaseTable",
              "Tetrads",
              this.tetradsFromBaseHtml,
              false
            )}
          </div>
        </div>
      `,
      this,
      { host: this }
    );
  }
}

customElements.define("scale-display", ScaleDisplay);
