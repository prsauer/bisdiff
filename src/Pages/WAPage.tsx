import { PageContainer } from "../design/PageContainer";

function Minimap() {
  // Convert pixels to screen space for css display
  const scale = 0.75;
  // WoW ui setting
  const uiScale = 0.9;
  // Convert WOW ui-units to pixels
  const waScaleFactor = 1920 / (1365 / uiScale);

  const windowWidth = 1920 * scale;
  const windowHeight = 1080 * scale;

  const barWidth = 139 * scale * waScaleFactor;
  const barHeight = 27 * scale * waScaleFactor;

  const xOffset = -210 * scale * waScaleFactor;
  const yOffset = -120 * -1 * scale * waScaleFactor;

  const anchorPointX = windowWidth / 2;
  const anchorPointY = windowHeight / 2;

  const leftPoint = anchorPointX + xOffset - barWidth / 2;
  const topPoint = anchorPointY + yOffset - barHeight / 2;

  const rightBarText = "Combustion";
  const leftBarText = "54";

  return (
    <div
      style={{
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "yellow",
        backgroundImage: 'url("WoWScrnShot_031222_141817.jpg")',
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          margin: 0,
          padding: 0,
          left: leftPoint,
          top: topPoint,
          width: barWidth,
          height: barHeight,
          backgroundColor: "red",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 3,
            height: "100%",
            fontSize: 12,
            margin: 0,
            padding: 0,
            lineHeight: `${barHeight}px`,
          }}
        >
          {leftBarText}
        </div>
        <div
          style={{
            position: "absolute",
            right: 3,
            height: "100%",
            fontSize: 12,
            margin: 0,
            padding: 0,
            lineHeight: `${barHeight}px`,
          }}
        >
          {rightBarText}
        </div>
      </div>
    </div>
  );
}

export function WAPage() {
  return (
    <PageContainer>
      <div style={{ marginTop: 12, color: "gray" }}>Test WeakAura deisgn</div>
      <Minimap />
    </PageContainer>
  );
}
