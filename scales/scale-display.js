import { html, render, join } from "../libs/lit-3/lit-all.min.js";
import {
  getChromaticLetters,
  getScaleLetters,
  getScaleLetterPairs,
  getScaleTypeNames,
  getScaleTypeByName,
  getScaleTypeTones,
  isNatural,
  getScaleChords,
  getModalScale,
} from "./scales-api.js";

getScaleChords();

class ScaleDisplay extends HTMLElement {
  async connectedCallback() {
    this.keys = getChromaticLetters();
    this.scaleTypeNames = getScaleTypeNames();

    let searchParams = new URLSearchParams(window.location.search);
    console.log(`location=${location}, searchParams=`, searchParams);

    let key = searchParams.get("key");
    console.log(
      `### this.keys.includes(${key}): ${this.keys.includes(key)}`,
      this.keys
    );
    if (key && this.keys.includes(key)) {
      this.key = key;
    }
    this.key ??= "C";

    let scale = searchParams.get("scale");
    if (scale && this.scaleTypeNames.includes(scale)) {
      this.scaleType = getScaleTypeByName(scale);
    }
    this.scaleType ??= getScaleTypeByName("major");

    this.updateUrl();

    this.render();
  }

  updateUrl() {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("key", this.key);
    searchParams.set("scale", this.scaleType.name);
    const url =
      window.location.origin +
      window.location.pathname +
      "?" +
      searchParams.toString();
    if (window.location.href !== url) {
      window.location.href = url; // reload
    }
  }

  get() {
    return new URLSearchParams(document.location.search).get("key");
  }

  onKeyClick(event) {
    this.key = event.currentTarget.value || event.currentTarget.dataset.key;
    console.log("onKeyClick: key=" + this.key);
    this.updateUrl();
    this.render();
  }

  onScaleTypeNameClick(event) {
    this.scaleType =
      getScaleTypeByName(event.currentTarget.value) ||
      event.currentTarget.dataset.scale;
    this.updateUrl();
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
          (letter) =>
            html`<td class="fw-bold" data-key="${letter}">${letter}</td>`
        )}
      </tr>
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter, index) => {
            let modalScale = getModalScale(
              this.scaleType,
              this.scaleType.tones[index]
            );
            return html`<td
              class="fw-bold"
              data-key="${letter}"
              @click=${this.onKeyClick}
              style="font-size:8pt"
            >
              ${letter} ${this.modalScale?.name}
            </td>`;
          }
        )}
      </tr>
      <tr>
        ${getScaleLetters(this.key, this.scaleType.name, 1).map(
          (letter) =>
            html`<td
              class="fw-bold"
              data-key="${letter}"
              @click=${this.onKeyClick}
              style="font-size:8pt"
            >
              ${letter} ${this.scaleType.name}
            </td>`
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

  getChordsHtml(shifts) {
    let chords = getScaleChords(this.key, this.scaleType.name, shifts);
    return html`<table class="table mt-2 border border-5 fs-3">
      <tr>
        ${chords.map(
          (chord) => html`<td>${join(chord.toReversed(), html`<br />`)}</td>`
        )}
      </tr>
    </table>`;
  }

  getAccordionItem(id, title, body, expanded) {
    if (this.scaleType.tones.length < 7) {
      return undefined;
    }
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
            ${this.scaleType.aliases?.length
              ? `(${this.scaleType.aliases.join(", ")})`
              : undefined}
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
              this.getChordsHtml([0, 2, 4]),
              false
            )}
            ${this.getAccordionItem(
              "triadsFromThirdsTable",
              " Triads starting from the third",
              this.getChordsHtml([2, 4, 0]),
              false
            )}
            ${this.getAccordionItem(
              "triadsFromFifthsTable",
              "Triads starting from the fifth",
              this.getChordsHtml([4, 0, 2]),
              false
            )}
            ${this.getAccordionItem(
              "tetradsFromBaseTable",
              "Tetrads",
              this.getChordsHtml([0, 2, 4, 6]),
              false
            )}
            ${this.getAccordionItem(
              "pentatonics69",
              "Pentatonics 6/9",
              this.getChordsHtml([0, 1, 2, 4, 5]),
              false
            )}
            ${this.getAccordionItem(
              "pentatonics79",
              "Pentatonics 7/9",
              this.getChordsHtml([0, 1, 2, 4, 6]),
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
