import fs from "fs";
import { join } from "path";
import cdata from "../src/json/composed.json";
import idata from "../equippable-items.json";
import { EquippedItem } from "../src/proxy/api-types";

/**
 * REQUIRES: ../equippable-items.json locally
 * Download this file off raidbots
 *
 * This script generates json/itemLevels.json
 *
 * It cross-references the list of items the top 5k players have from
 * json/composed.json with the item levels that raidbots publishes
 *
 * This is to compensate for simc not outputting item levels directly
 *
 * A significant portion of the bonus ids list should be copied into
 * json/itemLevelBonuses.json as well --- this list represents all the
 * bonus ids that cause an items ilvl to increase. This is also used
 * to parse ilvls out of simc dumps correctly.
 */

// Items from Raidbots dump
type RItemPartial = {
  id: number;
  name: string;
  itemLevel: number;
};

const ilvlData = idata as unknown as RItemPartial[];

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

const usedItems = compositeData
  .map((a) => a.histoMaps.map((i) => i.histo.map((h) => h.item.item.id)))
  .flat(4);

const mappedItems = new Set<{ id: number; itemLevel: number; name: string }>();

for (let i = 0; i < usedItems.length; i++) {
  const curId = usedItems[i];
  const record = ilvlData.find((a) => a.id === curId);
  //   console.log(
  //     "search",
  //     curId,
  //     ilvlData[0].id,
  //     typeof curId,
  //     typeof ilvlData[0].id,
  //     record
  //   );
  if (record) {
    mappedItems.add({
      id: curId,
      itemLevel: record.itemLevel,
      name: record.name,
    });
  }
}

const mapping: Record<number, { itemLevel: number; name: string }> = {};
mappedItems.forEach((a) => {
  mapping[a.id] = { itemLevel: a.itemLevel, name: a.name };
});

fs.writeFileSync(
  join(process.cwd(), "src", "json", "itemLevels.json"),
  JSON.stringify(mapping, null, 2)
);
