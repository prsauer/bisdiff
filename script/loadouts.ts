import fs from "fs";
import { join } from "path";
import * as Combinatorics from "js-combinatorics";

type SlotName =
  | "HEAD"
  | "NECK"
  | "SHOULDER"
  | "BACK"
  | "CHEST"
  | "WRIST"
  | "HANDS"
  | "WAIST"
  | "LEGS"
  | "FEET"
  | "FINGER";

type Item = {
  name: string;
  slot: SlotName;
  primary: number;
  stam: number;
  versa: number;
  haste: number;
  mastery: number;
  crit: number;
};

type Loadout = {
  name: string;
  items: Item[];
};

type LoadoutTotal = {
  loadout: Loadout;
  primary: number;
  versa: number;
  haste: number;
  mastery: number;
  crit: number;
};

const one_of_each = [
  "HEAD",
  "NECK",
  "SHOULDER",
  "BACK",
  "CHEST",
  "WRIST",
  "HANDS",
  "WAIST",
  "LEGS",
  "FEET",
];
const two_of_each = ["FINGER"];

function verifyLoadout(loadout: Loadout): boolean {
  let valid = true;

  one_of_each.forEach((a) => {
    if (loadout.items.filter((i) => i.slot === a).length !== 1) {
      valid = false;
    }
  });
  two_of_each.forEach((a) => {
    if (loadout.items.filter((i) => i.slot === a).length !== 2) {
      valid = false;
    }
  });

  if (loadout.items.filter((i) => i.name === "SetPiece").length !== 4) {
    valid = false;
  }

  if (loadout.items.filter((i) => i.name === "Leggo").length !== 2) {
    valid = false;
  }
  return valid;
}

function sumField(ary: any[], field: string) {
  return ary.reduce((prev, cur, curIdx, ary) => prev + cur[field], 0);
}

function computeTotal(loadout: Loadout): LoadoutTotal {
  return {
    loadout,
    primary: sumField(loadout.items, "primary"),
    versa: sumField(loadout.items, "versa"),
    haste: sumField(loadout.items, "haste"),
    mastery: sumField(loadout.items, "mastery"),
    crit: sumField(loadout.items, "crit"),
  };
}

const itemLibrary: Item[] = [];

function mkItem(
  name: string,
  slot: SlotName,
  primary: number,
  stam: number,
  versa: number,
  haste: number,
  mastery: number,
  crit: number
): Item {
  const item = {
    name,
    slot,
    stam,
    primary,
    versa,
    haste,
    mastery,
    crit,
  };
  itemLibrary.push(item);
  return item;
}

const cosmicHead = mkItem("Cosmic", "HEAD", 128, 269, 118, 59, 0, 0);
const cosmicWrist = mkItem("Cosmic", "WRIST", 72, 151, 63, 36, 0, 0);
const cosmicNeck = mkItem("Cosmic", "NECK", 0, 151, 227, 67, 0, 0);
const cosmicMantle = mkItem("Cosmic", "SHOULDER", 96, 202, 87, 46, 0, 0);
const cosmicCloak = mkItem("Cosmic", "BACK", 72, 151, 32, 68, 0, 0);
const cosmicChest = mkItem("Cosmic", "CHEST", 128, 269, 124, 53, 0, 0);
const cosmicHands = mkItem("Cosmic", "HANDS", 96, 202, 90, 43, 0, 0);
const cosmicBelt = mkItem("Cosmic", "WAIST", 96, 202, 87, 46, 0, 0);
const cosmicLegs = mkItem("Cosmic", "LEGS", 128, 269, 118, 59, 0, 0);
const cosmicFeet = mkItem("Cosmic", "FEET", 96, 202, 93, 0, 40, 0);
const cosmicHasteRing = mkItem("CosmicRing", "FINGER", 0, 151, 202, 93, 0, 0);
const cosmicMastRing = mkItem("CosmicSig", "FINGER", 0, 151, 202, 0, 93, 0);
//
const setHead = mkItem("SetPiece", "HEAD", 128, 269, 0, 101, 76, 0);
const setChest = mkItem("SetPiece", "CHEST", 128, 269, 0, 54, 0, 123);
const setLegs = mkItem("SetPiece", "LEGS", 128, 269, 0, 0, 115, 62);
const setHands = mkItem("SetPiece", "HANDS", 96, 202, 94, 39, 0, 0);
const setShoulder = mkItem("SetPiece", "SHOULDER", 96, 202, 45, 0, 87, 0);
//

const leggoHasteHelm = mkItem("Leggo", "HEAD", 149, 325, 94, 94, 0, 0);
const leggoWrist = mkItem("Leggo", "WRIST", 84, 183, 53, 53, 0, 0);
const leggoNeck = mkItem("Leggo", "NECK", 0, 183, 160, 160, 0, 0);
const legoShoulder = mkItem("Leggo", "SHOULDER", 112, 244, 71, 71, 0, 0);
const legoCloak = mkItem("Leggo", "BACK", 84, 183, 53, 53, 0, 0);
const legoChest = mkItem("Leggo", "CHEST", 149, 325, 94, 94, 0, 0);
const legoBelt = mkItem("Leggo", "WAIST", 112, 244, 71, 71, 0, 0);
// legoHands
const legoFeet = mkItem("Leggo", "FEET", 112, 244, 71, 71, 0, 0);
const legoLegs = mkItem("Leggo", "LEGS", 149, 325, 94, 94, 0, 0);
const legoFinger = mkItem("Leggo", "FINGER", 0, 183, 160, 160, 0, 0);

//
const craftedVersaHRing = mkItem("Crafted", "FINGER", 0, 130, 195, 78, 0, 0);
//

const loadouts: Loadout[] = [
  {
    items: [
      cosmicWrist,
      cosmicBelt,
      setShoulder,
      cosmicLegs,
      setHead,
      setHands,
      legoFeet,
      setChest,
      cosmicCloak,
      cosmicNeck,
      cosmicHasteRing,
      legoFinger,
    ],
    name: "Col.N-LegoRing-LegoFeet",
  },
  {
    items: [
      cosmicWrist,
      cosmicBelt,
      setShoulder,
      legoLegs,
      setHead,
      setHands,
      cosmicFeet,
      setChest,
      cosmicCloak,
      cosmicNeck,
      cosmicHasteRing,
      legoFinger,
    ],
    name: "Exp LegoLegs-LegoFinger",
  },
];

loadouts.forEach((l) => {
  verifyLoadout(l);
  console.log("Totals:");
  console.log(computeTotal(l));
});

let it = new Combinatorics.Combination(itemLibrary, 12);
console.log(`${itemLibrary.length} items in library`);
console.log(`${it.length} possible iterations`);

const progressDivider = (it.length as number) / 10;

const validSolns: LoadoutTotal[] = [];

for (let i = 0; i < it.length; i++) {
  if (i % progressDivider === 0) {
    console.log(Math.floor(i / progressDivider));
  }

  const curLoadout = it.nth(i) as Item[];

  if (!verifyLoadout({ name: "", items: curLoadout })) {
    continue;
  }

  validSolns.push(
    computeTotal({
      name: `iter-${i}`,
      items: curLoadout,
    })
  );
}

console.log(`${validSolns.length} valid solutions`);

validSolns.sort((a, b) => b.haste - a.haste);
fs.writeFileSync(
  join(process.cwd(), "validSolnsByHaste.json"),
  JSON.stringify(validSolns, null, 2)
);

validSolns.sort((a, b) => b.versa - a.versa);
fs.writeFileSync(
  join(process.cwd(), "validSolnsByVersa.json"),
  JSON.stringify(validSolns, null, 2)
);

validSolns.sort((a, b) => b.haste + b.versa - (a.haste + a.versa));
fs.writeFileSync(
  join(process.cwd(), "validSolnsByHasteVersaTotal.json"),
  JSON.stringify(validSolns, null, 2)
);

export {};
