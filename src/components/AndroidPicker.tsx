import React, { forwardRef, Ref } from "react";
import { View, ViewStyle } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { styles } from "../helpers/stylesHelper";
import { PickerItem } from "../types";
import { AndroidPickerInstance } from "../types/picker";

export type Props = {
  selectedItem: any;
  disabled?: boolean;
  title?: string;
  mode?: "dialog" | "dropdown";
  renderInput: () => JSX.Element;
  renderPickerItems: () => Array<JSX.Element>;
  onItemChange:
    | ((itemValue: PickerItem, itemIndex: number) => void)
    | undefined;
  containerStyle?: ViewStyle;
  customProps: { [key: string]: any };
};

const AndroidPicker = forwardRef(
  (
    {
      selectedItem,
      disabled,
      title,
      mode,
      renderInput,
      renderPickerItems,
      onItemChange,
      containerStyle,
      customProps,
    }: Props,
    ref: Ref<AndroidPickerInstance>
  ): JSX.Element => {
    return (
      <View style={containerStyle}>
        {renderInput()}
        <RNPicker
          ref={ref}
          style={styles.androidPickerContainer}
          prompt={title}
          // @ts-ignore
          onValueChange={onItemChange}
          selectedValue={selectedItem.value}
          mode={mode || "dialog"}
          enabled={!disabled}
          {...customProps}
        >
          {renderPickerItems()}
        </RNPicker>
      </View>
    );
  }
);

export default AndroidPicker;
