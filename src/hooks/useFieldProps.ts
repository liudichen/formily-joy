import { useField } from '@formily/react';
import { isVoidField, type Field } from '@formily/core';
import { useOverrideProps } from '@iimm/shared';

import { splitFieldMessage } from '@/utils/index';
import type { FieldBaseProps } from '@/types/index';

export function useFieldProps<V = any, D = any, T extends FieldBaseProps<V, D> = FieldBaseProps<V, D>>(props: T) {
  const field: Field = useField();
  if (props?.noField || !field) return props;
  const isVoid = isVoidField(field);
  const resProps = useOverrideProps<T>(props, {
    defaultValue: field.initialValue,
    options: field.dataSource,
    label: field.title,
    tooltip: field.description,
    ...(isVoid ? {
      disabled: field.disabled,
      readOnly: field.readOnly,
      error: field.selfInvalid,
      required: field.required && field.pattern !== 'readPretty',
      feedbackStatus: field.validating ? 'pending' : (field.decoratorProps.feedbackStatus || field.validateStatus),
      tooltip: (!field.validating && (
        field.selfErrors.length ? splitFieldMessage(field.selfErrors)
          : field.selfWarnings.length ? splitFieldMessage(field.selfWarnings)
            : field.selfSuccesses.length ? splitFieldMessage(field.selfSuccesses) : undefined
      )) || undefined,
    } : {}),
  } as T, 'rawUndefined');
  return resProps;
}
