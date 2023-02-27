import type { MemoExoticComponent, FC } from 'react';
import { observer } from '@formily/react';

import type { FieldDecoratorProps } from '@/types/index';
import { useFieldDecoratorProps } from '@/hooks/index';

import { FieldDecoratorBase } from './FieldDecoratorBase';

export const FieldDecorator: MemoExoticComponent<FC<FieldDecoratorProps>> = observer((props: FieldDecoratorProps) => {
  const resProps = useFieldDecoratorProps(props);
  return <FieldDecoratorBase {...resProps} />;
}, { displayName: 'FormilyJoyFieldDecorator' });
