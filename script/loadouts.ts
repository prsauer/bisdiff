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
  id: number;
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
  stam: number;
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
  // Apparatus: "SHOULDER","FINGER"
  // Xanshi: "BACK","LEGS"
  // Sephuz: "SHOULDER","CHEST","NECK"
  const limitedLegendarySlots: SlotName[] = ["SHOULDER", "CHEST", "NECK"];

  let valid = true;

  // Only one of each slot
  one_of_each.forEach((a) => {
    if (loadout.items.filter((i) => i.slot === a).length !== 1) {
      valid = false;
    }
  });
  // except for rings, which require 2
  two_of_each.forEach((a) => {
    if (loadout.items.filter((i) => i.slot === a).length !== 2) {
      valid = false;
    }
  });

  // Must have 4 piece set
  if (loadout.items.filter((i) => i.name === "SetPiece").length !== 4) {
    valid = false;
  }

  // Must have 2 legendaries equipped
  if (loadout.items.filter((i) => i.name === "Leggo").length !== 2) {
    valid = false;
  }

  // At least 1 lego is equipped in the limited slot (ie: not unity)
  if (
    loadout.items.filter(
      (i) => limitedLegendarySlots.includes(i.slot) && i.name === "Leggo"
    ).length === 0
  ) {
    valid = false;
  }

  // Max 1 crafted item
  if (loadout.items.filter((i) => i.name.startsWith("Crafted")).length > 1) {
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
    stam: sumField(loadout.items, "stam"),
    versa: sumField(loadout.items, "versa"),
    haste: sumField(loadout.items, "haste"),
    mastery: sumField(loadout.items, "mastery"),
    crit: sumField(loadout.items, "crit"),
  };
}

const itemLibrary: Item[] = [];
let globalItemIdCounter = 0;

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
    id: ++globalItemIdCounter,
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
const craftedVersaHRing = mkItem("Crafted-So", "FINGER", 0, 130, 195, 78, 0, 0);
const craftedHasteVRing = mkItem("Crafted-Ox", "FINGER", 0, 130, 78, 195, 0, 0);

const craftedVersaHNeck = mkItem("Crafted-So", "NECK", 0, 130, 195, 78, 0, 0);
const craftedHasteVNeck = mkItem("Crafted-Ox", "NECK", 0, 130, 78, 195, 0, 0);
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

const legendaryChoices = itemLibrary.filter((a) => a.name === "Leggo");
const setPieceChoices = itemLibrary.filter((a) => a.name === "SetPiece");
const normalChoices = itemLibrary.filter(
  (a) => !["Leggo", "SetPiece"].includes(a.name)
);

const legIter = new Combinatorics.Combination(legendaryChoices, 2);
console.log(`${legendaryChoices.length} choose 2 => ${legIter.length}`);

const setIter = new Combinatorics.Combination(setPieceChoices, 4);
console.log(`${setPieceChoices.length} choose 4 => ${setIter.length}`);

const normalIter = new Combinatorics.Combination(normalChoices, 6);
console.log(`${normalChoices.length} choose 6 => ${normalIter.length}`);

const totalCombinations =
  (legIter.length as number) *
  (setIter.length as number) *
  (normalIter.length as number);

console.log(`${itemLibrary.length} items in library`);
console.log(`${totalCombinations} possible iterations`);

const validSolns: LoadoutTotal[] = [];

let counter = 0;

for (let iLeg = 0; iLeg < legIter.length; iLeg++) {
  for (let iSet = 0; iSet < setIter.length; iSet++) {
    for (let iNorm = 0; iNorm < normalIter.length; iNorm++) {
      counter++;
      const curLoadout = [
        ...(legIter.nth(iLeg) as Item[]),
        ...(setIter.nth(iSet) as Item[]),
        ...(normalIter.nth(iNorm) as Item[]),
      ];
      if (!verifyLoadout({ name: "", items: curLoadout })) {
        continue;
      }
      validSolns.push(
        computeTotal({
          name: `iter-${counter}`,
          items: curLoadout,
        })
      );
    }
  }
}

console.log(`${validSolns.length} valid solutions`);

function printLoadout(totals: LoadoutTotal | undefined) {
  if (!totals) {
    console.log("null build");
    return;
  }
  let craftedItem = totals.loadout.items.find((a) =>
    a.name.startsWith("Crafted")
  );
  const craftedString = craftedItem
    ? `crafted=${craftedItem.slot}-${craftedItem.name}`
    : "";

  console.log(
    `${totals.loadout.name} Lego:${totals.loadout.items
      .filter((i) => i.name === "Leggo")
      .map((a) => `${a.slot}`)} Set:${totals.loadout.items
      .filter((i) => i.name === "SetPiece")
      .map((a) => `${a.slot}`)} Rings:${totals.loadout.items
      .filter((i) => i.slot === "FINGER")
      .map((a) => `${a.name}`)} versa=${totals.versa} haste=${
      totals.haste
    } ${craftedString} int=${totals.primary} stam=${totals.stam} mast=${
      totals.mastery
    } crit=${totals.crit}`
  );
}

console.log("Sorted by Haste:");
printLoadout(validSolns[0]);
printLoadout(validSolns[1]);
printLoadout(validSolns[2]);

console.log("Sorted by Haste, min versa 1104");
const filtByVersa = validSolns.filter((a) => a.versa > 1104);
printLoadout(filtByVersa[0]);
printLoadout(filtByVersa[1]);
printLoadout(filtByVersa[2]);

// Print Item library
const libraryReport = itemLibrary.map((i) => {
  const firstIndex = validSolns.findIndex((a) => {
    return (
      a.loadout.items.findIndex((l) => {
        return l.id === i.id;
      }) > -1
    );
  });
  return `${i.id} ${i.name} ${i.slot} ${i.haste} ${firstIndex}`;
});
fs.writeFileSync(
  join(process.cwd(), "itemsReport.json"),
  libraryReport.join("\r\n")
);

export {};
