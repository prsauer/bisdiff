import React, { useRef, useState } from "react";
import { getProfile, getEquippedItemsByPlayer } from "../proxy/web-api";
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
import { useSearchParams } from "react-router-dom";
import { TappableText } from "../design/TappableText";
import { useCookies } from "react-cookie";
import { NavBlade, NavBladeButton } from "../design/NavBlade";
import { simcReportToItemArray } from "../util/decodeSimc";

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

async function findProfile(armorySearch: string) {
  const linkParts = armorySearch.split("/");
  const targetName = linkParts[linkParts.length - 1];
  const targetRealm = linkParts[linkParts.length - 2];
  const targetRegion = linkParts[linkParts.length - 3];
  const targetProfile = await getProfile(targetName, targetRealm, targetRegion);
  const targetItemData = await getEquippedItemsByPlayer(
    targetName,
    targetRealm,
    targetRegion
  );
  if (targetProfile && targetItemData) {
    return { profile: targetProfile, equippedCharacter: targetItemData };
  } else {
    throw new Error("Cannot find profile");
  }
}

const LAST_SEARCH_COOKIE = "last-search-query";

export function DiffPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [dataSource, setDataSource] = useState("armory");
  const [cookies, setCookies] = useCookies([LAST_SEARCH_COOKIE]);
  const armorySearch = atob(searchParams.get("al") || "");
  const [armorySearchInput, setArmorySearchInput] = useState(
    cookies[LAST_SEARCH_COOKIE] || ""
  );
  const [simcDataInput, setSimcDataInput] = useState("");

  const [loading, setLoading] = useState(false);
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

  async function onPressCompare() {
    setDataSource("armory");
    setLoading(true);
    setSpecOverride(undefined);
    setData(undefined);
    setItemData([]);
    setProfilesComparedCount(0);
    const profile = await findProfile(armorySearchInput);
    if (!profile?.equippedCharacter) {
      setLoading(false);
      return;
    }
    const res = calculateHistograms(
      specOverride || profile.profile.active_spec.id || 100,
      profile?.equippedCharacter
    );
    setData(profile);
    setItemData(res.histoMaps || []);
    setProfilesComparedCount(res.profilesComparedCount || 0);
    setLoading(false);
  }

  function onPressLoadSIMC() {
    setDataSource("simc");
    setSpecOverride(undefined);
    const targetItemData = simcReportToItemArray(simcDataInput);
    setData(targetItemData);
    const res = calculateHistograms(250, targetItemData.equippedCharacter);
    setItemData(res.histoMaps || []);
    setProfilesComparedCount(res.profilesComparedCount || 0);
  }

  function submitNOOP(e: any) {
    e.preventDefault();
  }

  function inputChanged(e: any) {
    setArmorySearchInput(e.target.value);
  }

  function simcInputChanged(e: any) {
    setSimcDataInput(e.target.value);
  }

  function writeSpecOverride(d: string) {
    setSpecOverride(parseInt(d));
    if (!data) return;
    const res = calculateHistograms(
      specOverride || data.profile.active_spec.id || 100,
      data.equippedCharacter
    );
    setItemData(res.histoMaps || []);
    setProfilesComparedCount(res.profilesComparedCount || 0);
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const simcInputRef = useRef<HTMLTextAreaElement>(null);

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
        <input
          ref={inputRef}
          onFocus={() => {
            if (inputRef.current) inputRef.current.select();
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
          disabled={loading}
          onSubmit={submitNOOP}
          value={armorySearchInput}
          onChange={inputChanged}
          placeholder="paste armory link here"
        />
        <TappableText
          disabled={loading}
          onClick={onPressCompare}
          text={"compare"}
        />
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
          disabled={loading}
          onSubmit={submitNOOP}
          value={simcDataInput}
          onChange={simcInputChanged}
          placeholder="paste simc data here"
        />
        <TappableText
          disabled={loading}
          onClick={onPressLoadSIMC}
          text={"load simc data"}
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
        {SpecIdsByClass["Priest"].map((d) => (
          <NavBladeButton
            key={d}
            label={CombatUnitSpecNames[d]}
            selected={CombatUnitSpecNames[`${specOverride}`]}
            clickHandler={() => writeSpecOverride(d)}
          />
        ))}
      </NavBlade>
      {loading && <div>Loading...</div>}
      {data && (
        <div style={{ marginTop: 12 }}>
          Found profile: {data.profile.name}, {data.profile.race.name}{" "}
          {data.profile.active_spec.name} {data.profile.character_class.name}
        </div>
      )}
      {data && (
        <div>Comparing to {profilesComparedCount} profiles on the ladder</div>
      )}
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
      <div>Data Source: {dataSource}</div>
      {dataSource === "simc" && (
        <div>Simc data does not currently compare iLvls</div>
      )}
      <div style={{ marginTop: 12 }}>
        Known issues: Trinkets/rings aren't compared well due to having 2
        equipped. Only EU/US supported.
      </div>
    </PageContainer>
  );
}
