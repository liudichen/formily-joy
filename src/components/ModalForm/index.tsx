import { type MemoExoticComponent, type FC, type ReactNode, useImperativeHandle, type MutableRefObject, Fragment, useMemo } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { observer, FormProvider } from '@formily/react';
import { type IFormProps, type Form, createForm } from '@formily/core';
import { Box, Button, type ButtonProps, Modal, ModalDialog, type ModalDialogProps, type ModalProps, type TypographyProps, Link, type LinkProps, Typography, Divider, type BoxProps } from '@mui/joy';
import { type SystemStyleObject } from '@mui/system';

import { Reset, type ResetProps } from '../Reset';
import { Submit, type SubmitProps } from '../Submit';

export const ModalForm: MemoExoticComponent<FC<ModalFormProps>> = observer((props: ModalFormProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open: openProp, onOpenChange, onClose: onCloseProp,
    trigger, triggerProps,
    title, titleProps, showTitle, showDivider = true,
    contentProps, maxWidth,
    showActions = true, extraAction, showClose = true, showReset = true, showSubmit = true,
    closeProps, resetProps, submitProps, actionsProps, size = 'sm',
    sx, children,
    onFinish, formOptions, formRef, depend,
    ...restProps
  } = props;
  const [ open, setOpen ] = useControllableValue(props, { trigger: 'onOpenChange', valuePropName: 'open', defaultValue: false, defaultValuePropName: 'defaultOpen' });
  const form = useMemo(() => createForm(formOptions || { validateFirst: true }), [ Boolean(open), depend ]);
  useImperativeHandle(formRef, () => form, [ form ]);
  const onClose = useMemoizedFn(async (e, reason) => {
    const res = (await onCloseProp?.(e, reason)) as any;
    if (res !== false) setOpen(false);
  });
  const onSubmit = useMemoizedFn(async (values: any) => {
    const res = await onFinish?.(values);
    if (res !== false) {
      setOpen(false);
    }
  });
  return (
    <Fragment>
      { !!trigger && (
        <Link
          underline='none'
          {...triggerProps}
          onClick={(e) => {
            titleProps?.onClick?.(e);
            setOpen(true);
          }}
        >
          { trigger }
        </Link>
      )}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={onClose}
        sx={{
          p: 0,
          ...(maxWidth ? { maxWidth } : {}),
        }}
      >
        <FormProvider form={form}>
          <ModalDialog
            sx={(theme) => {
              const extraSx = (typeof sx === 'function' ? sx(theme) : sx) as SystemStyleObject;
              return {
                px: 0,
                py: 1,
                gap: 0.5,
                maxHeight: 'calc(100vh - 4px)',
                display: 'flex',
                flexDirection: 'column',
                ...(extraSx || {}),
              };
            }}
            {...restProps}
          >
            { showTitle && (
              <Box sx={{ px: 0.5 }}>
                <Typography {...titleProps}>
                  { title ?? ' '}
                </Typography>
                { showDivider && (
                  <Divider inset='none' />
                )}
              </Box>
            )}
            <Box
              {...contentProps}
              sx={(theme) => {
                const extraSx = (typeof contentProps?.sx === 'function' ? contentProps?.sx?.(theme) : actionsProps?.sx) as SystemStyleObject;
                return {
                  px: 1,
                  flex: 1,
                  overflow: 'auto',
                  ...(extraSx || {}),
                };
              }}
            >
              { children }
            </Box>
            { showActions && (
              <Box
                {...actionsProps}
                sx={(theme) => {
                  const extraSx = (typeof actionsProps?.sx === 'function' ? actionsProps?.sx?.(theme) : actionsProps?.sx) as SystemStyleObject;
                  return {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 1,
                    px: 2,
                    ...(extraSx || {}),
                  };
                }}
              >
                { extraAction }
                { showClose && (
                  <Button
                    size={size}
                    variant='plain'
                    color='neutral'
                    {...closeProps}
                    onClick={() => setOpen(false)}
                  >
                    {closeProps?.children || '关闭'}
                  </Button>
                )}
                { showReset && (
                  <Reset {...resetProps}/>
                )}
                { showSubmit && (
                  <Submit {...submitProps} onSubmit={onSubmit}/>
                )}
              </Box>
            )}
          </ModalDialog>
        </FormProvider>
      </Modal>
    </Fragment>
  );
}, { displayName: 'FormilyJoyModalForm' });

export interface ModalFormProps extends Omit<ModalDialogProps, 'layout' | 'title'> {
  open?: boolean,
  onOpenChange?: (open?: boolean) => void,
  onClose?: ModalProps['onClose'],
  trigger?: ReactNode,
  triggerProps?: LinkProps
  showTitle?: boolean,
  title?: ReactNode,
  titleProps?: TypographyProps
  showDivider?: boolean,
  /** 包裹内容的Box的props
   * @default {flex:1,overflow:'auto',px:1}
   * */
  contentProps?: BoxProps,
  /** 显示下方按钮区?
   * @default true
   */
  showActions?: boolean,
  extraAction?: ReactNode,
  /** 包裹actions的区域的box的props
   * @default {sx:{display:'flex',flexDirection:'flex-end',alginItems:'center',gap:1,px:2}}
   */
  actionsProps?: BoxProps,
  showClose?: boolean,
  closeProps?: ButtonProps,
  showReset?: boolean,
  resetProps?: ResetProps,
  showSubmit?: boolean,
  submitProps?: Omit<SubmitProps, 'onSubmit'>,
  /** 底部按钮尺寸
   * @default 'sm'
   */
  size?: 'sm' | 'md' | 'lg',
  maxWidth?: string | number,
  fullWidth?: boolean,
  onFinish?: SubmitProps['onSubmit'],
  formOptions?: IFormProps,
  formRef?: MutableRefObject<Form>,
  depend?: any,
}
