import { CharacterProfile, EquippedItemsCharacter } from "../proxy/api-types";

export function findMissingUpgrades(
  character: EquippedItemsCharacter,
  profile: CharacterProfile
): string[] {
  const rval: string[] = [];
  for (let i = 0; i < character.equipped_items.length; i++) {
    const currentItem = character.equipped_items[i];
    if (
      currentItem.name.startsWith("Cosmic Aspirant's") &&
      !currentItem.bonus_list.includes(1556)
    ) {
      rval.push(
        `Missing honor upgrade for ${currentItem.slot.name} ${currentItem.name}`
      );
    }
    console.log(currentItem);
  }
  return rval;
}
