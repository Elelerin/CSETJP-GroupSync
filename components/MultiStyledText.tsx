import { Fragment, ReactNode } from "react";
import { ColorValue, StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

export interface MultiStyledTextItem {
  type: "text",
  content: ReactNode,
  style: StyleProp<TextStyle>
};
export interface MultiStyledTextDivider {
  type: "divider",
  width: number,
  color: ColorValue,
  margin: number
}
interface MultiStyledTextProps {
  content: (MultiStyledTextItem | MultiStyledTextDivider)[],
  topLevelStyle?: StyleProp<ViewStyle>
}

/**
 * A component with multiple styles of text and/or dividers.
 */
export default function MultiStyledText({ content, topLevelStyle }: MultiStyledTextProps) {
  if (content.length === 0) {
    return <View style={topLevelStyle}></View>;
  }

  return (
    <View style={[topLevelStyle, { display: "flex", flexDirection: "row" }]}>
      {content.map((c) => {
        if (c.type === "text") {
          return (
            <Fragment>
              <Text style={[c.style, {}]}>{c.content}</Text>
            </Fragment>
          );
        }
        else {
          return (
            <Fragment>
              <View style={{
                width: c.width,
                height: "100%",
                backgroundColor: c.color,
                marginHorizontal: c.margin
              }} />
            </Fragment>
          );
        }
      })}
    </View>
  );
}