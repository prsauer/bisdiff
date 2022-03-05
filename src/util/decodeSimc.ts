import {
  CharacterPartial,
  CharacterProfile,
  CombatUnitSpec,
  EquippedItem,
  EquippedItemsCharacter,
} from "../proxy/api-types";
import { capitalizeFirstLetter } from "./strings";

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
            profile.active_spec.name
          )}` as keyof typeof CombatUnitSpec
        ]
      );
    }
    console.log("Decoding", currentLine);
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
        console.log("atr", attributeObject);
        attributeObject.slot = {
          name: simcNameToApiName[currentSlot] || currentSlot.toUpperCase(),
          type: simcNameToApiName[currentSlot] || currentSlot.toUpperCase(),
        };
        attributeObject.item = {
          id: attributeObject.id,
        };
        attributeObject.level = {
          value: 0,
        };
        rval.push(attributeObject as unknown as EquippedItem);
      }
    }
  }
  console.log(character);
  return {
    profile,
    equippedCharacter: {
      character: character,
      equipped_items: rval,
    },
  };
}
