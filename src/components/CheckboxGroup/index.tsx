import type { MemoExoticComponent, FC, ComponentType } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { observer } from '@formily/react';
import { Checkbox, type CheckboxProps, Box, FormControl } from '@mui/joy';
import { isEqual } from '@iimm/shared';

import type { FieldBaseProps } from '@/types/index';
import { useFieldProps, useFetchOptions } from '@/hooks/index';
import { ContentSizeMinHeight } from '@/utils/index';

import { FieldDecoratorBase } from '../FieldDecorator/FieldDecoratorBase';

export interface CheckboxGroupProps extends Omit<CheckboxProps, 'value' | 'onChange' | 'defaultValue' | 'label' | 'checked'>, Omit<FieldBaseProps<any>, 'children'> {
  ItemRender?: ComponentType<Omit<CheckboxProps, 'defaultChecked'>>,
  /** 排列方向
   * @default 'horizontal'
  */
  direction?: 'horizontal' | 'vertical',
  /** 条目的间距
   * @default 1.5
   */
  spacing?: number | string,
}

export const CheckboxGroup: MemoExoticComponent<FC<CheckboxGroupProps>> = observer((props: CheckboxGroupProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noField, xs, sm, md, lg, xl, value: valueProp, onChange: onChangeProp, defaultValue, options: optionsProp, size,
    error, color: colorProp, label, showLabel, labelProps, tooltip, tooltipIcon, tooltipProps, showFeedback, feedback, feedbackProps, feedbackStatus, required, fullWidth, width, contentCls, contentStyle,
    ItemRender = Checkbox, direction = 'horizontal',
    spacing = 1.5,
    ...restProps
  } = useFieldProps(props);
  const { options } = useFetchOptions(optionsProp);
  const [ value, onChange ] = useControllableValue<any>(props, { defaultValue: null });
  const onItemChange = useMemoizedFn((checked: boolean, option: any) => {
    const newValue = [ ...(value || []) ];
    const index = newValue.findIndex((ele: any) => isEqual(option, ele));
    if (props.readOnly || props.disabled || (checked && index !== -1 || (!checked && index === -1))) return;
    if (checked) {
      newValue.push(option);
      newValue.sort((a: any, b: any) => {
        const aIndex = options.findIndex((ele: any) => isEqual(a, ele));
        const bIndex = options.findIndex((ele: any) => isEqual(b, ele));
        return aIndex - bIndex;
      });
    } else {
      newValue.splice(index, 1);
    }
    onChange(newValue);
  });
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
      <Box
        role='group'
        sx={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          gap: spacing,
        }}
      >
        { options.map((option, i) => (
          <FormControl key={i}>
            <ItemRender
              checked={Boolean((value?.find((ele: any) => isEqual(option?.value, ele))))}
              label={option.label}
              disabled={option?.disabled}
              color={color}
              size={size}
              onChange={(e) => onItemChange(e.target.checked, option.value)}
              {...restProps}
            />
          </FormControl>
        ))}
      </Box>
    </FieldDecoratorBase>
  );
}, { displayName: 'FormilyJoyCheckboxGroup' });
