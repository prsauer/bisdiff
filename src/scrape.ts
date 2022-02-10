import { getEquippedItemsByPlayer, getLeaders, getProfile, sleep } from "./api";
import fs from "fs";
import { join } from "path";

import {
  CharacterProfile,
  EquippedItem,
  EquippedItemsCharacter,
  LeaderboardCharacter,
  LeaderboardResult,
} from "./proxy/api-types";

const slotTypes = [
  "HEAD",
  "NECK",
  "SHOULDER",
  "CHEST",
  "WAIST",
  "LEGS",
  "FEET",
  "WRIST",
  "HANDS",
  "FINGER_1",
  "FINGER_2",
  "TRINKET_1",
  "TRINKET_2",
  "BACK",
  "MAIN_HAND",
  "OFF_HAND",
];

enum CombatUnitSpec {
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
const allSpecIds = Object.values(CombatUnitSpec);

function computeHistogramSlow(ary: EquippedItem[]) {
  const result: Record<string, number> = {};
  const resultFlat: {
    id: string;
    count: number;
    percent: number;
    item: any;
  }[] = [];
  console.log(ary);
  ary.forEach(
    (a) =>
      (result[`${a.item.id}`] = ary.filter(
        (b) => a.item.id === b.item.id
      ).length)
  );
  Object.keys(result).forEach((k) => {
    resultFlat.push({
      id: k,
      count: result[k],
      item: ary.find((a) => `${a.item.id}` === k),
      percent: 0,
    });
  });
  const sum = resultFlat.reduce((prev, cur) => prev + cur.count, 0);
  resultFlat.forEach((r) => {
    r.percent = (100 * r.count) / sum;
  });
  return resultFlat.sort((a, b) => b.count - a.count);
}

function histoForSlot(
  profiles: CharacterProfile[],
  itemsData: EquippedItemsCharacter[],
  slotType: string
) {
  const itemsInSlot = profiles
    .map((p) => itemsData.find((e) => e.character?.id === p.id))
    .map((e) => e?.equipped_items.find((e) => e.slot.type === slotType))
    .filter((a) => a !== undefined);
  return computeHistogramSlow(itemsInSlot as EquippedItem[]);
}

function composeData(
  leaderBoardSlice: LeaderboardCharacter[],
  profileData: CharacterProfile[],
  itemsData: EquippedItemsCharacter[]
) {
  const result: {
    specId: string;
    histoMaps: {
      histo: {
        id: string;
        count: number;
        percent: number;
        item: any;
      }[];
      slotType: string;
    }[];
    profilesComparedCount: number;
  }[] = [];

  allSpecIds.forEach((spec) => {
    const profilesMatchingTargetSpec = profileData.filter(
      (p) => `${p?.active_spec?.id}` === spec
    );
    const histoMaps: {
      histo: {
        id: string;
        count: number;
        percent: number;
        item: any;
      }[];
      slotType: string;
    }[] = [];
    slotTypes.forEach((s) => {
      histoMaps.push({
        slotType: s,
        histo: histoForSlot(profilesMatchingTargetSpec, itemsData, s),
      });
    });
    result.push({
      specId: spec,
      histoMaps,
      profilesComparedCount: profilesMatchingTargetSpec.length,
    });
  });
  return result;
}

async function main() {
  const LIMIT = 5000;
  const SKIP = 50;

  const leads: LeaderboardResult = await getLeaders();
  const leaderBoardSlice = leads.entries.slice(0, LIMIT);

  const profileData: CharacterProfile[] = [];
  for (let i = 0; i < leaderBoardSlice.length - 1; i += SKIP) {
    console.log(`profiles data at ${i} of ${LIMIT}`);
    profileData.push(
      ...((
        await Promise.all(
          leaderBoardSlice
            .slice(i, i + SKIP)
            .map((c) =>
              getProfile(
                c.character.name.toLocaleLowerCase(),
                c.character.realm.slug
              )
            )
        )
      ).filter((a) => a !== undefined) as CharacterProfile[])
    );
    await sleep(500);
  }

  console.log(profileData.length, leaderBoardSlice);

  const itemsData: EquippedItemsCharacter[] = [];
  for (let i = 0; i < leaderBoardSlice.length - 1; i += SKIP) {
    console.log(`items data at ${i} of ${LIMIT}`);
    itemsData.push(
      ...((
        await Promise.all(
          leaderBoardSlice
            .slice(i, i + SKIP)
            .map((c) =>
              getEquippedItemsByPlayer(
                c.character.name.toLocaleLowerCase(),
                c.character.realm.slug
              )
            )
        )
      ).filter((a) => a !== undefined) as EquippedItemsCharacter[])
    );
    await sleep(500);
  }

  console.log(`Found ${profileData.length} profiles out of ${LIMIT} calls`);
  console.log(`Found ${itemsData.length} item profiles out of ${LIMIT} calls`);

  // fs.writeFileSync(
  //   join(process.cwd(), "src", "json", "leaderboard.json"),
  //   JSON.stringify(leads)
  // );
  // fs.writeFileSync(
  //   join(process.cwd(), "src", "json", "profiles.json"),
  //   JSON.stringify(profileData)
  // );
  // fs.writeFileSync(
  //   join(process.cwd(), "src", "json", "equipped-items.json"),
  //   JSON.stringify(itemsData)
  // );
  const composed = composeData(leads.entries, profileData, itemsData);
  fs.writeFileSync(
    join(process.cwd(), "src", "json", "composed.json"),
    JSON.stringify(composed, null, 2)
  );
  return;
}

main().then((a) => console.log("Done", a));
