import { useField } from '@formily/react';
import { isVoidField, type Field } from '@formily/core';
import { useOverrideProps } from '@iimm/shared';

import { splitFieldMessage } from '@/utils/index';
import type { FieldDecoratorProps } from '@/types/index';


export function useFieldDecoratorProps(props: FieldDecoratorProps) {
  const field: Field = useField();
  if (!field || props?.noField) {
    return props;
  }
  const isVoid = isVoidField(field);
  const resProps = useOverrideProps<FieldDecoratorProps>(props, {
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
  });
  return resProps;
}
