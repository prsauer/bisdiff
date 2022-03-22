import fetch from "node-fetch";
import {
  CharacterProfile,
  EquippedItemsCharacter,
  LeaderboardResult,
} from "./proxy/api-types";

const api_root = "us.api.blizzard.com";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Authorization = {
  access_token: string;
  token_type: string;
  expires_in: number;
  sub: string;
};

export async function getApiKey(
  region: string,
  clientId: string,
  clientSecret: string
): Promise<Authorization> {
  const res = await fetch(
    `https://${region}.battle.net/oauth/token?grant_type=client_credentials`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
    }
  );
  console.log(res);
  return res.json() as Promise<Authorization>;
}

export async function getLeaders(
  access_token: string
): Promise<LeaderboardResult> {
  const res = await fetch(
    `https://${api_root}/data/wow/pvp-season/32/pvp-leaderboard/3v3?namespace=dynamic-us&locale=en_US&access_token=${access_token}`
  );
  console.log(res);
  return res.json() as Promise<LeaderboardResult>;
}

export async function getProfile(
  access_token: string,
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
  access_token: string,
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
