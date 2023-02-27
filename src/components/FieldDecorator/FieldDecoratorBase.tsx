import { type LegacyRef, useMemo, type CSSProperties } from 'react';
import { FormControl, FormLabel, FormHelperText, Tooltip } from '@mui/joy';
import { useTheme } from '@mui/joy';
import { HelpOutlined } from '@mui/icons-material';
import { useOverflow, useOverrideProps } from '@iimm/shared';

import type { FieldDecoratorBaseProps } from '@/types/index';
import { useFieldDecoratorCommonInfo } from '../FieldCommonInfoProvider';


export const FieldDecoratorBase = (props: FieldDecoratorBaseProps) => {
  const fieldCommonInfo = useFieldDecoratorCommonInfo();
  const { required, error: errorProp, feedbackStatus, showFeedback, feedback, feedbackProps, showLabel = true, label, labelProps, tooltip, tooltipIcon = <HelpOutlined sx={{ fontSize: 'inherit' }}/>, tooltipProps, color: colorProp, children, fullWidth, width, contentStyle, contentCls, size } = useOverrideProps<Partial<FieldDecoratorBaseProps>>(props, fieldCommonInfo || {});
  const theme = useTheme();
  const { overflow, containerRef, contentRef } = useOverflow();
  const error = errorProp || feedbackStatus === 'error';
  const color = error ? 'danger' : colorProp;
  const params = { theme, error, feedbackStatus, fullWidth };
  const widthStyle = useMemo(() => {
    return fullWidth ? { width: '100%', maxWidth: '100%' } : { maxWidth: '100%' };
  }, [ !fullWidth ]);
  return (
    <FormControl
      error={error}
      color={color}
      size={size}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        ...widthStyle,
        ...(width ? { width } : {}),
      }}
    >
      { showLabel && Boolean(label) && (
        <FormLabel
          sx={{
            position: 'relative',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'flex-start',
            ...widthStyle,
            flexWrap: 'nowrap',
            color: error ? theme.vars.palette.danger[500] : undefined,
          }}
          {...(typeof labelProps === 'function' ? labelProps(params) : labelProps)}
        >
          <div
            ref={containerRef as LegacyRef<HTMLDivElement>}
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            <span ref={contentRef as LegacyRef<HTMLSpanElement>} title={overflow && typeof label === 'string' ? label : undefined}>
              {required && (
                <span
                  style={{
                    marginRight: '4px',
                    color: theme.vars.palette.danger[500],
                  }}
                >
                  {'*'}
                </span>
              )}
              { typeof label === 'function' ? label(params) : label }
            </span>
          </div>
          { Boolean(tooltip) && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tooltip arrow placement='top' variant='outlined' color={color}
                title={ typeof tooltip === 'function' ? tooltip(params) : tooltip}
                {...(typeof tooltipProps === 'function' ? tooltipProps(params) : tooltipProps)}
              >
                <span style={{ cursor: 'help', display: 'inline-flex' }}>{ tooltipIcon }</span>
              </Tooltip>
            </span>
          )}
        </FormLabel>
      )}
      <div
        className={contentCls}
        style={{
          display: fullWidth ? 'inline-block' : 'flex',
          ...widthStyle,
          ...(contentStyle as CSSProperties),
        }}
      >
        { children }
      </div>
      { showFeedback && (
        <FormHelperText
          sx={{ textAlign: 'left' }}
          {...(typeof feedbackProps === 'function' ? feedbackProps(params) : feedbackProps)}
        >
          { (typeof feedback === 'function' ? feedback(params) : feedback) || ' '}
        </FormHelperText>
      )}
    </FormControl>
  );
};
