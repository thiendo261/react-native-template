import { useThrottle } from '@hooks';
import { compareMemo } from '@utilities';
import { forwardRef, useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

export interface PressAreaProps extends PressableProps {
  throttle?: number;
  hitSlop?: number;
  pressInStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const PressArea = compareMemo<View, PressAreaProps>(
  forwardRef(
    ({ throttle = duration({ seconds: 0.5 }), onPress, pressInStyle, style, ...props }, ref) => {
      const handleOnPress = useThrottle(onPress || (() => null), [onPress], throttle);

      const handleStateStyle = useCallback(
        ({ pressed }: PressableStateCallbackType) => [style, pressed && pressInStyle],
        [style, pressInStyle],
      );

      return (
        <Pressable
          {...props}
          ref={ref}
          android_disableSound={true}
          android_ripple={null}
          pressRetentionOffset={(props.hitSlop || 0) * 2}
          onPress={throttle ? handleOnPress : onPress}
          style={handleStateStyle}
        />
      );
    },
  ),
);

export default PressArea;
