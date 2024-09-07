import { html, render, join } from "../libs/lit-3/lit-all.min.js";
import {
  getChromaticLetters,
  getScaleLetters,
  getScaleLetterPairs,
  getScaleTypeNames,
  getScaleTypeByName,
  getScaleTypeTones,
  isNatural,
  isFlat,
  isSharp,
  getScaleChords,
  getModalScale,
  getChromaticLetter,
} from "./scales-api.js";
import { convertToRoman } from "./utils.js";

getScaleChords();

class ScaleDisplay extends HTMLElement {
  async connectedCallback() {
    this.keys = getChromaticLetters();
    this.scaleTypeNames = getScaleTypeNames();

    let searchParams = new URLSearchParams(window.location.search);

    let key = searchParams.get("key");
    if (key) {
      if (this.keys.includes(key)) {
        this.key = key;
      } else if (isFlat(key)) {
        let sharpKey = getChromaticLetter(key, true);
        if (sharpKey) {
          this.key = sharpKey;
        }
      } else if (isSharp(key)) {
        let flatKey = getChromaticLetter(key, false);
        if (flatKey) {
          this.key = flatKey;
        }
      }
    }
    this.key ??= "C";

    let scale = searchParams.get("scale");
    if (scale && this.scaleTypeNames.includes(scale)) {
      this.scaleType = getScaleTypeByName(scale);
    }
    this.scaleType ??= getScaleTypeByName("major");

    document.title = `${this.key} ${this.scaleType.name} scale`;

    this.updateUrl();

    this.render();
  }

  getUrl(key, scale) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("key", key);
    searchParams.set("scale", scale);
    let loc = window.location;
    return `${loc.origin}${loc.pathname}?${searchParams.toString()}`;
  }

  updateUrl() {
    let url = this.getUrl(this.key, this.scaleType.name);
    if (url !== window.location.href) {
      window.location.href = url; // reload
    }
  }

  onScaleClick(event) {
    let dataset = event.currentTarget.dataset;
    if (!dataset.key && !dataset.scale) {
      return;
    }
    if (dataset.key) {
      this.key = dataset.key;
    }
    if (dataset.scale) {
      let scaleType = getScaleTypeByName(dataset.scale);
      if (scaleType) {
        this.scaleType = scaleType;
      }
    }
    this.updateUrl();
    this.render();
  }

  get scaleHtml() {
    let tones = getScaleTypeTones(this.scaleType.name);
    let letters = getScaleLetters(this.key, this.scaleType.name, 1);
    let tonality = this.scaleType.tonality;
    let tonalityIndex = tonality
      ? tones.findIndex((tone) => tone === tonality)
      : -1;
    let tonalityLetter =
      tonalityIndex > -1 ? letters[tonalityIndex] : undefined;

    return html`
      ${tonalityLetter
        ? html`<div class="" style="font-size:8pt">
            Tonality: ${tonalityLetter} major key
          </div>`
        : undefined}
      <table class="table mt-0 border border-5 fs-3">
        <tr class="fs-6">
          ${tones.map(
            (tone) => html`<th class="bg-secondary-subtle">${tone}</th>`
          )}
        </tr>
        <tr>
          ${letters.map(
            (letter) =>
              html`<td class="fw-bold" data-key="${letter}">${letter}</td>`
          )}
        </tr>
      </table>
    `;
  }

  get modesHtml() {
    if (!this.scaleType.modes?.length) {
      return undefined;
    }

    return html`<div>
      <span class="btn btn-sm">Modal<br />scales:</span>
      ${getScaleLetters(this.key, this.scaleType.name, 1).map(
        (letter, index) => {
          let modalScale = getModalScale(
            this.scaleType,
            this.scaleType.tones[index]
          );
          if (!modalScale) {
            return undefined;
          }
          let url = this.getUrl(letter, modalScale.name);

          return html` <a href="${url}" class="btn btn-sm btn-light"
            >${convertToRoman(index + 1)}.<br />
            <span class="btn btn-light-outline"
              >${letter} ${modalScale.name}</span
            ></a
          >`;
        }
      )}
    </div>`;
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
                  @click=${this.onScaleClick}
                  data-key="${key}"
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
                  @click=${this.onScaleClick}
                  data-scale="${name}"
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
          ${this.scaleType.aliases?.length
            ? html`<div class="text-center fs-4">
                (${this.scaleType.aliases.join(", ")})
              </div>`
            : undefined}
          ${this.scaleHtml} ${this.modesHtml}

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
