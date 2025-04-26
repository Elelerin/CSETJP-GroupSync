import { MD3DarkTheme } from "react-native-paper";

// const Colors = {
//   // TODO: make light theme actually light
//   light: {
//     textPrimary: '#ffffff',
//     textSecondary: '#c3c3c3',
//     backgroundPrimary: '#303030',
//     backgroundSecondary: '#202020',
//     highlight: '#a548e2',
//   },
//   dark: {
//     textPrimary: '#ffffff',
//     textSecondary: '#c3c3c3',
//     backgroundPrimary: '#303030',
//     backgroundSecondary: '#202020',
//     highlight: '#a548e2',
//   }
// };

const Colors = {
  dark: {
    ...MD3DarkTheme, // use the default theme for anything we don't override
    colors: {
      primary: '#a548e2',
      secondary: '#ffffff',
      onSecondary: '#ffffff',
      surfaceVariant: '#c3c3c3',
      surface: '#303030',
      onSurface: '#202020'
    }
  },
  light: {
    ...MD3DarkTheme, // use the default theme for anything we don't override
    colors: {
      primary: '#a548e2',
      secondary: '#ffffff',
      onSecondary: '#ffffff',
      surfaceVariant: '#c3c3c3',
      surface: '#303030',
      onSurface: '#202020'
    }
  }
};

export default Colors;
