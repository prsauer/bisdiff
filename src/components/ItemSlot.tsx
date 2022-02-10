import exp from "constants";
import { useState } from "react";
import { TappableText } from "../design/TappableText";
import { EquippedItem } from "../proxy/api-types";
import { EquipmentInfo } from "./EquipmentInfo";

interface ItemSlotProps {
  histo: {
    id: string;
    count: number;
    percent: number;
    item: any;
  }[];
  slotType: string;
  targetData: EquippedItem[];
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

function CurrentMarker({ i, children }: { i: number; children: any }) {
  return <div style={{ fontSize: 14 }}>{children}</div>;
}

function SlotTitle({
  slotType,
  rank,
  onClick,
}: {
  slotType: string;
  rank: number;
  onClick?: () => void;
}) {
  return (
    <TappableText onClick={onClick} style={{ fontSize: 14 }} text={slotType} />
  );
}

function mapRankToColor(rank: number) {
  if (rank === 0) {
    return "black";
  }
  if (rank === -1) {
    return "#7c1010";
  }
  if (rank < 3) {
    return "#6c5300";
  }
  return "#7c1010";
}

export function ItemSlot(props: ItemSlotProps) {
  const [expanded, setExpanded] = useState(false);
  const bestMatch = props.histo.findIndex((a) =>
    props.targetData.map((i) => `${i.item.id}`).includes(a.id)
  );

  const histoToShow = expanded ? props.histo : props.histo.slice(0, 3);
  if (!expanded && bestMatch > 2) {
    histoToShow[2] = props.histo[bestMatch];
  }

  return (
    <div
      key={props.slotType}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginBottom: 25,
        marginRight: 25,
        padding: 4,
        borderStyle: "solid",
        borderWidth: 1,
        backgroundColor: mapRankToColor(bestMatch),
        opacity: bestMatch === 0 ? 0.75 : 1.0,
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
        <SlotTitle
          slotType={props.slotType}
          rank={bestMatch}
          onClick={() => setExpanded(!expanded)}
        />
        <EquipmentInfo
          item={morphItem(
            props.targetData.find((i) => i.slot.type === props.slotType)
          )}
          size={"small"}
          notext
        />
      </div>

      {histoToShow.map((a, idx) => {
        return (
          <div
            key={a.item.item.id}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {props.targetData.find((ti) => `${ti.item.id}` === a.id) && (
              <CurrentMarker i={idx}>*</CurrentMarker>
            )}
            <EquipmentInfo notext item={morphItem(a.item)} size={"small"} />
            {a.percent.toFixed(1)}%
          </div>
        );
      })}
    </div>
  );
}
