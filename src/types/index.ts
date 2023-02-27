import type { CSSProperties, ReactNode } from 'react';
import type { ColorPaletteProp, TooltipProps, FormLabelProps, FormHelperTextProps, Theme, FormControlProps } from '@mui/joy';

export type FeedbackStatus = 'warning' | 'error' | 'pending' | 'default';

export interface FieldBaseProps<T = any, D = any> extends FieldDecoratorProps {
  value?: T,
  defaultValue?: T,
  options?: D,
  onChange?: (value?: T) => void,
  readOnly?: boolean,
  disabled?: boolean,
  error?: boolean,
  feedbackStatus?: FeedbackStatus,
}

/** field外层包裹的decorator组件中内容获取函数的入参 */
export interface FieldDecoratorItemParam {
  theme?: Theme,
  error?: boolean,
  feedbackStatus?: FeedbackStatus,
  fullWidth?: boolean,
}

export interface FieldDecoratorBaseRelateProps {
  color?: FormControlProps['color'],
  label?: ReactNode | ((params?: FieldDecoratorItemParam) => ReactNode),
  /** 显示上方的字段名?
   * @default true */
  showLabel?: boolean,
  labelProps?: FormLabelProps | ((params?: FieldDecoratorItemParam) => FormLabelProps),
  tooltip?: ReactNode | ((params?: FieldDecoratorItemParam) => ReactNode),
  tooltipIcon?: ReactNode,
  tooltipProps?: TooltipProps | ((params?: FieldDecoratorItemParam) => TooltipProps),
  showFeedback?: boolean,
  feedback?: ReactNode | ((params?: FieldDecoratorItemParam) => ReactNode),
  feedbackProps?: FormHelperTextProps | ((params?: FieldDecoratorItemParam) => FormHelperTextProps),
  feedbackStatus?: FeedbackStatus,
  required?: boolean,
  error?: boolean,
  fullWidth?: boolean,
  width?: string | number,

  /** 包裹formField的div的style */
  contentStyle?: CSSProperties & { [key: `--${string}`]: string | number},
  /** 包裹formField的div的className */
  contentCls?: string,
}

export interface GridCols {
  xs?: number | boolean,
  sm?: number | boolean,
  md?: number | boolean,
  lg?: number | boolean,
  xl?: number | boolean,
}

export interface FieldDecoratorCommonAttributes {
  required?: boolean,
  readOnly?: boolean,
  disabled?: boolean,
  error?: boolean,
  fullWidth?: boolean,
  showLabel?: boolean,
  showFeedback?: boolean,

  size?: 'sm' | 'md' | 'lg',
  color?: ColorPaletteProp,
  width?: string | number,
  tooltipIcon?: ReactNode,

  /** 包裹formField的div的style */
  contentStyle?: CSSProperties & { [key: `--${string}`]: string | number},
  /** 包裹formField的div的className */
  contentCls?: string,
}

export interface FieldDecoratorBaseProps extends FieldDecoratorBaseRelateProps, GridCols, FieldDecoratorCommonAttributes {
  children?: ReactNode,
}

export interface FieldDecoratorProps extends FieldDecoratorBaseProps {
  /** 不从Field中获取信息 */
  noField?: boolean,
}

interface ObjType {
  [key: string]: any
}

export interface FieldObjOption extends ObjType {
  value: any,
  label: ReactNode,
}

export type FieldOption = number | string | FieldObjOption;

export type FieldPropsOptions = FieldOption[] | (() => FieldOption[]) | (()=>Promise<FieldOption[]>);

export interface UploadedFile extends File {
  /** 图片的base64URL */
  url?: string,
  /** 错误信息 */
  error?: ReactNode,
}
