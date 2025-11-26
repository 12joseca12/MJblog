import rawStyles from "./styles.json";
import type { Theme, ThemeColors, StylesJson } from "@/types";

const stylesJson = rawStyles as StylesJson;

export const styles = stylesJson;

export function getThemeStyles(theme: Theme) {
  const themeColors: ThemeColors = stylesJson.theme[theme];

  return {
    ...themeColors,
    radius: stylesJson.radius,
    spacing: stylesJson.spacing,
  };
}
