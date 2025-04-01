import { ReactNode } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

export interface MultiStyledTextItem {
    content: ReactNode,
    style: StyleProp<TextStyle>
};
interface MultiStyledTextProps {
    content: MultiStyledTextItem[],
    topLevelStyle?: StyleProp<TextStyle>
}

/**
 * A Text component with multiple styles.
 */
export default function MultiStyledText({ content, topLevelStyle }: MultiStyledTextProps) {
    if (content.length === 0) { return null; }
    // mash the top style onto the first content block
    content[0].style = [content[0].style, topLevelStyle];
    return getStyledText(content);
}

// recursively generates a text component for the first item in a styled text
function getStyledText(items: MultiStyledTextItem[]) {
    if (items.length === 0) { return null; }
    
    const thisItem = items[0];
    items.shift();
    return <Text style={thisItem.style}>{thisItem.content}{getStyledText(items)}</Text>
}