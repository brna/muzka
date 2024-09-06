let scaleTypes = [
  {
    name: "major",
    aliases: ["ionian"],
    tones: ["1", "2", "3", "4", "5", "6", "7"],
    tonality: "1",
    modes: [
      { name: "dorian", start: "2" },
      { name: "phrygian", start: "3" },
      { name: "lydian", start: "4" },
      { name: "mixolydian", start: "5" },
      { name: "minor", start: "6" },
      { name: "locrian", start: "7" },
    ],
  },
  {
    name: "minor",
    aliases: ["aeolian"],
    tones: ["1", "2", "b3", "4", "5", "b6", "b7"],
    tonality: "3",
    modes: [
      { name: "locrian", start: "2" },
      { name: "major", start: "b3" },
      { name: "dorian", start: "4" },
      { name: "phrygian", start: "5" },
      { name: "lydian", start: "b6" },
      { name: "mixolydian", start: "b7" },
    ],
  },
  {
    name: "dorian",
    aliases: [],
    tones: ["1", "2", "b3", "4", "5", "6", "b7"],
    tonality: "b7",
    modes: [
      { name: "phrygian", start: "2" },
      { name: "lydian", start: "b3" },
      { name: "mixolydian", start: "4" },
      { name: "minor", start: "5" },
      { name: "locrian", start: "6" },
      { name: "major", start: "b7" },
    ],
  },
  {
    name: "mixolydian",
    aliases: ["dominant"],
    tones: ["1", "2", "3", "4", "5", "6", "b7"],
    tonality: "4",
    modes: [
      { name: "minor", start: "2" },
      { name: "locrian", start: "3" },
      { name: "major", start: "4" },
      { name: "dorian", start: "5" },
      { name: "phrygian", start: "6" },
      { name: "lydian", start: "b7" },
    ],
  },
  {
    name: "harmonic minor",
    aliases: [],
    tones: ["1", "2", "b3", "4", "5", "b6", "7"],
    tonality: "b3",
    modes: [
      { name: "romanian minor", start: "2" },
      { name: "phrygian dominant", start: "5" },
    ],
  },
  {
    name: "romanian minor",
    aliases: ["dorian #4"],
    tones: ["1", "2", "b3", "#4", "5", "6", "b7"],
    tonality: "b7",
    modes: [
      { name: "phrygian dominant", start: "#4" },
      { name: "harmonic minor", start: "b7" },
    ],
  },
  {
    name: "phrygian dominant",
    aliases: ["freygish"],
    tones: ["1", "b2", "3", "4", "5", "b6", "b7"],
    tonality: "b3",
    modes: [
      { name: "harmonic minor", start: "4" },
      { name: "romanian minor", start: "5" },
    ],
  },
  {
    name: "jazz minor",
    aliases: ["melodic minor ascending"],
    tones: ["1", "2", "b3", "4", "5", "6", "7"],
    tonality: "b3",
  },
  {
    name: "double harmonic major",
    aliases: ["byzantine", "arabic", "gipsy major"],
    tones: ["1", "b2", "3", "4", "5", "b6", "7"],
    modes: [
      { name: "double harmonic minor", start: "4" },
      { name: "oriental", start: "5" },
    ],
    tonality: "1",
  },
  {
    name: "double harmonic minor",
    aliases: ["hungarian minor", "gipsy minor"],
    tones: ["1", "2", "b3", "#4", "5", "b6", "7"],
    modes: [
      { name: "oriental", start: "2" },
      { name: "double harmonic major", start: "5" },
    ],
    tonality: "5",
  },
  {
    name: "oriental",
    tones: ["1", "b2", "b3", "4", "b5", "6", "b7"],
    modes: [
      { name: "double harmonic major", start: "4" },
      { name: "double harmonic minor", start: "b7" },
    ],
    tonality: "7",
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

export function getModalScale(scaleType, tone) {
  let modes = scaleType?.modes;
  if (!modes.length) {
    return undefined;
  }
  let mode = modes.find((entry) => (entry.start = tone));
  if (!mode) {
    return;
  }
  let modalScale = getScaleTypeByName(mode.name);
  if (!modalScale) {
    console.warn(
      `scale-api.js getModalScale: modal scale {mode.name} not found. Base scale: ${scaleType.name}`
    );
  }
  return modalScale;
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

export function getScaleTypeTones(name = "major", more = 1) {
  let values = [...getScaleTypeByName(name).tones];
  if (more > 0) {
    for (let i = 0; i < more; i++) {
      values.push(values[i]);
    }
  }
  return values;
}

export function getScaleLetters(key = "C", type = "major", more = 1) {
  let scale = getScaleTypeByName(type);
  if (!scale) {
    console.warn(`getScaleLetters: scale type=${type} not found`);
    return undefined;
  }
  let values = scale.tones.map((tone) => getToneLetter(key, tone));
  if (more > 0) {
    for (let i = 0; i < more; i++) {
      values.push(values[i]);
    }
  }
  return values;
}

export function getScaleLetterPairs(
  key = "C",
  type = "major",
  shift = 2,
  more = 1
) {
  let baseValues = getScaleLetters(key, type, 0);
  let n = baseValues.length;
  let pairValues = [];
  for (let i = 0; i < n; i++) {
    let index = i + shift;
    while (index < 0) {
      index += n;
    }
    index %= n;

    let value = baseValues[index];

    pairValues.push(value);
  }
  if (more > 0) {
    for (let i = 0; i < more; i++) {
      pairValues.push(pairValues[i]);
    }
  }

  return pairValues;
}

function transpose(table) {
  return table[0].map((_, colIndex) => table.map((row) => row[colIndex]));
}

export function getScaleChords(
  key = "C",
  type = "major",
  shifts = [0, 2, 4],
  more = 1
) {
  let table = [];
  for (let shift of shifts) {
    let pairs = getScaleLetterPairs(key, type, shift, more);
    table.push(pairs);
  }

  return transpose(table);
}
