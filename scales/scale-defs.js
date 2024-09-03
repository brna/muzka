import { setConsoleContainer, isLocalhost } from "./utils.js";

if (isLocalhost()) {
  setConsoleContainer(document.getElementById("console-container"));
}

let scaleTypes = [
  {
    name: "major",
    aliases: ["ionian"],
    tones: ["1", "2", "3", "4", "5", "6", "7"],
    tonality: "1",
  },
  {
    name: "minor",
    aliases: ["aeolian"],
    tones: ["1", "2", "3b", "4", "5", "6b", "7b"],
    tonality: "3",
  },
  {
    name: "dorian",
    aliases: [],
    tones: ["1", "2", "3", "4", "5", "6", "7b"],
    tonality: "7b",
    modes: [{ name: "major", start: "2" }],
  },
  {
    name: "mixolydian",
    aliases: ["dominant"],
    tones: ["1", "2", "3", "4", "5", "6", "7b"],
    tonality: "4",
    modes: [{ name: "major", start: "5" }],
  },
  {
    name: "harmonic minor",
    aliases: [],
    tones: ["1", "2", "3b", "4", "5", "6b", "7"],
    tonality: "3b",
    modes: [{ name: "phrygian dominant", start: "4" }],
  },
  {
    name: "phrygian dominant",
    aliases: ["freygish", "dominant flat 2 flat 6"],
    tones: ["1", "2b", "3", "4", "5", "6b", "7b"],
    tonality: "3b",
    modes: [{ name: "harmonic minor", start: "5" }],
  },
  {
    name: "melodic minor",
    aliases: [],
    tones: ["1", "2", "3b", "4", "5", "6", "7"],
    tonality: "3b",
  },
  {
    name: "blues",
    aliases: ["blues minor hexatonic"],
    tones: ["1", "3b", "4", "5b", "5", "7b"],
    tonality: "7b",
  },
];

let baseToneChromaticSteps = [0, 2, 4, 5, 7, 9, 11];
let baseChromaticLetters = ["C", "D", "E", "F", "G", "A", "B"];

let chromaticLetterToStepMap = (() => {
  let keys = baseChromaticLetters;
  let steps = baseToneChromaticSteps;
  let map = new Map();
  for (let i = 0; i < 7; i++) {
    map.set(keys[i], steps[i]);
  }
  for (let i = 0; i < 7; i++) {
    map.set(`${keys[i]}b`, (steps[i] + 11) % 12);
  }
  for (let i = 0; i < 7; i++) {
    map.set(`${keys[i]}#`, (steps[i] + 1) % 12);
  }
  return map;
})();

function isFlat(str) {
  return str.includes("b");
}

function isSharp(str) {
  return str.includes("#");
}

function isNatural(str) {
  return !isFlat(str) && !isSharp(str);
}

function countFlat(str) {
  return str.split("b").length - 1;
}

function countSharp(str) {
  return str.split("#").length - 1;
}

export function getLetterByStep(step, sharp = undefined) {
  step %= 12;
  while (step < 0) {
    step += 12;
  }
  let values = Array.from(chromaticLetterToStepMap)
    .filter(([key, value]) => value === step)
    .map((entry) => entry[0]);
  if (!values?.length) {
    console.warn(`getLetterByStep: failed to find any letter for step=${step}`);
    return undefined;
  }
  let naturalValue = values.find((value) => isNatural(value));
  if (naturalValue) {
    return naturalValue;
  }
  if (sharp) {
    let sharpValue = values.find((value) => isSharp(value));
    if (sharpValue) {
      return sharpValue;
    }
  }
  return values[0];
}

export function getScaleTypeNames() {
  return scaleTypes.map((type) => type.name);
}

export function getScaleTypeByName(name = "major") {
  return scaleTypes.find((type) => type.name === name);
}

function getChromaticDiff(tone = "1") {
  let diff = 0;
  for (let char of tone) {
    switch (char) {
      case "b":
      case "♭":
        diff -= 1;
        break;
      case "#":
      case "♯":
        diff += 1;
        break;
      case "x":
      case "𝄪":
        diff += 2;
        break;
      case "𝄫":
        diff -= 2;
        break;
    }
  }
  return diff;
}

export function getChromaticStepByTone(tone = "1") {
  let toneNumber = parseInt(tone.replace(/\D/g, ""));
  if (isNaN(toneNumber)) {
    return undefined;
  }

  let numberOfOctaves = Math.floor(toneNumber / 7);
  let baseIndex = (toneNumber + 11) % 7;
  let baseStep = baseToneChromaticSteps[baseIndex];

  if (baseStep === undefined) {
    console.log(
      `getChromaticStepByTone: baseStep for tone=${tone} not found for baseIndex=${baseIndex}`
    );
    return undefined;
  }

  let diff = getChromaticDiff(tone);

  return numberOfOctaves * 12 + baseStep + diff;
}

export function getToneLetterOld(key = "C", tone = "1") {
  let toneIndex = parseInt(tone.replace(/\D/g, "")) - 1;
  if (isNaN(toneIndex)) {
    console.log(
      `getToneLetterOld: toneIndex for key=${key} and tone=${tone} not found`
    );
    return undefined;
  }

  let keyMatch = key.match(/[A-G]/);
  let keyLetter = keyMatch ? keyMatch[0] : null;
  if (!keyLetter) {
    console.log(
      `getToneLetterOld: keyLetter for key=${key} and tone=${tone} not found`
    );
    return undefined;
  }

  let keyIndex = baseChromaticLetters.indexOf(keyLetter);
  if (keyIndex === -1) {
    console.log(
      `getToneLetterOld: keyIndex for key=${key} and tone=${tone} not found`
    );
    return undefined;
  }

  let letterIndex = (keyIndex + toneIndex) % 7;
  let baseLetter = baseChromaticLetters[letterIndex];
  if (!baseLetter) {
    console.log(
      `getToneLetterOld: baseLetter for key=${key} and tone=${tone} not found`
    );
    return undefined;
  }

  let diff = getChromaticDiff(tone) + getChromaticDiff(key);

  if (!diff) {
    return baseLetter;
  }

  return baseLetter + (diff > 0 ? "#" : "b").repeat(Math.abs(diff));
}

export function getToneLetterNew(key = "C", tone = "1") {
  let toneIndex = parseInt(tone.replace(/\D/g, "")) - 1;
  if (isNaN(toneIndex)) {
    console.log(
      `getToneLetterNew: toneIndex for key=${key} and tone=${tone} not found`
    );
    return undefined;
  }

  let keyStep = chromaticLetterToStepMap.get(key);
  if (!keyStep) {
    console.log(
      `getToneLetterNew: keyStep for key=${key} and tone=${tone} not found`
    );
    return undefined;
  }

  let toneStep = getChromaticStepByTone(tone);

  let step = (keyStep + toneStep + 12) % 12;

  return getLetterByStep(step);
}

function getScaleLetters(key = "C", type = "major") {
  let scale = getScaleTypeByName(type);
  if (!scale) {
    return undefined;
  }
  return scale.tones.map((tone) => getToneLetterNew(key, tone));
}

console.log(`getScaleLetters("F", "major"): ${getScaleLetters("F", "major")}`);

console.log(`getScaleLetters("G", "major"): ${getScaleLetters("G", "major")}`);

console.log(`getScaleLetters("F", "minor"): ${getScaleLetters("F", "minor")}`);

console.log(
  `getScaleLetters("F#", "minor"): ${getScaleLetters("F#", "minor")}`
);
