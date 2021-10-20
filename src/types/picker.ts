import type { TextStyle, ViewStyle } from "react-native";
import type { InputProps, DoneBarProps, BackdropAnimationType } from "../types";

export type PickerItem = {
  value: any;
  label: string;
  color?: string;
};

export type PickerProps = {
  androidCustomProps?: { [key: string]: any };
  backdropAnimation?: BackdropAnimationType;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  DoneBarComponent?: React.ElementType<DoneBarProps>;
  doneButtonLabel?: string;
  InputComponent?: React.ElementType<InputProps>;
  iosCustomProps?: { [key: string]: any };
  isNullable?: boolean;
  item?: PickerItem;
  items: Array<PickerItem>;
  mode?: "dialog" | "dropdown";
  onClose?: () => void;
  onItemChange: (item: PickerItem, index: number) => void;
  onOpen?: () => void;
  placeholder?: string;
  style?: ViewStyle;
  textInputStyle?: TextStyle;
  title?: string;
  touchableStyle?: ViewStyle;
};

export interface PickerInstance {
  open: () => void;
  close: () => void;
}
