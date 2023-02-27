import type { MemoExoticComponent, FC } from 'react';
import { useControllableValue } from 'ahooks';
import { observer } from '@formily/react';
import { Autocomplete, type AutocompleteProps } from '@mui/joy';
import { isEqual } from '@iimm/shared';

import type { FieldBaseProps, FieldPropsOptions, FieldObjOption } from '@/types/index';
import { useFieldProps, useFetchOptions } from '@/hooks/index';

import { FieldDecoratorBase } from '../FieldDecorator/FieldDecoratorBase';

export interface SelectProps<Multiple extends boolean | undefined = boolean, DisableClearable extends boolean | undefined = boolean, FreeSolo extends boolean | undefined = boolean > extends Omit<AutocompleteProps<any, Multiple, DisableClearable, FreeSolo>, 'value' | 'onChange' | 'defaultValue' | 'options'>, Omit<FieldBaseProps<Multiple extends true ? FieldObjOption[]: FieldObjOption>, 'children'> {
  options?: FieldPropsOptions,
}

export const Select: MemoExoticComponent<FC<SelectProps>> = observer((props: SelectProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noField, xs, sm, md, lg, xl, value: valueProp, onChange: onChangeProp, defaultValue, options: optionsProp, size,
    error, color, label, showLabel, labelProps, tooltip, tooltipIcon, tooltipProps, showFeedback, feedback, feedbackProps, feedbackStatus, required, fullWidth, width, contentCls, contentStyle,
    ...restProps
  } = useFieldProps(props);
  const { loading, options } = useFetchOptions(optionsProp);
  const [ value, onChange ] = useControllableValue(props, { defaultValue: props.multiple ? [] : null });
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
      <Autocomplete
        size={size}
        options={options}
        loading={loading}
        isOptionEqualToValue={(option: FieldObjOption, value: FieldObjOption) => isEqual(option?.value, value?.value) }
        required={required}
        value={value}
        onChange={(_e, value) => {
          if (!props.disabled && !props.readOnly) {
            onChange(value);
          }
        } }
        {...restProps}
      />
    </FieldDecoratorBase>
  );
}, { displayName: 'FormilyJoySelect' });
