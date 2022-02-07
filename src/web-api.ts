import { CharacterProfile, EquippedItemsCharacter } from "./api-types";

const api_root = "us.api.blizzard.com";
const access_token = "zxcv";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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