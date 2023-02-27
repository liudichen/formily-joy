import type { MemoExoticComponent, FC, ComponentType } from 'react';
import { useControllableValue } from 'ahooks';
import { observer } from '@formily/react';
import { RadioGroup as JoyRadioGroup, type RadioGroupProps as JoyRadioGroupProps, Radio, type RadioProps } from '@mui/joy';

import type { FieldBaseProps } from '@/types/index';
import { useFieldProps, useFetchOptions } from '@/hooks/index';
import { ContentSizeMinHeight } from '@/utils/index';

import { FieldDecoratorBase } from '../FieldDecorator/FieldDecoratorBase';

export interface RadioGroupProps extends Omit<JoyRadioGroupProps, 'value' | 'onChange' | 'defaultValue' | 'options'>, Omit<FieldBaseProps<any[]>, 'children'> {
  RadioRender?: ComponentType<Partial<RadioProps>>,
  /** orientation的别名,如果定义了orientation则direction不会生效
   * @default 'horizontal'
  */
  direction?: 'horizontal' | 'vertical',
  /** 条目的间距
   * @default 1.5
   */
  spacing?: number | string,
  radioProps?: Omit<RadioGroupProps, 'label' | 'value' | 'onChange'>,
}

export const RadioGroup: MemoExoticComponent<FC<RadioGroupProps>> = observer((props: RadioGroupProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noField, xs, sm, md, lg, xl, value: valueProp, onChange: onChangeProp, defaultValue, options: optionsProp, size,
    error, color: colorProp, label, showLabel, labelProps, tooltip, tooltipIcon, tooltipProps, showFeedback, feedback, feedbackProps, feedbackStatus, required, fullWidth, width, contentCls, contentStyle,
    RadioRender = Radio, direction = 'horizontal', orientation,
    spacing = 1.5, radioProps,
    ...restProps
  } = useFieldProps(props);
  const { options } = useFetchOptions(optionsProp);
  const [ value, onChange ] = useControllableValue<any>(props, { defaultValue: null });
  const color = error ? 'danger' : colorProp;
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
      <JoyRadioGroup
        color={color}
        orientation={orientation ?? direction}
        size={size}
        value={value}
        onChange={(e) => {
          if (!props.disabled && !props.readOnly) {
            onChange(e.target.value);
          }
        } }
        {...restProps}
      >
        { options.map((option, i) => (
          <RadioRender
            value={option.value}
            label={option.label}
            disabled={option?.disabled}
            key={i}
            sx={i ? { ...((orientation ?? direction) === 'horizontal' ? { ml: spacing } : { mt: spacing }) } : undefined}
            {...radioProps}
          />
        ))}
      </JoyRadioGroup>
    </FieldDecoratorBase>
  );
}, { displayName: 'FormilyJoyRadioGroup' });
