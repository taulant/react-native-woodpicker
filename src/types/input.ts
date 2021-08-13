import type { ViewStyle, TextStyle, GestureResponderEvent } from "react-native";

export type InputProps = {
  isCompactHiddenPickerNeeded?: boolean;
  isNullable?: boolean;
  renderHiddenCompactIOSPicker: () => JSX.Element | null;
  resetValue?: () => void;
  style?: ViewStyle;
  text?: string;
  textInputStyle?: TextStyle;
  togglePicker: (event: GestureResponderEvent) => void;
  touchableStyle?: ViewStyle;
};
