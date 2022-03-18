import { PageContainer } from "../design/PageContainer";

const rawFromLua = {
  sparkWidth: 10,
  iconSource: -1,
  authorOptions: {},
  yOffset: -120,
  anchorPoint: "CENTER",
  sparkRotation: 0,
  sparkRotationMode: "AUTO",
  actions: { start: {}, finish: {}, init: {} },
  triggers: {
    "1": {
      trigger: {
        useName: true,
        subeventSuffix: "_CAST_START",
        event: "Health",
        subeventPrefix: "SPELL",
        spellIds: {},
        unit: "player",
        auranames: ["Combustion"],
        names: {},
        type: "aura2",
        debuffType: "HELPFUL",
      },
      untrigger: {},
    },
    activeTriggerMode: -10,
  },
  icon_color: [1, 1, 1, 1],
  internalVersion: 50,
  animation: {
    start: {
      easeStrength: 3,
      type: "none",
      duration_type: "seconds",
      easeType: "none",
    },
    main: {
      easeStrength: 3,
      type: "none",
      duration_type: "seconds",
      easeType: "none",
    },
    finish: {
      easeStrength: 3,
      type: "none",
      duration_type: "seconds",
      easeType: "none",
    },
  },
  barColor: [0.92549019607843, 0.015686274509804, 0.082352941176471, 1],
  desaturate: false,
  sparkOffsetY: 0,
  subRegions: [
    { type: "subbackground" },
    { type: "subforeground" },
    {
      text_text_format_p_time_precision: 1,
      text_text: "%p",
      text_shadowColor: [0, 0, 0, 1],
      text_selfPoint: "AUTO",
      text_automaticWidth: "Auto",
      text_fixedWidth: 64,
      anchorYOffset: 0,
      text_justify: "CENTER",
      rotateText: "NONE",
      type: "subtext",
      text_color: [1, 1, 1, 1],
      text_font: "Friz Quadrata TT",
      text_visible: true,
      text_shadowYOffset: -1,
      anchorXOffset: 0,
      text_wordWrap: "WordWrap",
      text_fontType: "None",
      text_anchorPoint: "INNER_LEFT",
      text_text_format_p_time_format: 0,
      text_text_format_p_format: "timed",
      text_fontSize: 12,
      text_text_format_p_time_dynamic_threshold: 60,
      text_shadowXOffset: 1,
    },
    {
      text_shadowXOffset: 1,
      text_text: "%n",
      text_shadowColor: [0, 0, 0, 1],
      text_selfPoint: "AUTO",
      text_automaticWidth: "Auto",
      text_fixedWidth: 64,
      anchorYOffset: 0,
      text_justify: "CENTER",
      rotateText: "NONE",
      type: "subtext",
      text_color: [1, 1, 1, 1],
      text_font: "Friz Quadrata TT",
      text_shadowYOffset: -1,
      text_wordWrap: "WordWrap",
      text_visible: true,
      text_anchorPoint: "INNER_RIGHT",
      text_fontType: "None",
      text_fontSize: 12,
      anchorXOffset: 0,
      text_text_format_n_format: "none",
    },
  ],
  height: 27,
  load: {
    use_class: true,
    talent: { multi: {} },
    spec: { multi: {} },
    class: { single: "MAGE", multi: { WARLOCK: true } },
    size: { multi: {} },
  },
  sparkBlendMode: "ADD",
  useAdjustededMax: false,
  selfPoint: "CENTER",
  icon: false,
  useAdjustededMin: false,
  regionType: "aurabar",
  backgroundColor: [0, 0, 0, 0.5],
  xOffset: -210,
  icon_side: "RIGHT",
  uid: "(44rdzVOVct",
  sparkTexture: "Interface\\\\CastingBar\\\\UI-CastingBar-Spark",
  sparkHeight: 30,
  texture: "Blizzard",
  config: {},
  zoom: 0,
  spark: false,
  id: "Combust",
  sparkHidden: "NEVER",
  width: 139,
  frameStrata: 1,
  anchorFrameType: "SCREEN",
  alpha: 1,
  sparkColor: [1, 1, 1, 1],
  inverse: false,
  sparkOffsetX: 0,
  orientation: "HORIZONTAL",
  conditions: {},
  information: {},
  parent: "Mage",
};

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
