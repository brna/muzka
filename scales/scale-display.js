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

    this.harmony = searchParams.get("harmony");

    let scale = searchParams.get("scale");
    if (scale && this.scaleTypeNames.includes(scale)) {
      this.scaleType = getScaleTypeByName(scale);
    }
    this.scaleType ??= getScaleTypeByName("major");

    document.title = `${this.key} ${this.scaleType.name} scale`;

    this.updateUrl();

    this.render();

    this.initHarmony();
  }

  getUrl(key, scale) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("key", key);
    searchParams.set("scale", scale);
    if (this.harmony) {
      searchParams.set("harmony", this.harmony);
    } else {
      searchParams.delete("harmony");
    }
    let loc = window.location;
    return `${loc.origin}${loc.pathname}?${searchParams.toString()}`;
  }

  updateUrl() {
    let url = this.getUrl(this.key, this.scaleType.name);
    if (url !== window.location.href) {
      // window.location.href = url; // reload
      window.history.pushState(null, "", url);
    }
  }

  onScaleClick(event) {
    console.log(
      `scale-display.js: onScaleClick: dataset=`,
      event.currentTarget.dataset
    );
    event.preventDefault();

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

  get allKeysHtml() {
    return html`<div class="ps-2 pe-2">
      <div
        class="row p-2 bg-secondary"
        style="padding-top:1px;padding-bottom:1px"
      >
        ${this.keys.map(
          (key) =>
            html`<a
              title="Change key to ${key} ..."
              @click=${this.onScaleClick}
              data-key="${key}"
              data-scale="${this.scaleType.name}"
              href="${this.getUrl(key, this.scaleType.name)}"
              class="col btn btn-sm w-100 ${key === this.key
                ? "btn-primary"
                : isNatural(key)
                ? "btn-light"
                : "btn-dark"}"
              style="margin-left:0.5px;margin-right:0.5px"
            >
              ${key}
            </a>`
        )}
      </div>
    </div> `;
  }

  get allScalesHtml() {
    return html`<div class="row p-2 pt-1 pb-1 bg-warning">
      ${this.scaleTypeNames.map(
        (name) =>
          html`<a
            title="Change scale to ${name} ..."
            @click=${this.onScaleClick}
            data-key="${this.key}"
            data-scale="${name}"
            href="${this.getUrl(this.key, name)}"
            class="col btn btn-sm ms-1 ${name === this.scaleType.name
              ? "btn-danger"
              : "bg-warning-subtle"}"
            style="margin-top:1px; margin-bottom:1px"
          >
            <span class="fs-6">${name}</span>
          </a>`
      )}
    </div>`;
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
        ? html`<div class="" style="font-size:10pt">
            Tonality: ${tonalityLetter} major key
          </div>`
        : undefined}
      <table class="table mt-0 border border-5 fs-3">
        <tr class="fs-6 text-center">
          ${tones.map(
            (tone) => html`<th class="bg-secondary-subtle">${tone}</th>`
          )}
        </tr>
        <tr>
          ${letters.map((letter) => {
            return html`<td class="text-center">
              <a
                title="Change scale to ${letter} ${this.scaleType.name} ..."
                @click=${this.onScaleClick}
                data-key="${letter}"
                data-scale="${this.scaleType.name}"
                href="${this.getUrl(letter, this.scaleType.name)}"
                class="btn btn-lg fw-bold w-100 border"
                >${letter}</a
              >
            </td>`;
          })}
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
          return html` <a
            title="Change scale to ${letter} ${modalScale.name} ..."
            @click=${this.onScaleClick}
            data-key="${letter}"
            data-scale="${modalScale.name}"
            href="this.getUrl(letter, modalScale.name)"
            class="btn btn-sm btn-light border"
            >${convertToRoman(index + 1)}.<br />
            <span class="btn btn-light-outline"
              >${letter} ${modalScale.name}</span
            ></a
          >`;
        }
      )}
    </div>`;
  }

  getChordsHtml(shifts) {
    let chords = getScaleChords(this.key, this.scaleType.name, shifts);
    let baseIndex = shifts.toReversed().findIndex((shift) => shift === 0);
    return html`<table class="table mt-2 border border-5 fs-3">
      <tr>
        ${chords.map(
          (chord) =>
            html`<td>
              ${chord
                .toReversed()
                .map(
                  (letter, index) =>
                    html`<div
                      class="${index === baseIndex ? "fw-bold" : undefined}"
                    >
                      ${letter}
                    </div>`
                )}
            </td>`
        )}
      </tr>
    </table>`;
  }

  getHarmonyAccordionItem(id, title, body) {
    let expanded = this.harmony === id;
    return html`<div
      class="accordion-item"
      id="harmony-accordion-item-${id}"
      data-id="${id}"
    >
      <h2 class="accordion-header">
        <button
          class="accordion-button ${!expanded ? "collapsed" : undefined}"
          id="harmony-accordion-button-${id}"
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
        @click=${(event) => {
          console.log("clicked " + id);
          this.harmony = event.currentTarget.id;
          this.updateUrl();
        }}
        class="accordion-collapse collapse ${expanded ? "show" : undefined}"
        data-bs-parent="#harmonyAccordion"
      >
        <div class="accordion-body">
          ${body}<span id="harmony-accordion-end-${id}" />
        </div>
      </div>
    </div>`;
  }

  getHarmonyIds() {
    let container = this.querySelector("#harmonyAccordion");
    if (!container) {
      return undefined;
    }
    return [...container.querySelectorAll(".accordion-item")].map(
      (el) => el.dataset.id
    );
  }

  initHarmony() {
    let harmonyIds = this.getHarmonyIds();
    if (this.harmony && !harmonyIds.includes(this.harmony)) {
      this.harmony = undefined;
    }
    this.updateUrl();
    this.render();

    let focus = (id) => {
      this.querySelector(`#harmony-accordion-end-${id}`)?.scrollIntoView({
        behavior: "smooth",
      });
    };

    if (this.harmony) {
      focus(this.harmony);
    }

    for (let id of harmonyIds) {
      let el = this.querySelector(`#${id}`);
      el.addEventListener("shown.bs.collapse", () => {
        this.harmony = id;
        this.updateUrl();
        focus(this.harmony);
      });
      el.addEventListener("hidden.bs.collapse", () => {
        this.harmony = undefined;
        this.updateUrl();
      });
    }
  }

  get harmonyAccordionHtml() {
    return html` <div class="accordion mt-2" id="harmonyAccordion">
      ${this.getHarmonyAccordionItem(
        "h02",
        "Thirds",
        this.getChordsHtml([0, 2])
      )}
      ${this.getHarmonyAccordionItem(
        "h20",
        "Sixths",
        this.getChordsHtml([2, 0])
      )}
      ${this.getHarmonyAccordionItem(
        "h024",
        "Triads",
        this.getChordsHtml([0, 2, 4])
      )}
      ${this.getHarmonyAccordionItem(
        "h240",
        " Triads starting from the third",
        this.getChordsHtml([2, 4, 0])
      )}
      ${this.getHarmonyAccordionItem(
        "h402",
        "Triads starting from the fifth",
        this.getChordsHtml([4, 0, 2])
      )}
      ${this.getHarmonyAccordionItem(
        "h0246",
        "Tetrads",
        this.getChordsHtml([0, 2, 4, 6])
      )}
      ${this.getHarmonyAccordionItem(
        "h01245",
        "Pentatonics 6/9",
        this.getChordsHtml([0, 1, 2, 4, 5])
      )}
      ${this.getHarmonyAccordionItem(
        "h01246",
        "Pentatonics 7/9",
        this.getChordsHtml([0, 1, 2, 4, 6])
      )}
    </div>`;
  }

  render() {
    render(
      html`
        ${this.allKeysHtml} ${this.allScalesHtml}
        
          <h1 class="mt-2 text-center fw-bold">
            ${this.key} ${this.scaleType.name}
          </h1>
          ${
            this.scaleType.aliases?.length
              ? html`<div class="text-center fs-4">
                  (${this.scaleType.aliases.join(", ")})
                </div>`
              : undefined
          }
          ${this.scaleHtml} ${this.modesHtml}
${this.harmonyAccordionHtml}
         
        </div>
      `,
      this,
      { host: this }
    );
  }
}

customElements.define("scale-display", ScaleDisplay);
