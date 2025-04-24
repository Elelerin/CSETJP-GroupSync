/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import Colors from '@/constants/Colors';

type ThemeColor = (keyof typeof Colors.light.colors & keyof typeof Colors.dark.colors);
// for backwards-compatability with existing stuff
type LegacyThemeColor = "textPrimary" | "textSecondary" | "backgroundPrimary" |
                        "backgroundSecondary" | "highlight"

const themeColorLookup: { [key: string]: ThemeColor } = {
    textPrimary: "secondary",
    textSecondary: "surfaceVariant",
    backgroundPrimary: "surface",
    backgroundSecondary: "onSurface",
    highlight: "primary"
}

/**
 * Returns a named color in the current theme.
 */
export function useThemeColor(colorName: ThemeColor | LegacyThemeColor): string;
/**
 * Returns one of two colors depending on the current theme.
 */
export function useThemeColor(colors: { light: string, dark: string }): string;
export function useThemeColor(colorName: ThemeColor | LegacyThemeColor |
                             { light: string, dark: string }) {
    const theme = useColorScheme() ?? "light";

    // an object can be used to choose between colors that aren't in the theme
    if (typeof colorName === "object") {
        return colorName[theme];
    }
    else {
        // convert legacy colors
        if (Object.keys(themeColorLookup).includes(colorName)) {
            colorName = themeColorLookup[colorName];
        }

        return Colors[theme].colors[colorName as ThemeColor];
    }
}

// original expo useThemeColor()
// export function useThemeColor(
//   props: { light?: string; dark?: string },
//   colorName: keyof typeof Colors.light & keyof typeof Colors.dark
// ) {
//   const theme = useColorScheme() ?? 'light';
//   const colorFromProps = props[theme];

//   if (colorFromProps) {
//     return colorFromProps;
//   } else {
//     return Colors[theme][colorName];
//   }
// }
