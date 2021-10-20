import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";
import { PickerProps, PickerItem, InputProps, DoneBarProps } from "../types";

import { Animated } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import DefaultInputButton from "./InputButton";
import DefaultDoneBar from "./DoneBar";
import IOSPicker, { Props as IOSPickerProps } from "./IOSPicker";
import AndroidPicker, { Props as AndroidPickerProps } from "./AndroidPicker";
import { DEFAULT_BACKDROP_ANIMATION } from "../constants/animation";
import { getAnimatedProperties } from "../helpers/animation";
import { isIOS } from "../helpers/iphone";
import { EMPTY_ITEM } from "../constants/item";
import { PickerInstance } from "../types/picker";

const Picker = forwardRef(
  (
    {
      item,
      items,
      onItemChange,
      disabled = false,
      placeholder = "",
      title = "",
      mode = "dialog",
      doneButtonLabel = "",
      isNullable = false,
      onOpen = () => null,
      onClose = () => null,
      style,
      containerStyle,
      textInputStyle,
      touchableStyle,
      InputComponent,
      DoneBarComponent,
      backdropAnimation = DEFAULT_BACKDROP_ANIMATION,
      androidCustomProps,
      iosCustomProps,
    }: PickerProps,
    ref: Ref<PickerInstance>
  ): JSX.Element => {
    const [show, setShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(
      item
        ? items.find(
            ({ label, value }) => label === item.label && value === item.value
          ) || EMPTY_ITEM
        : isNullable
        ? EMPTY_ITEM
        : items[0]
    );
    const fadeAnimationValue = useRef(new Animated.Value(0)).current;

    const animationProperties = useMemo(
      () => getAnimatedProperties(backdropAnimation),
      [backdropAnimation]
    );

    useImperativeHandle(
      ref,
      () => ({
        open: () => setShow(true),
        close: () => setShow(false),
      }),
      []
    );
    useEffect(() => {
      const nullableItems = isNullable ? [EMPTY_ITEM, ...items] : items;
      const itemIndex = nullableItems.findIndex(
        ({ label }) => label === item?.label
      );
      if (itemIndex !== -1) {
        setSelectedItem(nullableItems[itemIndex]);
      }
    }, [item]);

    const handleItemChange = (value: PickerItem, index: number) => {
      const nullableItems = isNullable ? [EMPTY_ITEM, ...items] : items;

      const newSelectedItem =
        nullableItems.find((currentItem) => value === currentItem.value) ||
        EMPTY_ITEM;

      if (!isIOS) {
        onItemChange(newSelectedItem, index);
      }

      setSelectedItem(newSelectedItem);
    };

    const toggle = () => {
      setShow((state) => !state);
    };

    useEffect(() => {
      if (show && onOpen) {
        onOpen();
      }

      if (!show && onClose) {
        onClose();
      }
      // Only execute
    }, [show]);

    const togglePicker = () => {
      if (disabled) {
        return;
      }

      if (!show) {
        toggle();
      }

      Animated.timing(fadeAnimationValue, {
        toValue: !show ? animationProperties.opacity : 0,
        duration: !show ? animationProperties.duration : 0,
        delay: !show ? animationProperties.delay : 0,
        useNativeDriver: true,
      }).start(show ? toggle : undefined);
    };

    const onDonePress = () => {
      togglePicker();
      const itemIndex = (isNullable ? [EMPTY_ITEM, ...items] : items).findIndex(
        ({ value }) => value === selectedItem.value
      );
      onItemChange(selectedItem, itemIndex);
    };

    const renderPickerItems = (): Array<JSX.Element> => {
      const tempItems = isNullable ? [EMPTY_ITEM, ...items] : items;
      return tempItems.map((current) => {
        return (
          <RNPicker.Item
            label={current.label}
            value={current.value}
            key={current.label}
          />
        );
      });
    };

    const renderPlaceholder = () => {
      if (item && item.label) {
        return item.label;
      }
      return placeholder;
    };

    const renderInputButton = () => {
      const inputProps: InputProps = {
        togglePicker,
        style,
        text: renderPlaceholder(),
        textInputStyle,
        touchableStyle,
        isNullable: false, // DatePicker only
        resetValue: undefined,
        renderHiddenCompactIOSPicker: () => null, //DatePicker only
      };
      const RenderComponent = InputComponent
        ? InputComponent
        : DefaultInputButton;
      return <RenderComponent {...inputProps} />;
    };

    const renderDoneBarButton = () => {
      const barProps: DoneBarProps = {
        title,
        doneButtonLabel,
        onDonePress,
      };
      const RenderComponent = DoneBarComponent
        ? DoneBarComponent
        : DefaultDoneBar;
      return <RenderComponent {...barProps} />;
    };

    const pickerProps = {
      selectedItem,
      disabled,
      title,
      renderPickerItems,
      renderInput: renderInputButton,
      onItemChange: handleItemChange,
      togglePicker,
      containerStyle,
    };

    if (isIOS) {
      const iosProps: IOSPickerProps = {
        ...pickerProps,
        show,
        renderDoneBar: renderDoneBarButton,
        togglePicker,
        containerStyle,
        animationValue: fadeAnimationValue,
        customProps: iosCustomProps || {},
      };
      return <IOSPicker {...iosProps} />;
    }
    const androidProps: AndroidPickerProps = {
      ...pickerProps,
      mode,
      customProps: androidCustomProps || {},
    };

    return <AndroidPicker {...androidProps} />;
  }
);

export default Picker;
