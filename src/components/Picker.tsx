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

import { Animated, Platform } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import DefaultInputButton from "./InputButton";
import DefaultDoneBar from "./DoneBar";
import IOSPicker, { Props as IOSPickerProps } from "./IOSPicker";
import AndroidPicker, { Props as AndroidPickerProps } from "./AndroidPicker";
import { DEFAULT_BACKDROP_ANIMATION } from "../constants/animation";
import { getAnimatedProperties } from "../helpers/animation";
import { isIOS } from "../helpers/iphone";
import { EMPTY_ITEM } from "../constants/item";
import { PickerInstance, AndroidPickerInstance } from "../types/picker";

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
      itemFontFamily,
      itemColor,
      InputComponent,
      DoneBarComponent,
      backdropAnimation = DEFAULT_BACKDROP_ANIMATION,
      androidCustomProps,
      iosCustomProps,
    }: PickerProps,
    ref: Ref<PickerInstance>
  ): JSX.Element => {
    const isAndroid = Platform.OS === "android";
    const androidPickerRef = useRef<AndroidPickerInstance>(null);

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
    const [initialised, setInitialised] = useState(false);
    const fadeAnimationValue = useRef(new Animated.Value(0)).current;

    const animationProperties = useMemo(
      () => getAnimatedProperties(backdropAnimation),
      [backdropAnimation]
    );

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setShow(true);
          if (isAndroid) {
            androidPickerRef.current?.focus();
          }
        },
        close: () => {
          setShow(false);

          if (isAndroid) {
            androidPickerRef.current?.blur();
          }
        },
      }),
      []
    );

    const handleItemChange = (value: PickerItem, index: number) => {
      const nullableItems = isNullable ? [EMPTY_ITEM, ...items] : items;

      const newSelectedItem =
        nullableItems.find((currentItem) => value === currentItem.value) ||
        EMPTY_ITEM;

      onItemChange(newSelectedItem, index);

      setSelectedItem(newSelectedItem);
    };

    const handleAndroidPickerBlur = () => {
      setShow(false);
      androidCustomProps?.onBlur?.();
    };

    const handleAndroidPickerFocus = () => {
      setShow(true);
      androidCustomProps?.onFocus?.();
    };

    const toggle = () => {
      setShow((state) => !state);
    };

    const togglePicker = () => {
      if (disabled) {
        return;
      }

      // Handle Android picker input toggle
      if (isAndroid) {
        toggle();
        return;
      }

      // Handle iOS and other picker input toggle
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

    useEffect(() => {
      setInitialised(true);
    }, []);

    useEffect(() => {
      if (show && initialised) {
        onOpen && onOpen();
        if (isAndroid) {
          androidPickerRef.current?.focus();
        }
      }

      if (!show && initialised) {
        onClose && onClose();
        if (isAndroid) {
          androidPickerRef.current?.blur();
        }
      }

      // Only execute when show changes
    }, [show]);

    useEffect(() => {
      const nullableItems = isNullable ? [EMPTY_ITEM, ...items] : items;
      const itemIndex = nullableItems.findIndex(
        ({ label }) => label === item?.label
      );
      if (itemIndex !== -1) {
        setSelectedItem(nullableItems[itemIndex]);
      }
    }, [item]);

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
            fontFamily={
              current.fontFamily ? current.fontFamily : itemFontFamily
            }
            color={current.color ? current.color : itemColor}
          />
        );
      });
    };

    const renderPlaceholder = () => {
      if (item && item.label) {
        return item.label;
      }
      if (!isNullable && selectedItem.label) {
        return selectedItem.label;
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
      onBlur: handleAndroidPickerBlur,
      onFocus: handleAndroidPickerFocus,
    };

    return <AndroidPicker ref={androidPickerRef} {...androidProps} />;
  }
);

export default Picker;
