import { createContext, type ReactNode, useContext } from 'react';
import type { FieldDecoratorCommonAttributes } from '@/types/index';


export const FieldDecoratorCommonInfoContext = createContext<FieldDecoratorCommonAttributes>({});

interface FieldCommonInfoProviderProps {
  value: FieldDecoratorCommonAttributes,
  children?: ReactNode,
}

export const FieldCommonInfoProvider = ({ value, children }: FieldCommonInfoProviderProps) => {
  <FieldDecoratorCommonInfoContext.Provider value={value} >
    {children}
  </FieldDecoratorCommonInfoContext.Provider>;
};

export const useFieldDecoratorCommonInfo = () => useContext(FieldDecoratorCommonInfoContext);
