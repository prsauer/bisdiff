import fetch from "node-fetch";
import {
  CharacterProfile,
  EquippedItemsCharacter,
  LeaderboardResult,
} from "./proxy/api-types";

const api_root = "us.api.blizzard.com";
const access_token = "zxc";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getLeaders(): Promise<LeaderboardResult> {
  const res = await fetch(
    `https://${api_root}/data/wow/pvp-season/32/pvp-leaderboard/3v3?namespace=dynamic-us&locale=en_US&access_token=${access_token}`
  );
  console.log(res);
  return res.json() as Promise<LeaderboardResult>;
}

export async function getProfile(
  name: string,
  realm: string
): Promise<CharacterProfile | undefined> {
  try {
    let res = await fetch(
      `https://${api_root}/profile/wow/character/${realm}/${name}?namespace=profile-us&locale=en_US&access_token=${access_token}`
    );
    if (res.status !== 200) {
      await sleep(1000);
      res = await fetch(
        `https://${api_root}/profile/wow/character/${realm}/${name}?namespace=profile-us&locale=en_US&access_token=${access_token}`
      );
    }
    return res.json() as Promise<CharacterProfile>;
  } catch {
    return undefined;
  }
}

export async function getEquippedItemsByPlayer(
  name: string,
  realm: string
): Promise<EquippedItemsCharacter | undefined> {
  try {
    let res = await fetch(
      `https://${api_root}/profile/wow/character/${realm}/${name}/equipment?namespace=profile-us&locale=en_US&access_token=${access_token}`
    );
    if (res.status !== 200) {
      await sleep(1000);
      res = await fetch(
        `https://${api_root}/profile/wow/character/${realm}/${name}/equipment?namespace=profile-us&locale=en_US&access_token=${access_token}`
      );
    }
    return res.json() as Promise<EquippedItemsCharacter>;
  } catch {
    return undefined;
  }
}
