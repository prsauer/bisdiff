import React, { useEffect, useRef, useState } from "react";
import { getProfile, getEquippedItemsByPlayer } from "../proxy/web-api";
import cdata from "../json/composed.json";
import {
  CombatUnitSpecNames,
  EquippedItem,
  EquippedItemsCharacter,
  SpecIdsByClass,
} from "../proxy/api-types";
import { ItemSlot } from "../components/ItemSlot";
import { PageContainer } from "../design/PageContainer";
import { useSearchParams } from "react-router-dom";
import { TappableText } from "../design/TappableText";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { NavBlade, NavBladeButton } from "../design/NavBlade";

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

function main(targetSpec: number, targetItemData: EquippedItemsCharacter) {
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
    return { p: targetProfile, i: targetItemData };
  } else {
    throw new Error("Cannot find profile");
  }
}

const LAST_SEARCH_COOKIE = "last-search-query";

export function DiffPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [cookies, setCookies] = useCookies([LAST_SEARCH_COOKIE]);
  const armorySearch = atob(searchParams.get("al") || "");
  const [armorySearchInput, setArmorySearchInput] = useState(
    cookies[LAST_SEARCH_COOKIE] || ""
  );
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [profilesComparedCount, setProfilesComparedCount] = useState(0);
  const [specOverride, setSpecOverride] = useState<number | undefined>();

  const {
    data: profileData,
    error: profileError,
    isLoading: profileIsLoading,
  } = useQuery(
    ["find-profile", armorySearch],
    () => {
      if (armorySearch) return findProfile(armorySearch);
    },
    {
      retry: (failureCount, error) => {
        if ((error as Error).message === "Fetch error 404") return false;
        return true;
      },
    }
  );
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
  const [targetData, setTargetData] = useState<EquippedItem[]>([]);
  useEffect(() => {
    try {
      // eslint-disable-next-line no-eval
      eval("$WowheadPower.refreshLinks()");
    } catch (e) {
      // oh well
    }
  }, []);

  useEffect(() => {
    async function refreshData() {
      setLoading(true);
      setTargetData([]);
      setItemData([]);
      setProfilesComparedCount(0);
      const prof = profileData;
      if (!profileIsLoading && prof) {
        const res = main(specOverride || prof.p.active_spec.id, prof.i);
        setLoading(true);
        setItemData(res.histoMaps || []);
        setTargetData(res.targetData || []);
        setProfilesComparedCount(res.profilesComparedCount || 0);
        setTimeout(() => {
          // eslint-disable-next-line no-eval
          eval("$WowheadPower.refreshLinks()");
          setLoading(false);
        }, 500);
      }
      setLoading(false);
    }
    refreshData();
  }, [profileIsLoading, specOverride]);

  async function onPressCompare() {
    setCookies(LAST_SEARCH_COOKIE, armorySearchInput);
    setSpecOverride(undefined);
    setSearchParams({ al: btoa(armorySearchInput).toString() });
  }

  function submitNOOP(e: any) {
    e.preventDefault();
  }

  function inputChanged(e: any) {
    setArmorySearchInput(e.target.value);
  }

  const inputRef = useRef<HTMLInputElement>(null);

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
      <NavBlade>
        <NavBladeButton
          label={"Show/Hide already BIS gear"}
          selected={showAll ? "Show/Hide already BIS gear" : ""}
          clickHandler={() => setShowAll(!showAll)}
        />
      </NavBlade>
      {(profileIsLoading || loading) && <div>Loading...</div>}
      {profileError && <div>An error occurred</div>}
      {profileData && (
        <NavBlade label="Override spec">
          {SpecIdsByClass[profileData.p.character_class.name].map((d) => (
            <NavBladeButton
              key={d}
              label={CombatUnitSpecNames[d]}
              selected={CombatUnitSpecNames[`${specOverride}`]}
              clickHandler={() => setSpecOverride(parseInt(d))}
            />
          ))}
        </NavBlade>
      )}
      {profileData && (
        <div style={{ marginTop: 12 }}>
          Found profile: {profileData.p.name}, {profileData.p.race.name}{" "}
          {profileData.p.active_spec.name} {profileData.p.character_class.name}
        </div>
      )}
      {!profileIsLoading && (
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
        {itemData.map((b) => (
          <ItemSlot
            key={b.slotType}
            {...b}
            targetData={targetData}
            profilesComparedCount={profilesComparedCount}
            showAll={showAll}
          />
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        Known issues: Trinkets/rings aren't compared well due to having 2
        equipped. Only EU/US supported.
      </div>
    </PageContainer>
  );
}
