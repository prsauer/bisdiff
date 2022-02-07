import { EquippedItem } from "./api-types";
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

function SlotTitle({ slotType, rank }: { slotType: string; rank: number }) {
  return <div style={{ fontSize: 14 }}>{slotType}</div>;
}

function mapRankToColor(rank: number) {
  if (rank === 0) {
    return "white";
  }
  if (rank < 3) {
    return "yellow";
  }
  if (rank === -1) {
    return "red";
  }
  return "white";
}

export function ItemSlot(props: ItemSlotProps) {
  const bestMatch = props.histo.findIndex((a) =>
    props.targetData.map((i) => `${i.item.id}`).includes(a.id)
  );

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
        <SlotTitle slotType={props.slotType} rank={bestMatch} />
        <EquipmentInfo
          item={morphItem(
            props.targetData.find((i) => i.slot.type === props.slotType)
          )}
          size={"small"}
          notext
        />
      </div>

      {props.histo.map((a, idx) => {
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
