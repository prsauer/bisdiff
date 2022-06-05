import { EquippedItem } from "../proxy/api-types";

function computeStatDist(items: EquippedItem[], includeAll?: boolean) {
  const defaultVal = {
    value: 0,
    color: { r: 0, g: 0, b: 0, a: 0 },
  };
  const statsByName: Record<
    string,
    { value: number; color: { r: number; g: number; b: number; a: number } }
  > = {};
  items
    .filter((i) => i.stats)
    .map((i) => i.stats)
    .flat()
    .forEach((itemStats) => {
      const stats = itemStats!;
      if (statsByName[stats.type.name]) {
        statsByName[stats.type.name].value += stats.value;
      } else {
        statsByName[stats.type.name] = {
          value: stats.value,
          color: stats.display.color,
        };
      }
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

export function StatsHisto(props: { items: EquippedItem[] }) {
  const dist = computeStatDist(props.items).sort(
    (a, b) => b.stat.value - a.stat.value
  );
  const total = dist.reduce((prev, cur) => cur.stat.value + prev, 0);
  return (
    <>
      <div>Ladder-Bests Stat Distribution</div>
      <div style={{ display: "flex", flexDirection: "row", width: 600 }}>
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
              <div
                key={i.name}
                style={{
                  flex: `${(100 * i.stat.value) / total}`,
                  backgroundColor: colors[idx],
                }}
              >
                {i.name[0]} {pct}%
              </div>
            );
          })}
      </div>
    </>
  );
}
