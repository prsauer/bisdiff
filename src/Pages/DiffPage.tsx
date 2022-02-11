import React, { useEffect, useRef, useState } from "react";
import { getProfile, getEquippedItemsByPlayer } from "../proxy/web-api";
import cdata from "../json/composed.json";
import {
  CharacterProfile,
  EquippedItem,
  EquippedItemsCharacter,
} from "../proxy/api-types";
import { ItemSlot } from "../components/ItemSlot";
import { PageContainer } from "../design/PageContainer";
import { useSearchParams } from "react-router-dom";
import { TappableText } from "../design/TappableText";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";

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

function main(
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
  const linkParts = armorySearch.split("/");
  const targetName = linkParts[linkParts.length - 1];
  const targetRealm = linkParts[linkParts.length - 2];
  const targetProfile = await getProfile(targetName, targetRealm);
  const targetItemData = await getEquippedItemsByPlayer(
    targetName,
    targetRealm
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
  const [profilesComparedCount, setProfilesComparedCount] = useState(0);
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
      const prof = profileData;
      if (!profileIsLoading && prof) {
        const res = main(prof.p, prof.i);
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
  }, [profileIsLoading]);

  async function onPressCompare() {
    setCookies(LAST_SEARCH_COOKIE, armorySearchInput);
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
      <div>Comparing {profilesComparedCount} profiles</div>

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
      <div style={{ marginTop: 12 }}>
        Compares your equipped items to the top 5k pvp players, filtered for
        your spec.
      </div>

      {profileError && <div>An error occurred</div>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 25,
          maxWidth: 800,
        }}
      >
        {itemData.map((b) => (
          <ItemSlot key={b.slotType} {...b} targetData={targetData} />
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        Known issues: Trinkets/rings aren't compared well due to having 2
        equipped
      </div>
    </PageContainer>
  );
}
