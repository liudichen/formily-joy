import type { FC, MemoExoticComponent, MutableRefObject, ReactNode } from 'react';
import { useCreation, useMemoizedFn, useKeyPress } from 'ahooks';
import { useParentForm, observer } from '@formily/react';
import { Button, type ButtonProps, CircularProgress } from '@mui/joy';

type TargetType = HTMLElement | Element | Window | Document;
type KeyPressEvent = 'keydown' | 'keyup';
type KeyPressTarget = (() => TargetType) | TargetType | MutableRefObject<TargetType> | string | null;

export interface SubmitProps extends ButtonProps {
  onSubmit?: ((value: any) => any) | ((value: any) => Promise<any>),
  submitText?: ReactNode,
  resetOnSuccess?: boolean,
  onSubmitSuccess?: (res: any) => void,
  onSubmitFailed?: (error: Error) => void,
  loading?: boolean,
  loadingIndicator?: ReactNode,
  loadingPosition?: 'center' | 'start' | 'end',
  enterKeySubmit?: boolean,
  keyPressEvents?: KeyPressEvent[],
  keyPressTarget?: KeyPressTarget,
  keyPressExactMatch?: boolean,
}

export const Submit: MemoExoticComponent<FC<SubmitProps>> = observer((props: SubmitProps) => {
  const {
    onSubmit,
    submitText,
    onSubmitFailed,
    onSubmitSuccess,
    resetOnSuccess,
    enterKeySubmit,
    loading: loadingProp,
    disabled,
    onClick,
    children,
    keyPressEvents,
    keyPressTarget,
    keyPressExactMatch,
    ...restProps
  } = props;
  const form = useParentForm();
  const loading = loadingProp || form?.submitting;
  const submit = useMemoizedFn((e) => {
    if (!form) return;
    if (onClick) {
      if ((onClick?.(e) as any) === false) return;
    }
    if (onSubmit) {
      form.submit(onSubmit).then((res) => {
        onSubmitSuccess?.(res);
        if (resetOnSuccess && (res as any) === true) {
          form?.reset('*');
        }
      }).catch(onSubmitFailed);
    }
  });
  const autoSubmit = useMemoizedFn(() => {
    if (!enterKeySubmit) { return; }
    submit(undefined);
  });
  const options = useCreation(() => {
    if (!keyPressEvents && !keyPressTarget && typeof keyPressExactMatch !== 'boolean') return undefined;
    const Op: {
      events?: KeyPressEvent[],
      target?: KeyPressTarget,
      exactMatch?: boolean;
      useCapture?: boolean;
    } = {};
    if (keyPressEvents) Op.events = keyPressEvents;
    if (typeof keyPressExactMatch === 'boolean') Op.exactMatch = keyPressExactMatch;
    if (typeof keyPressTarget === 'string') {
      Op.target = () => (document.getElementById(keyPressTarget) as HTMLElement);
    } else if ([ 'object', 'function' ].includes(typeof keyPressTarget)) {
      Op.target = keyPressTarget;
    }
    return Op as any;
  }, [ keyPressEvents, keyPressTarget, keyPressExactMatch ]);
  useKeyPress('enter', () => autoSubmit(), options);

  return (
    <Button
      variant='solid'
      disabled={disabled || loading}
      onClick={submit}
      {...restProps}
    >
      { children ?? (
        <>
          { loading ? (<CircularProgress variant='plain' />) : (submitText || '提交') }
        </>
      )}
    </Button>
  );
}, { displayName: 'FormilyJoySubmit' });
