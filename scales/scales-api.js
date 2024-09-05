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
    tones: ["1", "2", "b3", "4", "5", "b6", "b7"],
    tonality: "3",
  },
  {
    name: "dorian",
    aliases: [],
    tones: ["1", "2", "3", "4", "5", "6", "b7"],
    tonality: "b7",
    modes: [{ name: "major", start: "2" }],
  },
  {
    name: "mixolydian",
    aliases: ["dominant"],
    tones: ["1", "2", "3", "4", "5", "6", "b7"],
    tonality: "4",
    modes: [{ name: "major", start: "5" }],
  },
  {
    name: "harmonic minor",
    aliases: [],
    tones: ["1", "2", "b3", "4", "5", "b6", "7"],
    tonality: "b3",
    modes: [{ name: "phrygian dominant", start: "4" }],
  },
  {
    name: "phrygian dominant",
    aliases: ["freygish", "dominant flat 2 flat 6"],
    tones: ["1", "b2", "3", "4", "5", "b6", "b7"],
    tonality: "b3",
    modes: [{ name: "harmonic minor", start: "5" }],
  },
  {
    name: "melodic minor",
    aliases: [],
    tones: ["1", "2", "b3", "4", "5", "6", "7"],
    tonality: "b3",
  },
  {
    name: "blues",
    aliases: ["blues minor hexatonic"],
    tones: ["1", "b3", "4", "b5", "5", "b7"],
    tonality: "b7",
  },
];

let baseToneChromaticSteps = [0, 2, 4, 5, 7, 9, 11];
let baseChromaticLetters = ["C", "D", "E", "F", "G", "A", "B"];
let chromaticLetters = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

export function getChromaticLetters() {
  return chromaticLetters;
}

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

export function isFlat(str) {
  return str.includes("b");
}

export function isSharp(str) {
  return str.includes("#");
}

export function isNatural(str) {
  return !isFlat(str) && !isSharp(str);
}

function countFlat(str) {
  return str.split("b").length - 1;
}

function countSharp(str) {
  return str.split("#").length - 1;
}

function diffAccidentals(str) {
  return countSharp(str) - countFlat(str);
}

function getLetterByStep(step, sharp = undefined) {
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

function getScalesCount() {
  return scaleTypes.length;
}

export function getScaleTypeNames() {
  return scaleTypes.map((type) => type.name);
}

export function getScaleTypeByName(name = "major") {
  let scaleType = scaleTypes.find((type) => type.name === name);
  if (scaleType === undefined) {
    console.warn(`scale-api.js getScaleTypeByName: {name} not found`);
  }
  return scaleType;
}

function getToneStep(tone = "1") {
  let toneNumber = parseInt(tone.replace(/\D/g, ""));
  if (isNaN(toneNumber)) {
    return undefined;
  }

  let numberOfOctaves = Math.floor(toneNumber / 7);
  let baseIndex = (toneNumber + 11) % 12;
  let baseStep = baseToneChromaticSteps[baseIndex];

  if (baseStep === undefined) {
    console.warn(
      `getToneStep: baseStep for tone=${tone} not found for baseIndex=${baseIndex}`
    );
    return undefined;
  }

  let diff = diffAccidentals(tone);

  return numberOfOctaves * 12 + baseStep + diff;
}

function getToneLetter(key = "C", tone = "1", sharp) {
  if (sharp === undefined) {
    if (isSharp(key)) {
      sharp = true;
    } else if (isFlat(key)) {
      sharp = false;
    }
  }
  let keyStep = chromaticLetterToStepMap.get(key);
  if (keyStep === undefined) {
    console.warn(
      `getToneLetter: keyStep for key=${key} and tone=${tone} not found`
    );
    return undefined;
  }

  let toneStep = getToneStep(tone);
  let step = (keyStep + toneStep + 12) % 12;

  return getLetterByStep(step, sharp);
}

export function getScaleLetters(key = "C", type = "major") {
  let scale = getScaleTypeByName(type);
  if (!scale) {
    console.warn(`getScaleLetters: scale type=${type} not found`);
    return undefined;
  }
  return scale.tones.map((tone) => getToneLetter(key, tone));
}
