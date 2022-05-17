import React, { useRef, useState } from "react";
import cdata from "../json/composed.json";
import {
  CharacterProfile,
  CombatUnitSpecNames,
  EquippedItem,
  EquippedItemsCharacter,
  SpecIdsByClass,
} from "../proxy/api-types";
import { ItemSlot } from "../components/ItemSlot";
import { PageContainer } from "../design/PageContainer";
import { NavBlade, NavBladeButton } from "../design/NavBlade";
import { simcReportToItemArray } from "../util/decodeSimc";
import { findMissingEnchantments } from "../util/enchants";
import { Heading2 } from "../design/atoms";
import { findMissingUpgrades } from "../util/upgrades";

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

  const [showAll, setShowAll] = useState(true);
  const [profilesComparedCount, setProfilesComparedCount] = useState(0);
  const [specOverride, setSpecOverride] = useState<number | undefined>();

  const [data, setData] = useState<
    | {
        profile: CharacterProfile;
        equippedCharacter: EquippedItemsCharacter;
      }
    | undefined
  >(undefined);

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

    setSpecOverride(undefined);
    const targetItemData = simcReportToItemArray(newData);
    setData(targetItemData);
    const res = calculateHistograms(
      targetItemData.profile.active_spec.id,
      targetItemData.equippedCharacter
    );
    setItemData(res.histoMaps || []);
    setProfilesComparedCount(res.profilesComparedCount || 0);
  }

  function writeSpecOverride(d: string) {
    const newSpecOverride = parseInt(d);
    if (!data) return;
    const res = calculateHistograms(
      newSpecOverride || data.profile.active_spec.id || 100,
      data.equippedCharacter
    );
    setSpecOverride(newSpecOverride);
    setItemData(res.histoMaps || []);
    setProfilesComparedCount(res.profilesComparedCount || 0);
  }

  const simcInputRef = useRef<HTMLTextAreaElement>(null);

  const missingEnchants = data?.equippedCharacter
    ? findMissingEnchantments(data.equippedCharacter, data.profile)
    : [];
  const missingUpgrades = data?.equippedCharacter
    ? findMissingUpgrades(data.equippedCharacter, data.profile)
    : [];

  return (
    <PageContainer>
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
      <NavBlade>
        <NavBladeButton
          label={"Show/Hide already BIS gear"}
          selected={showAll ? "Show/Hide already BIS gear" : ""}
          clickHandler={() => setShowAll(!showAll)}
        />
      </NavBlade>
      <NavBlade label="Override spec">
        {data &&
          SpecIdsByClass[data?.profile.character_class.name.toLowerCase()].map(
            (d) => (
              <NavBladeButton
                key={d}
                label={CombatUnitSpecNames[d]}
                selected={CombatUnitSpecNames[`${specOverride}`]}
                clickHandler={() => writeSpecOverride(d)}
              />
            )
          )}
      </NavBlade>
      {data && (
        <div style={{ marginTop: 12 }}>
          Found profile: {data.profile.name},{" "}
          {data.profile.race.name.toLocaleLowerCase()}{" "}
          {data.profile.active_spec.name.toLocaleLowerCase()}{" "}
          {data.profile.character_class.name.toLocaleLowerCase()}
        </div>
      )}
      {missingEnchants.map((a) => (
        <Heading2 key={a}>Slot missing enchantment: {a}</Heading2>
      ))}
      {missingUpgrades.map((a) => (
        <Heading2 key={a}>{a}</Heading2>
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 25,
          maxWidth: 950,
        }}
      >
        {data?.equippedCharacter.equipped_items &&
          itemData.map((b) => (
            <ItemSlot
              key={b.slotType}
              {...b}
              targetData={data.equippedCharacter.equipped_items}
              profilesComparedCount={profilesComparedCount}
              showAll={showAll}
            />
          ))}
      </div>

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
