import { GestureResponderEvent, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { Popable, usePopable } from "react-native-popable";

interface Props {
  icon: IconSource;
  size: number;
  onPress: (e: GestureResponderEvent) => void;
  tooltipText: string;
  style?: StyleProp<ViewStyle>;
  tooltipPosition?: "top"|"bottom"|"left"|"right"
}

/**
 * A react native paper IconButton with a tooltip, using a view for styling.
 */
export default function TooltipIconButton({ icon, size, onPress, tooltipText, style,
  tooltipPosition="top" }: Props) {

  // required because IconButton doesn't let mouse hover pass through
  const [ref, { hide, show }] = usePopable();

  return (
    <Popable
      content={tooltipText}
      style={style}
      action="hover"
      ref={ref}
      position={tooltipPosition}
    >
      {/* i should really replace this with an Icon, but that would require me to figure out how
          much padding it needs and i don't really feel like doing that right now */}
      <IconButton
        icon={icon}
        size={size}
      />
      <Pressable
        style={{
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
        onHoverIn={() => show()}
        onHoverOut={() => hide()}
        onPress={(e: GestureResponderEvent) => {
          // prevent any links that the button is on top of from triggering
          e.stopPropagation();
          e.preventDefault();
          onPress(e);
        }}
      />
    </Popable>
  );
}