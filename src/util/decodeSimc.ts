import {
  CharacterPartial,
  CharacterProfile,
  CombatUnitSpec,
  EquippedItem,
  EquippedItemsCharacter,
} from "../proxy/api-types";
import { capitalizeFirstLetter } from "./strings";
import ilvlData from "../json/itemLevels.json";
import ilvlBonusData from "../json/itemLevelBonuses.json";

const itemLevels = ilvlData as unknown as Record<
  string,
  { itemLevel: number; name: string }
>;
const itemLevelBonuses = ilvlBonusData as unknown as Record<
  string,
  { id: number; level: number }
>;

const simcSlotNames = [
  "head",
  "neck",
  "shoulder",
  "back",
  "chest",
  "wrist",
  "hands",
  "waist",
  "legs",
  "feet",
  "finger1",
  "finger2",
  "trinket1",
  "trinket2",
  "main_hand",
  "off_hand",
];

const simcNameToApiName: Record<string, string> = {
  finger1: "FINGER_1",
  finger2: "FINGER_2",
  trinket1: "TRINKET_1",
  trinket2: "TRINKET_2",
};

// export type CharacterProfile = {
//   id: number;
//   name: string;
//   faction: {
//     type: string;
//     name: string;
//   };
//   race: {
//     name: string;
//     id: number;
//   };
//   character_class: {
//     name: string;
//     id: number;
//   };
//   active_spec: {
//     name: string;
//     id: number;
//   };
// };

// export type EquippedItem = {
//     name: string;
//     slot: {
//       type: string;
//       name: string;
//     };
//     item: {
//       id: number;
//     };
//     bonus_list: number[];
//     enchantments?: {
//       enchantment_id: number;
//     }[];
//     sockets?: {
//       item: {
//         id: number;
//       };
//     }[];
//     level: {
//       value: number;
//     };
//   };

function fixDhDk(s: string) {
  if (s === "demonhunter") {
    return "DemonHunter";
  }
  if (s === "deathknight") {
    return "DeathKnight";
  }
  return s;
}

function fixBm(s: string) {
  if (s === "beast_mastery") {
    return "BeastMastery";
  }
  if (s === "brew_master") {
    return "BrewMaster";
  }
  if (s === "brewmaster") {
    return "BrewMaster";
  }
  return s;
}

export function simcReportToItemArray(report: string): {
  profile: CharacterProfile;
  equippedCharacter: EquippedItemsCharacter;
} {
  const rval = [];
  const profile: CharacterProfile = {
    id: 0,
    name: "",
    faction: {
      type: "",
      name: "",
    },
    race: {
      name: "",
      id: 0,
    },
    character_class: {
      name: "",
      id: 0,
    },
    active_spec: {
      name: "",
      id: 0,
    },
  };
  const character: CharacterPartial = {
    id: 0,
    name: "",
    realm: {
      id: 0,
      slug: "",
    },
  };
  const lines = report.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    if (i === 4) {
      profile.character_class.name = currentLine.split("=")[0].toUpperCase();
      profile.name = currentLine.split("=")[1].replaceAll('"', "");
    }
    if (currentLine.startsWith("race=")) {
      profile.race.name = currentLine.split("=")[1];
    }
    if (currentLine.startsWith("spec=")) {
      profile.active_spec.name = currentLine.split("=")[1];
      profile.active_spec.id = parseInt(
        CombatUnitSpec[
          `${capitalizeFirstLetter(
            fixDhDk(profile.character_class.name.toLocaleLowerCase())
          )}_${capitalizeFirstLetter(
            fixBm(profile.active_spec.name)
          )}` as keyof typeof CombatUnitSpec
        ]
      );
    }
    for (let j = 0; j < simcSlotNames.length; j++) {
      const currentSlot = simcSlotNames[j];
      if (currentLine.startsWith(currentSlot)) {
        // finger2=,id=173132,enchant_id=6170,gem_id=173129,bonus_id=7461,drop_level=60,crafted_stats=40
        const attrs = currentLine.split(",");
        const attributeObject: Record<string, any> = {};
        for (let k = 1; k < attrs.length; k++) {
          const attrParts = attrs[k].split("=");
          if (attrParts[1].includes("/")) {
            attributeObject[attrParts[0]] = attrParts[1].split("/");
          } else {
            attributeObject[attrParts[0]] = attrParts[1];
          }
        }
        attributeObject.name = itemLevels[`${attributeObject.id}`]
          ? itemLevels[`${attributeObject.id}`].name
          : "Unknown Item";
        attributeObject.slot = {
          name: simcNameToApiName[currentSlot] || currentSlot.toUpperCase(),
          type: simcNameToApiName[currentSlot] || currentSlot.toUpperCase(),
        };
        attributeObject.item = {
          id: attributeObject.id,
        };
        attributeObject.level = {
          value: itemLevels[`${attributeObject.id}`]
            ? itemLevels[`${attributeObject.id}`].itemLevel
            : 0,
        };

        console.log(attributeObject);
        if (attributeObject.bonus_id) {
          if (Array.isArray(attributeObject.bonus_id)) {
            attributeObject.bonus_list = attributeObject.bonus_id.map((a) =>
              parseInt(a)
            );
          } else {
            attributeObject.bonus_list = [parseInt(attributeObject.bonus_id)];
          }
          delete attributeObject.bonus_id;
        }
        // See if item has an upgraded status and has higher ilvl
        for (let b = 0; b < attributeObject.bonus_list.length; b++) {
          const curBonus = attributeObject.bonus_list[b] as string;
          if (itemLevelBonuses[curBonus]) {
            attributeObject.level.value += itemLevelBonuses[curBonus].level;
          }
          if ("7881" === curBonus) {
            // Shim for crafted items
            attributeObject.level.value = 262;
          }
        }

        attributeObject.enchantments = [];
        if (Array.isArray(attributeObject.enchant_id)) {
          attributeObject.enchantments = attributeObject.enchant_id.map(
            (a) => ({ enchantment_id: a })
          );
        } else {
          if (attributeObject.enchant_id) {
            attributeObject.enchantments = [
              { enchantment_id: attributeObject.enchant_id },
            ];
          }
        }
        delete attributeObject.enchant_id;
        delete attributeObject.id;
        rval.push(attributeObject as unknown as EquippedItem);
      }
    }
  }
  console.log({
    profile,
    equippedCharacter: {
      character: character,
      equipped_items: rval,
    },
  });
  return {
    profile,
    equippedCharacter: {
      character: character,
      equipped_items: rval,
    },
  };
}
