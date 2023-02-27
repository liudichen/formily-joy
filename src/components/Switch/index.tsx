import type { MemoExoticComponent, FC } from 'react';
import { useControllableValue } from 'ahooks';
import { observer } from '@formily/react';
import { Switch as JoySwitch, type SwitchProps as JoySwitchProps } from '@mui/joy';

import type { FieldBaseProps } from '@/types/index';
import { useFieldProps } from '@/hooks/index';
import { ContentSizeMinHeight } from '@/utils/index';

import { FieldDecoratorBase } from '../FieldDecorator/FieldDecoratorBase';

export interface SwitchProps extends Omit<JoySwitchProps, 'value' | 'onChange' |'defaultValue' | 'options'>, Omit<FieldBaseProps<boolean>, 'children'> {
}

export const Switch: MemoExoticComponent<FC<SwitchProps>> = observer((props: SwitchProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noField, xs, sm, md, lg, xl, value: valueProp, onChange: onChangeProp, defaultValue, options, size, checked,
    error, color, label, showLabel, labelProps, tooltip, tooltipIcon, tooltipProps, showFeedback, feedback, feedbackProps, feedbackStatus, required, fullWidth, width, contentCls, contentStyle,
    ...restProps
  } = useFieldProps<boolean, any, SwitchProps>(props);
  const [ value, onChange ] = useControllableValue(props);
  return (
    <FieldDecoratorBase
      required={required}
      error={error}
      color={color}
      fullWidth={fullWidth}
      width={width}
      contentCls={contentCls}
      contentStyle={{
        minHeight: `calc(${ContentSizeMinHeight[size || 'md']} + 2px)`,
        display: 'flex',
        alignItems: 'center',
        ...contentStyle,
      }}
      showLabel={showLabel}
      label={label}
      labelProps={labelProps}
      showFeedback={showFeedback}
      feedback={feedback}
      feedbackProps={feedbackProps}
      feedbackStatus={feedbackStatus}
      tooltip={tooltip}
      tooltipIcon={tooltipIcon}
      tooltipProps={tooltipProps}
    >
      <JoySwitch
        color={color}
        size={size}
        checked={value || false}
        onChange={(e) => {
          if (!props.disabled && !props.readOnly) {
            onChange(e.target.checked);
          }
        } }
        {...restProps}
      />
    </FieldDecoratorBase>
  );
}, { displayName: 'FormilyJoySwitch' });
