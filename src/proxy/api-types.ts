export enum ClassName {
  DemonHunter = "DEMONHUNTER",
  Druid = "DRUID",
  Hunter = "HUNTER",
  Mage = "MAGE",
  Paladin = "PALADIN",
  Priest = "PRIEST",
  Rogue = "ROGUE",
  Shaman = "SHAMAN",
  Warlock = "WARLOCK",
  Warrior = "WARRIOR",
}

export enum CombatUnitSpec {
  DeathKnight_Blood = "250",
  DeathKnight_Frost = "251",
  DeathKnight_Unholy = "252",
  DemonHunter_Havoc = "577",
  DemonHunter_Vengeance = "581",
  Druid_Balance = "102",
  Druid_Feral = "103",
  Druid_Guardian = "104",
  Druid_Restoration = "105",
  Hunter_BeastMastery = "253",
  Hunter_Marksmanship = "254",
  Hunter_Survival = "255",
  Mage_Arcane = "62",
  Mage_Fire = "63",
  Mage_Frost = "64",
  Monk_BrewMaster = "268",
  Monk_Windwalker = "269",
  Monk_Mistweaver = "270",
  Paladin_Holy = "65",
  Paladin_Protection = "66",
  Paladin_Retribution = "70",
  Priest_Discipline = "256",
  Priest_Holy = "257",
  Priest_Shadow = "258",
  Rogue_Assassination = "259",
  Rogue_Outlaw = "260",
  Rogue_Subtlety = "261",
  Shaman_Elemental = "262",
  Shaman_Enhancement = "263",
  Shaman_Restoration = "264",
  Warlock_Affliction = "265",
  Warlock_Demonology = "266",
  Warlock_Destruction = "267",
  Warrior_Arms = "71",
  Warrior_Fury = "72",
  Warrior_Protection = "73",
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const CombatUnitSpecNames: Record<any, string> = {};
function formatSpecName(rawSpecName: string) {
  const parts = rawSpecName.split("_");
  return `${capitalizeFirstLetter(parts[1])} ${capitalizeFirstLetter(
    parts[0]
  )}`;
}
Object.keys(CombatUnitSpec).forEach(
  (k) =>
    (CombatUnitSpecNames[CombatUnitSpec[k as keyof typeof CombatUnitSpec]] =
      formatSpecName(k))
);

export const SpecIdsByClass: Record<string, string[]> = {};
Object.keys(ClassName).forEach(
  (k) =>
    (SpecIdsByClass[k] = Object.keys(CombatUnitSpec)
      .filter((s) => s.search(k) > -1)
      .map((v) => CombatUnitSpec[v as keyof typeof CombatUnitSpec]))
);

export type CharacterPartial = {
  id: number;
  name: string;
  realm: {
    id: number;
    slug: string;
  };
};

export type LeaderboardCharacter = {
  character: CharacterPartial;
};
export type LeaderboardResult = {
  entries: LeaderboardCharacter[];
};

export enum MatchQuality {
  "GREEN",
  "YELLOW",
  "RED",
}

export type EquippedItem = {
  name: string;
  slot: {
    type: string;
    name: string;
  };
  item: {
    id: number;
  };
  bonus_list: number[];
  enchantments?: {
    enchantment_id: number;
  }[];
  sockets?: {
    item: {
      id: number;
    };
  }[];
  level: {
    value: number;
  };
};
export type EquippedItemsCharacter = {
  character: CharacterPartial;
  equipped_items: EquippedItem[];
};

export type CharacterProfile = {
  id: number;
  name: string;
  faction: {
    type: string;
    name: string;
  };
  race: {
    name: string;
    id: number;
  };
  character_class: {
    name: string;
    id: number;
  };
  active_spec: {
    name: string;
    id: number;
  };
};
