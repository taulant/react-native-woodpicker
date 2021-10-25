import type { ViewStyle, TextStyle } from "react-native";
import type { InputProps, DoneBarProps, BackdropAnimationType } from "../types";

export type Mode = "date" | "time" | "datetime" | "countdown";
export type IOSDisplay = "default" | "compact" | "inline" | "spinner";
export type Display = "spinner" | "default" | "clock" | "calendar";
export type MinuteInterval = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;

export type DatePickerProps = {
  androidCustomProps?: { [key: string]: any };
  androidDisplay?: Display;
  androidMode?: Mode;
  backdropAnimation?: BackdropAnimationType;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  DoneBarComponent?: React.ElementType<DoneBarProps>;
  doneButtonLabel?: string;
  InputComponent?: React.ElementType<InputProps>;
  iosCompactHiddenStyle?: ViewStyle;
  iosCustomProps?: { [key: string]: any };
  iosDisplay?: IOSDisplay;
  iosMode?: Mode;
  is24Hour?: boolean;
  isNullable?: boolean;
  locale?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  minuteInterval?: MinuteInterval;
  neutralButtonLabel?: string;
  onClose?: () => void;
  onDateChange: (date: Date | null) => void;
  onOpen?: () => void;
  style?: ViewStyle;
  text: string;
  textColor?: string;
  textInputStyle?: TextStyle;
  timeZoneOffsetInMinutes?: number;
  title?: string;
  touchableStyle?: ViewStyle;
  value: Date | null;
};

export interface DatePickerInstance {
  open: () => void;
  close: () => void;
}
