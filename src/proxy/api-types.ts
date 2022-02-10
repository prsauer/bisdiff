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
