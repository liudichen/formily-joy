import type { MemoExoticComponent, FC } from 'react';
import { useControllableValue } from 'ahooks';
import { observer } from '@formily/react';
import { Textarea as JoyTextarea, type TextareaProps as JoyTextareaProps } from '@mui/joy';

import type { FieldBaseProps } from '@/types/index';
import { useFieldProps } from '@/hooks/index';
import { FieldDecoratorBase } from '../FieldDecorator/FieldDecoratorBase';

export interface TextareaProps extends Omit<JoyTextareaProps, 'value' | 'onChange' | 'defaultValue'>, Omit<FieldBaseProps<string>, 'children'> {

}

export const Textarea: MemoExoticComponent<FC<TextareaProps>> = observer((props: TextareaProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noField, xs, sm, md, lg, xl, value: valueProp, onChange: onChangeProp, defaultValue, options, size,
    error, color, label, showLabel, labelProps, tooltip, tooltipIcon, tooltipProps, showFeedback, feedback, feedbackProps, feedbackStatus, required, fullWidth, width, contentCls, contentStyle,
    ...restProps
  } = useFieldProps<string, any, TextareaProps>(props);
  const [ value, onChange ] = useControllableValue(props, { defaultValue: '' });
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
      <JoyTextarea
        size={size}
        required={required}
        value={value}
        onChange={(e) => {
          if (!props.disabled && !props.readOnly) {
            onChange(e.target.value);
          }
        } }
        {...restProps}
      />
    </FieldDecoratorBase>
  );
}, { displayName: 'FormilyJoyTextarea' });
