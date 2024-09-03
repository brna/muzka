import { html, render } from "../libs/lit-3/lit-all.min.js";
import { getScaleLetters } from "./scales-api.js";

class ScaleDisplay extends HTMLElement {
  async connectedCallback() {
    this.render();
  }

  render() {
    render(
      html`<div>
          F# minor scale: ${getScaleLetters("F#", "minor").join(", ")}
        </div>
        <div>
          Bb harmonic minor scale:
          ${getScaleLetters("Bb", "harmonic minor").join(", ")}
        </div>
        <div>F blues: ${getScaleLetters("F", "blues").join(", ")}</div> `,
      this,
      { host: this }
    );
  }
}

customElements.define("scale-display", ScaleDisplay);
