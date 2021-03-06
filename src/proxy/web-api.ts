import { CharacterProfile, EquippedItemsCharacter } from "./api-types";

const api_root = "gentle-hamlet-01818.herokuapp.com";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProfile(
  name: string,
  realm: string,
  region: string
): Promise<CharacterProfile | undefined> {
  let res = await fetch(
    `https://${api_root}/profile/wow/character/${realm.toLocaleLowerCase()}/${name.toLocaleLowerCase()}?namespace=profile-${region}&locale=en_US`
  );
  if (res.status !== 200) {
    await sleep(1000);
    res = await fetch(
      `https://${api_root}/profile/wow/character/${realm.toLocaleLowerCase()}/${name.toLocaleLowerCase()}?namespace=profile-${region}&locale=en_US`
    );
  }
  if (res.status !== 200) {
    throw new Error(`Fetch error ${res.status}`);
  }
  return res.json() as Promise<CharacterProfile>;
}

export async function getEquippedItemsByPlayer(
  name: string,
  realm: string,
  region: string
): Promise<EquippedItemsCharacter | undefined> {
  let res = await fetch(
    `https://${api_root}/profile/wow/character/${realm.toLocaleLowerCase()}/${name.toLocaleLowerCase()}/equipment?namespace=profile-${region}&locale=en_US`
  );
  if (res.status !== 200) {
    await sleep(1000);
    res = await fetch(
      `https://${api_root}/profile/wow/character/${realm.toLocaleLowerCase()}/${name.toLocaleLowerCase()}/equipment?namespace=profile-${region}&locale=en_US`
    );
  }
  if (res.status !== 200) {
    throw new Error(`Fetch error ${res.status}`);
  }
  return res.json() as Promise<EquippedItemsCharacter>;
}
