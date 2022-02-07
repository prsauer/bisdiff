import React, { useEffect, useState } from "react";

import { getProfile } from "./web-api";

import "./App.css";
import { EquipmentInfo } from "./EquipmentInfo";

import cdata from "./json/composed.json";

import {
  CharacterProfile,
  EquippedItem,
  EquippedItemsCharacter,
} from "./api-types";
import { getEquippedItemsByPlayer } from "./web-api";

const compositeData = cdata as unknown as {
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
}[];

async function main(
  targetProfile: CharacterProfile,
  targetItemData: EquippedItemsCharacter
) {
  const targetSpec = targetProfile.active_spec.id;
  const targetData = targetItemData.equipped_items;
  const data = compositeData.find((s) => s.specId === `${targetSpec}`);
  return {
    histoMaps: data?.histoMaps,
    targetData,
    profilesComparedCount: data?.profilesComparedCount,
  };
}

async function findProfile(armorySearch: string) {
  try {
    const linkParts = armorySearch.split("/");
    const targetName = linkParts[linkParts.length - 1];
    const targetRealm = linkParts[linkParts.length - 2];
    const targetProfile = await getProfile(targetName, targetRealm);
    const targetItemData = await getEquippedItemsByPlayer(
      targetName,
      targetRealm
    );
    console.log(targetProfile, targetItemData);
    if (targetProfile && targetItemData) {
      return { p: targetProfile, i: targetItemData };
    }
    return "Profile not found";
  } catch {
    return "An error occurred";
  }
}

function morphItem(i?: EquippedItem) {
  if (!i) return undefined;
  return {
    id: `${i.item.id}`,
    bonuses: i.bonus_list?.map((b) => `${b}`) || [],
    enchants: i.enchantments?.map((e) => `${e.enchantment_id}`) || [],
    gems: i.sockets?.filter((s) => s.item).map((s) => `${s.item.id}`) || [],
  };
}

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [armorySearch, setArmorySearch] = useState(
    "https://worldofwarcraft.com/en-us/character/us/stormrage/armsham"
  );
  const [profilesComparedCount, setProfilesComparedCount] = useState(0);
  const [itemData, setItemData] = useState<
    {
      histo: {
        id: string;
        count: number;
        percent: number;
        item: any;
      }[];
      slotType: string;
    }[]
  >([]);
  const [targetData, setTargetData] = useState<EquippedItem[]>([]);
  useEffect(() => {
    try {
      // eslint-disable-next-line no-eval
      eval("$WowheadPower.refreshLinks()");
    } catch (e) {
      // oh well
    }
  }, []);

  async function onPressCompare() {
    setLoading(true);
    try {
      const prof = await findProfile(armorySearch);
      if (typeof prof === "string") {
        setError(prof);
      } else {
        main(prof.p, prof.i).then((r) => {
          setLoading(true);
          setItemData(r.histoMaps || []);
          setTargetData(r.targetData || []);
          setProfilesComparedCount(r.profilesComparedCount || 0);
          setTimeout(() => {
            // eslint-disable-next-line no-eval
            eval("$WowheadPower.refreshLinks()");
            setLoading(false);
          }, 500);
        });
      }
    } catch {
      setError("Error");
    } finally {
      setLoading(false);
    }
  }

  function submitNOOP(e: any) {
    e.preventDefault();
  }

  function inputChanged(e: any) {
    setArmorySearch(e.target.value);
  }

  return (
    <div className="App">
      <div>Comparing {profilesComparedCount} profiles</div>
      {error && <div>{error}</div>}
      <input
        style={{
          width: 500,
        }}
        disabled={loading}
        onSubmit={submitNOOP}
        value={armorySearch}
        onChange={inputChanged}
        placeholder="paste armory link here"
      />
      <button disabled={loading} onClick={onPressCompare}>
        compare
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 25,
        }}
      >
        {itemData.map((b) => (
          <div
            key={b.slotType}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              marginBottom: 25,
              marginRight: 25,
              padding: 4,
              borderStyle: "solid",
              borderWidth: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              SLOT {b.slotType}{" "}
              <EquipmentInfo
                item={morphItem(
                  targetData.find((i) => i.slot.type === b.slotType)
                )}
                size={"small"}
                notext
              />
            </div>

            {b.histo.map((a) => (
              <div
                key={a.item.item.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {targetData.find((ti) => `${ti.item.id}` === a.id) && (
                  <div>Current - </div>
                )}
                <EquipmentInfo notext item={morphItem(a.item)} size={"small"} />
                {a.percent.toFixed(1)}%
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
