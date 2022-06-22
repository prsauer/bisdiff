import React, { useRef, useState } from "react";
import cdata from "../json/composed.json";
import {
  CharacterProfile,
  EquippedItem,
  EquippedItemsCharacter,
} from "../proxy/api-types";
import { ItemSlot } from "../components/ItemSlot";
import { PageContainer } from "../design/PageContainer";
import { simcReportToItemArray } from "../util/decodeSimc";
import { findMissingEnchantments } from "../util/enchants";
import { Heading2 } from "../design/atoms";
import { findMissingUpgrades } from "../util/upgrades";
import { StatsHisto } from "../components/StatsHisto";

const compositeData = cdata as unknown as {
  specId: string;
  histoMaps: {
    histo: {
      id: string;
      count: number;
      percent: number;
      item: EquippedItem;
    }[];
    slotType: string;
  }[];
  profilesComparedCount: number;
}[];

function calculateHistograms(
  targetSpec: number,
  targetItemData: EquippedItemsCharacter
) {
  const targetData = targetItemData.equipped_items;
  const data = compositeData.find((s) => s.specId === `${targetSpec}`);
  return {
    histoMaps: data?.histoMaps,
    targetData,
    profilesComparedCount: data?.profilesComparedCount,
  };
}

export function DiffPage() {
  const [simcDataInput, setSimcDataInput] = useState("");

  const [profilesComparedCount, setProfilesComparedCount] = useState(0);

  const [data, setData] = useState<{
    profile: CharacterProfile;
    equippedCharacter: EquippedItemsCharacter;
  } | null>(null);

  const [itemData, setItemData] = useState<
    {
      histo: {
        id: string;
        count: number;
        percent: number;
        item: EquippedItem;
      }[];
      slotType: string;
    }[]
  >([]);

  function submitNOOP(e: any) {
    e.preventDefault();
  }

  function simcInputChanged(e: any) {
    const newData = e.target.value;
    setSimcDataInput(newData);
    const targetItemData = simcReportToItemArray(newData);
    setData(targetItemData);

    if (targetItemData) {
      const res = calculateHistograms(
        targetItemData.profile.active_spec.id,
        targetItemData.equippedCharacter
      );
      setItemData(res.histoMaps || []);
      setProfilesComparedCount(res.profilesComparedCount || 0);
    } else {
      setItemData([]);
      setProfilesComparedCount(0);
    }
  }

  const simcInputRef = useRef<HTMLTextAreaElement>(null);

  const missingEnchants = data?.equippedCharacter
    ? findMissingEnchantments(data.equippedCharacter, data.profile)
    : [];
  const missingUpgrades = data?.equippedCharacter
    ? findMissingUpgrades(data.equippedCharacter, data.profile)
    : [];

  const items = itemData
    .map((i) => i.histo[0])
    .filter((i) => i)
    .flat()
    .map((i) => i.item);

  const allItemsHisto = itemData.map((i) => i.histo).flat();

  // Look up the full stats of the player's equipped items
  // api does not resolve full stats :\
  const resolvedItems =
    data?.equippedCharacter.equipped_items
      .map((i) =>
        allItemsHisto.find(
          (j) => j.item.item.id.toString() === i.item.id.toString()
        )
      )
      .map((i) => {
        if (i) {
          return {
            ...i,
            percent: 1, // set players items all to frequency:1 to make the calc for StatsHisto work
          };
        } else {
          return undefined;
        }
      })
      .flatMap((i) => (i ? [i] : [])) || [];

  return (
    <PageContainer style={{ maxWidth: 750 }}>
      <div style={{ marginTop: 12, color: "gray" }}>
        Compares your equipped items to the top 5k pvp players, filtered for
        your spec.
      </div>
      <div
        style={{
          marginTop: 4,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <textarea
          ref={simcInputRef}
          onFocus={() => {
            if (simcInputRef.current) simcInputRef.current.select();
          }}
          style={{
            width: 500,
            backgroundColor: "#383838",
            color: "lightgray",
            borderStyle: "solid",
            borderWidth: 1,
            padding: 0,
            paddingLeft: 2,
            margin: 0,
          }}
          onSubmit={submitNOOP}
          value={simcDataInput}
          onChange={simcInputChanged}
          placeholder="paste simc data here"
        />
      </div>
      {data && (
        <div style={{ marginTop: 12 }}>
          {data.profile.name}, {data.profile.race.name.toLocaleLowerCase()}{" "}
          {data.profile.active_spec.name.toLocaleLowerCase()}{" "}
          {data.profile.character_class.name.toLocaleLowerCase()}
        </div>
      )}
      {missingEnchants.map((a) => (
        <Heading2 key={a}>Slot missing enchantment: {a}</Heading2>
      ))}
      {missingUpgrades.map((a) => (
        <div className="ml-2 text-lg text-red-400" key={a}>
          {a}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {data?.equippedCharacter.equipped_items &&
          itemData.map((b) => (
            <ItemSlot
              key={b.slotType}
              {...b}
              targetData={data.equippedCharacter.equipped_items}
              profilesComparedCount={profilesComparedCount}
            />
          ))}
      </div>
      {items.length > 0 && (
        <StatsHisto
          items={allItemsHisto}
          title={"Ladder-Bests Stat Distribution"}
        />
      )}
      {resolvedItems.length > 0 && (
        <StatsHisto items={resolvedItems} title={"Equipped Distribution"} />
      )}
      <div style={{ marginTop: 12 }}>
        Known issues: Trinkets/rings aren't compared well due to having 2
        equipped. Only EU/US supported.
      </div>
      {data && (
        <div>Comparing to {profilesComparedCount} profiles on the ladder</div>
      )}
    </PageContainer>
  );
}
