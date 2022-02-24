import { useState } from "react";
import { TappableText } from "../design/TappableText";
import { EquippedItem, MatchQuality } from "../proxy/api-types";
import { EquipmentInfo } from "./EquipmentInfo";

interface ItemSlotProps {
  histo: {
    id: string;
    count: number;
    percent: number;
    item: EquippedItem;
  }[];
  slotType: string;
  targetData: EquippedItem[];
  profilesComparedCount: number;
  showAll: boolean;
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
  quality,
  onClick,
}: {
  slotType: string;
  quality: MatchQuality;
  onClick?: () => void;
}) {
  return (
    <TappableText onClick={onClick} style={{ fontSize: 14 }} text={slotType} />
  );
}

export function ItemSlot(props: ItemSlotProps) {
  const [expanded, setExpanded] = useState(false);
  const bestMatch = props.histo.findIndex((a) =>
    props.targetData.map((i) => `${i.item.id}`).includes(a.id)
  );
  const histoSameSlot = props.histo.filter(
    (a) => a.item.slot.type === props.slotType
  );
  const goodIlvl =
    histoSameSlot.reduce((prev, cur) => prev + cur.item.level.value, 0) /
    histoSameSlot.length;

  const myEquipped = props.targetData.filter(
    (i) => i.slot.type === props.slotType
  );

  const comparedTo = histoSameSlot.find((a) =>
    myEquipped.map((i) => `${i.item.id}`).includes(a.id)
  );
  const indexOfComparedTo = histoSameSlot.findIndex((a) =>
    myEquipped.map((i) => `${i.item.id}`).includes(a.id)
  );

  const percentOfMatch = comparedTo?.percent || 0;
  let qualityOfMatch =
    percentOfMatch > 45 ? MatchQuality.GREEN : MatchQuality.YELLOW;

  if (percentOfMatch < 25) {
    if (['FINGER_1', 'FINGER_2'].includes(props.slotType) && [0,1].includes(indexOfComparedTo)) {
      qualityOfMatch = MatchQuality.GREEN;
    } else {
      qualityOfMatch = MatchQuality.RED;
    }
  }
  if (indexOfComparedTo === 0) {
    qualityOfMatch = MatchQuality.GREEN;
  }

  /* Handle edge case for empty slots */
  const totalSeen = histoSameSlot.reduce((cur, prev) => cur + prev.count, 0);
  const percentEmpty = 100*(props.profilesComparedCount - totalSeen)/props.profilesComparedCount;
  const isEmptyForTarget = myEquipped.length === 0;

  if (isEmptyForTarget && percentEmpty > 75) {
    qualityOfMatch = MatchQuality.GREEN;
  }

  const borderColorMap = {
    [MatchQuality.RED]: "red",
    [MatchQuality.GREEN]: "green",
    [MatchQuality.YELLOW]: "yellow",
  };
  const bgColorMap = {
    [MatchQuality.RED]: "#7c1010",
    [MatchQuality.GREEN]: "black",
    [MatchQuality.YELLOW]: "#6c5300",
  };

  const histoToShow = expanded ? props.histo : props.histo.slice(0, 3);
  if (!expanded && bestMatch > 2) {
    histoToShow[2] = props.histo[bestMatch];
  }

  if (!props.showAll && bestMatch === 0) {
    return null;
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
        borderWidth: 2,
        borderColor: borderColorMap[qualityOfMatch],
        backgroundColor: bgColorMap[qualityOfMatch],
        opacity: bestMatch === 0 ? 0.75 : 1.0,
        minWidth: 120,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SlotTitle
          slotType={props.slotType}
          quality={qualityOfMatch}
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
      {myEquipped.map((a, i) => (
        <div key={i}>{(a.level.value - goodIlvl).toFixed(1)} ilvls</div>
      ))}

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
            {indexOfComparedTo === idx && (
              <CurrentMarker i={idx}>*</CurrentMarker>
            )}
            <EquipmentInfo notext item={morphItem(a.item)} size={"small"} />
            {a.percent.toFixed(1)}%
          </div>
        );
      })}
      { percentEmpty > 5 && <div>{ isEmptyForTarget && "*" }{percentEmpty.toFixed(1)}% empty</div>}
    </div>
  );
}
