import type { FC, MemoExoticComponent } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useParentForm, observer } from '@formily/react';
import type { IFieldResetOptions, Form } from '@formily/core';
import { Button, type ButtonProps } from '@mui/joy';

export interface ResetProps extends ButtonProps {
  options?: IFieldResetOptions,
  onResetValidateSuccess?: (payload: any) => void,
  onResetValidateFailed?: (error: Error) => void,
  /** @default 'info' */
  color?: 'primary' | 'neutral' | 'danger' | 'info' | 'success' | 'warning',
  /** @default 'outlined' */
  variant?: 'plain' | 'outlined' | 'soft' | 'solid',
}

export const Reset: MemoExoticComponent<FC<ResetProps>> = observer((props: ResetProps) => {
  const {
    onClick,
    options,
    onResetValidateFailed,
    onResetValidateSuccess,
    disabled,
    children = '重置',
    ...restProps
  } = props;
  const form = useParentForm() as Form;
  const onReset = useMemoizedFn((e) => {
    if (!form) return;
    if (onClick) {
      const res = onClick?.(e) as any;
      if (res === false) return;
    }
    form
      .reset('*', options)
      .then((payload) => {
        onResetValidateSuccess?.(payload);
        form?.setValues(form?.initialValues);
      })
      .catch(onResetValidateFailed)
    ;
  });

  return (
    <Button
      color='info'
      variant='outlined'
      disabled={disabled || form?.submitting}
      onClick={onReset}
      {...restProps}
    >
      { children }
    </Button>
  );
}, { displayName: 'FormilyJoyReset' });
