import { GestureResponderEvent, StyleProp, View, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface Props {
  icon: IconSource;
  size: number;
  onPress: (e: GestureResponderEvent) => void;
  tooltipText: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A react native paper IconButton with a tooltip, using a view for styling.
 */
export default function TooltipIconButton({ icon, size, onPress, tooltipText, style }: Props) {
  return (
    <View style={[style, {flexDirection: "row", alignItems: "flex-start"}]}>
      {/* <Tooltip
        title={tooltipText}
        enterTouchDelay={500}
        leaveTouchDelay={500}
      > */}
        <IconButton
          icon={icon}
          size={size}
          onPress={(e: GestureResponderEvent) => {
            // prevent any links that the button is on top of from triggering
            e.stopPropagation();
            e.preventDefault();
            onPress(e);
          }}
        />
      {/* </Tooltip> */}
    </View>
  );
}