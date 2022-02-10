import { colors } from "./colors";

export const darkTheme = {
  Title: {
    color: "gray",
  },
  Hints: {
    color: "#343633",
  },
  Link: {
    color: "yellow",
  },
  Footer: {
    color: "#361440",
  },
  Root: {
    backgroundColor: colors.vampire,
  },
  NavBlade: {
    label: {
      color: colors.sunray,
      colorWhenSelected: colors.champers,
      colorOnHighlight: colors.violinBrown,
    },
  },
  PageContainer: {
    backgroundColor: "transparent",
  },
  Default: {
    color: "white",
  },
};

export type CustomThemeType = typeof darkTheme;

export const yellowTheme: CustomThemeType = {
  Title: {
    color: "white",
  },
  Hints: {
    color: "#343633",
  },
  Link: {
    color: "#F42272",
  },
  Footer: {
    color: "#361440",
  },
  Root: {
    backgroundColor: "#009DDC",
  },
  NavBlade: {
    label: {
      color: "#DEC1FF",
      colorWhenSelected: "#DAFFEF",
      colorOnHighlight: colors.violinBrown,
    },
  },
  PageContainer: {
    backgroundColor: "transparent",
  },
  Default: {
    color: "white",
  },
};
