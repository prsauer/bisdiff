local json = require("json")

r = {
    ["sparkWidth"] = 10,
    ["iconSource"] = -1,
    ["authorOptions"] = {},
    ["yOffset"] = -120,
    ["anchorPoint"] = "CENTER",
    ["sparkRotation"] = 0,
    ["sparkRotationMode"] = "AUTO",
    ["actions"] = {
        ["start"] = {},
        ["init"] = {},
        ["finish"] = {}
    },
    ["triggers"] = {
        [1] = {
            ["trigger"] = {
                ["useName"] = true,
                ["subeventSuffix"] = "_CAST_START",
                ["event"] = "Health",
                ["subeventPrefix"] = "SPELL",
                ["spellIds"] = {},
                ["unit"] = "player",
                ["type"] = "aura2",
                ["names"] = {},
                ["auranames"] = {
                    [1] = "Combustion"
                },
                ["debuffType"] = "HELPFUL"
            },
            ["untrigger"] = {}
        },
        ["activeTriggerMode"] = -10
    },
    ["icon_color"] = {
        [1] = 1,
        [2] = 1,
        [3] = 1,
        [4] = 1
    },
    ["internalVersion"] = 50,
    ["animation"] = {
        ["start"] = {
            ["type"] = "none",
            ["easeStrength"] = 3,
            ["duration_type"] = "seconds",
            ["easeType"] = "none"
        },
        ["main"] = {
            ["type"] = "none",
            ["easeStrength"] = 3,
            ["duration_type"] = "seconds",
            ["easeType"] = "none"
        },
        ["finish"] = {
            ["type"] = "none",
            ["easeStrength"] = 3,
            ["duration_type"] = "seconds",
            ["easeType"] = "none"
        }
    },
    ["barColor"] = {
        [1] = 0.92549019607843,
        [2] = 0.015686274509804,
        [3] = 0.082352941176471,
        [4] = 1
    },
    ["desaturate"] = false,
    ["sparkOffsetY"] = 0,
    ["subRegions"] = {
        [1] = {
            ["type"] = "subbackground"
        },
        [2] = {
            ["type"] = "subforeground"
        },
        [3] = {
            ["text_text_format_p_time_precision"] = 1,
            ["text_text"] = "%p",
            ["text_shadowColor"] = {
                [1] = 0,
                [2] = 0,
                [3] = 0,
                [4] = 1
            },
            ["text_selfPoint"] = "AUTO",
            ["text_automaticWidth"] = "Auto",
            ["text_fixedWidth"] = 64,
            ["anchorYOffset"] = 0,
            ["text_justify"] = "CENTER",
            ["rotateText"] = "NONE",
            ["type"] = "subtext",
            ["text_color"] = {
                [1] = 1,
                [2] = 1,
                [3] = 1,
                [4] = 1
            },
            ["text_font"] = "Friz Quadrata TT",
            ["text_shadowXOffset"] = 1,
            ["text_shadowYOffset"] = -1,
            ["text_text_format_p_time_dynamic_threshold"] = 60,
            ["text_wordWrap"] = "WordWrap",
            ["text_fontType"] = "None",
            ["text_anchorPoint"] = "INNER_LEFT",
            ["text_text_format_p_time_format"] = 0,
            ["text_text_format_p_format"] = "timed",
            ["text_fontSize"] = 12,
            ["anchorXOffset"] = 0,
            ["text_visible"] = true
        },
        [4] = {
            ["text_shadowXOffset"] = 1,
            ["text_text"] = "%n",
            ["text_shadowColor"] = {
                [1] = 0,
                [2] = 0,
                [3] = 0,
                [4] = 1
            },
            ["text_selfPoint"] = "AUTO",
            ["text_automaticWidth"] = "Auto",
            ["text_fixedWidth"] = 64,
            ["anchorYOffset"] = 0,
            ["text_justify"] = "CENTER",
            ["rotateText"] = "NONE",
            ["type"] = "subtext",
            ["text_color"] = {
                [1] = 1,
                [2] = 1,
                [3] = 1,
                [4] = 1
            },
            ["text_font"] = "Friz Quadrata TT",
            ["text_shadowYOffset"] = -1,
            ["text_wordWrap"] = "WordWrap",
            ["text_visible"] = true,
            ["text_anchorPoint"] = "INNER_RIGHT",
            ["text_text_format_n_format"] = "none",
            ["text_fontSize"] = 12,
            ["anchorXOffset"] = 0,
            ["text_fontType"] = "None"
        }
    },
    ["height"] = 27,
    ["load"] = {
        ["use_class"] = true,
        ["talent"] = {
            ["multi"] = {}
        },
        ["spec"] = {
            ["multi"] = {}
        },
        ["class"] = {
            ["single"] = "MAGE",
            ["multi"] = {
                ["WARLOCK"] = true
            }
        },
        ["size"] = {
            ["multi"] = {}
        }
    },
    ["sparkBlendMode"] = "ADD",
    ["useAdjustededMax"] = false,
    ["zoom"] = 0,
    ["parent"] = "Mage",
    ["icon"] = false,
    ["useAdjustededMin"] = false,
    ["regionType"] = "aurabar",
    ["backgroundColor"] = {
        [1] = 0,
        [2] = 0,
        [3] = 0,
        [4] = 0.5
    },
    ["xOffset"] = -210,
    ["icon_side"] = "RIGHT",
    ["sparkOffsetX"] = 0,
    ["sparkHeight"] = 30,
    ["texture"] = "Blizzard",
    ["sparkColor"] = {
        [1] = 1,
        [2] = 1,
        [3] = 1,
        [4] = 1
    },
    ["sparkTexture"] = "Interface\\\\CastingBar\\\\UI-CastingBar-Spark",
    ["spark"] = false,
    ["frameStrata"] = 1,
    ["sparkHidden"] = "NEVER",
    ["anchorFrameType"] = "SCREEN",
    ["alpha"] = 1,
    ["width"] = 139,
    ["id"] = "Combust",
    ["config"] = {},
    ["inverse"] = false,
    ["uid"] = "(44rdzVOVct",
    ["orientation"] = "HORIZONTAL",
    ["conditions"] = {},
    ["information"] = {},
    ["selfPoint"] = "CENTER"
}

jsonTable = json.encode(r)

deserialTable = json.decode(jsonTable)

print(deserialTable["selfPoint"])
print(r["selfPoint"])
