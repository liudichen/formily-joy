import type { MemoExoticComponent, FC } from 'react';
import { useControllableValue } from 'ahooks';
import { observer } from '@formily/react';
import { Input as JoyInput, type InputProps as JoyInputProps } from '@mui/joy';

import type { FieldBaseProps } from '@/types/index';
import { useFieldProps } from '@/hooks/index';
import { FieldDecoratorBase } from '../FieldDecorator/FieldDecoratorBase';

export interface InputProps extends Omit<JoyInputProps, 'value' | 'onChange' | 'defaultValue'>, Omit<FieldBaseProps<string | number>, 'children'> {

}

export const Input: MemoExoticComponent<FC<InputProps>> = observer((props: InputProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noField, xs, sm, md, lg, xl, value: valueProp, onChange: onChangeProp, defaultValue, options, size,
    error, color, label, showLabel, labelProps, tooltip, tooltipIcon, tooltipProps, showFeedback, feedback, feedbackProps, feedbackStatus, required, fullWidth, width, contentCls, contentStyle,
    ...restProps
  } = useFieldProps<string | number, any, InputProps>(props);
  const [ value, onChange ] = useControllableValue(props);
  return (
    <FieldDecoratorBase
      required={required}
      error={error}
      color={color}
      fullWidth={fullWidth}
      width={width}
      contentCls={contentCls}
      contentStyle={contentStyle}
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
      <JoyInput
        size={size}
        required={required}
        fullWidth={fullWidth}
        value={value}
        onChange={(e) => {
          if (!props.disabled && !props.readOnly) {
            onChange(props.type === 'number' && e.target.value ? +e.target.value : e.target.value);
          }
        } }
        {...restProps}
      />
    </FieldDecoratorBase>
  );
}, { displayName: 'FormilyJoyInput' });
