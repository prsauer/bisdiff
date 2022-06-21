import { EquippedItem } from "../proxy/api-types";

function computeStatDist(
  items: {
    id: string;
    count: number;
    percent: number;
    item: EquippedItem;
  }[],
  includeAll?: boolean
) {
  const defaultVal = {
    value: 0,
    color: { r: 0, g: 0, b: 0, a: 0 },
  };
  const statsByName: Record<
    string,
    { value: number; color: { r: number; g: number; b: number; a: number } }
  > = {};
  items
    .filter((i) => i.item.stats)
    .forEach((i) => {
      const stats = i.item.stats!;
      stats.forEach((stat) => {
        if (statsByName[stat.type.name]) {
          statsByName[stat.type.name].value += stat.value * i.percent;
        } else {
          statsByName[stat.type.name] = {
            value: stat.value * i.percent,
            color: stat.display.color,
          };
        }
      });
    });
  if (includeAll) {
    throw new Error("NYI");
  }
  return [
    {
      name: "Haste",
      stat: statsByName["Haste"] || defaultVal,
    },
    {
      name: "Critical Strike",
      stat: statsByName["Critical Strike"] || defaultVal,
    },
    {
      name: "Mastery",
      stat: statsByName["Mastery"] || defaultVal,
    },
    {
      name: "Versatility",
      stat: statsByName["Versatility"] || defaultVal,
    },
  ];
}

export function StatsHisto(props: {
  title: string;
  items: {
    id: string;
    count: number;
    percent: number;
    item: EquippedItem;
  }[];
}) {
  const dist = computeStatDist(props.items).sort(
    (a, b) => b.stat.value - a.stat.value
  );
  const total = dist.reduce((prev, cur) => cur.stat.value + prev, 0);
  return (
    <>
      <div>{props.title}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: 950,
        }}
      >
        {dist
          .filter((i) => i.stat.value > 0)
          .map((i, idx) => {
            const colors = [
              "rgb(82 78 116)",
              "rgb(55 135 58)",
              "rgb(163 14 6)",
              "rgb(59 52 165)",
            ];
            const pct = Math.round((100 * i.stat.value) / total);
            return (
              <>
                <div
                  key={i.name}
                  style={{
                    paddingLeft: 4,
                    flex: `${(100 * i.stat.value) / total}`,
                    backgroundColor: colors[idx],
                  }}
                >
                  {i.name[0]} {pct}%
                </div>
                <div key={i.name + "-sep"} style={{ width: 4, height: 1 }} />
              </>
            );
          })}
      </div>
    </>
  );
}
