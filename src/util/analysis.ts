import { CharacterProfile, EquippedItemsCharacter } from "../proxy/api-types";

const SlotsRequiringEnchants = [
  "LEGS",
  "FINGER_1",
  "FINGER_2",
  "CHEST",
  "BACK",
  "MAIN_HAND",
];

const agiSpecs = [
  104, 268, 269, 263, 103, 577, 581, 253, 254, 255, 259, 260, 261,
];
const intSpecs = [
  270, 65, 262, 264, 105, 102, 62, 63, 64, 256, 257, 258, 265, 266, 267,
];
const strSpecs = [66, 70, 250, 251, 252, 71, 72, 73];

export function findMissingEnchantments(
  character: EquippedItemsCharacter,
  profile: CharacterProfile
) {
  const rval: string[] = [];
  for (let i = 0; i < character.equipped_items.length; i++) {
    const currentItem = character.equipped_items[i];
    if (SlotsRequiringEnchants.includes(currentItem.slot.type)) {
      if (currentItem.enchantments && currentItem.enchantments.length > 0) {
        continue;
      } else {
        rval.push(currentItem.slot.type);
      }
    }
    if (
      strSpecs.includes(profile.active_spec.id) &&
      currentItem.slot.type === "HANDS"
    ) {
      if (currentItem.enchantments && currentItem.enchantments.length > 0) {
        continue;
      } else {
        rval.push(currentItem.slot.type);
      }
    }
    if (
      agiSpecs.includes(profile.active_spec.id) &&
      currentItem.slot.type === "FEET"
    ) {
      if (currentItem.enchantments && currentItem.enchantments.length > 0) {
        continue;
      } else {
        rval.push(currentItem.slot.type);
      }
    }
    if (
      intSpecs.includes(profile.active_spec.id) &&
      currentItem.slot.type === "WRIST"
    ) {
      if (currentItem.enchantments && currentItem.enchantments.length > 0) {
        continue;
      } else {
        rval.push(currentItem.slot.type);
      }
    }
  }
  return rval;
}
