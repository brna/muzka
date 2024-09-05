import { html, render } from "../libs/lit-3/lit-all.min.js";
import { getChromaticLetters, getScaleLetters } from "./scales-api.js";

class ScaleDisplay extends HTMLElement {
  async connectedCallback() {
    this.keys = getChromaticLetters();

    this.key = "C";
    this.scale = "major";

    this.render();
  }

  onKeyClick(event) {
    this.key = event.currentTarget.value;
    this.render();
  }

  render() {
    render(
      html`
        <div class="row">
          ${this.keys.map(
            (key) =>
              html`<div class="col"><button @click=${
                this.onKeyClick
              } value="${key}" type="button" class="btn btn-lg ${
                key === this.key ? "btn-dark" : "btn-outline-dark"
              }">${key}</div>`
          )}
          <div>
            ${this.key} minor scale:
            ${getScaleLetters(this.key, "minor").join(", ")}
          </div>
          <div>
            Bb harmonic minor scale:
            ${getScaleLetters("Bb", "harmonic minor").join(", ")}
          </div>
          <div>F blues: ${getScaleLetters("F", "blues").join(", ")}</div>
        </div>
      `,
      this,
      { host: this }
    );
  }
}

customElements.define("scale-display", ScaleDisplay);
