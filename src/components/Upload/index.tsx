import type { MemoExoticComponent, FC, ReactNode, MutableRefObject } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { observer } from '@formily/react';
import { Button, Box, type ButtonProps } from '@mui/joy';
import { FileUploadOutlined } from '@mui/icons-material';
import type { DropzoneOptions, DropEvent } from 'react-dropzone';
import { fileToBase64 } from '@iimm/shared';

import type { FieldBaseProps, UploadedFile } from '@/types/index';
import { useFieldProps } from '@/hooks/index';

import { FieldDecoratorBase } from '../FieldDecorator/FieldDecoratorBase';
import { UploadZone, type UploadRefObj } from './UploadZone';
import { FileList, type FileListProps } from './FileList';
import { isImage as defaultIsImage, updateFileList, removeFile } from './utils';

export interface UploadProps extends DropzoneOptions, FieldBaseProps<UploadedFile[]>, Omit<FileListProps, 'files' | 'onFileRemove'> {
  /** 上传触发的节点 */
  dropZone?: ReactNode,
  /** 列表的排列方向
   * @default 'vertical'
  */
  direction?: 'horizontal' | 'vertical',
  /** dropzone与fileLis的间距
   * @default 0.5
   */
  spacing?: number | string,
  color?: 'primary' | 'neutral' | 'danger' | 'info' | 'success' | 'warning',
  /** @default 'outlined'*/
  variant?: 'plain' | 'outlined' | 'soft' | 'solid',
  size?: 'sm' | 'md' | 'lg',

  uploadButtonText?: ReactNode,
  uploadButtonProps?: Omit<ButtonProps, 'children'>,
  uploadRef?: MutableRefObject<UploadRefObj>,
  maxCount?: number,
  isImage?: ((file: File | UploadedFile) => boolean) | ((file: File | UploadedFile) => Promise<boolean>),
  transformFile?: ((file: File | UploadedFile) => UploadedFile) | ((file: File | UploadedFile) => Promise<UploadedFile>),
  /** 删除文件时的回调，如果返回false，则不会删除文件 */
  onFileRemove?: ((file?: UploadedFile) => (boolean | undefined)) | ((file?: UploadedFile) => Promise<(boolean | undefined)>),
  fullWidth?: boolean,
}

export const Upload: MemoExoticComponent<FC<UploadProps>> = observer((props: UploadProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noField, xs, sm, md, lg, xl, value: valueProp, onChange: onChangeProp, defaultValue, options, size, variant = 'outlined',
    error, color: colorProp, label, showLabel, labelProps, tooltip, tooltipIcon, tooltipProps, showFeedback, feedback, feedbackProps, feedbackStatus, required, fullWidth, width, contentCls, contentStyle,
    dropZone, direction = 'vertical', disabled, readOnly, spacing = 0.5, uploadButtonProps, uploadButtonText, uploadRef, maxCount, transformFile, isImage = defaultIsImage, onFileRemove: onFileRemoveProp, onDropAccepted,
    removeIcon, fileIcon, fileListItemProps, fileListProps, fileTitleProps, removeButtonProps,
    ...restProps
  } = useFieldProps<UploadedFile[], any, UploadProps>(props);
  const [ value, onChange ] = useControllableValue<UploadedFile[]>(props);
  const color = error ? 'danger' : colorProp;
  const onInternalChange = useMemoizedFn(async (changedFileList: UploadedFile[]) => {
    if (disabled || readOnly) return;
    let cloneList = [ ...(changedFileList || []) ];
    if (maxCount === 1) {
      cloneList = cloneList.slice(-1);
    } else {
      cloneList = cloneList.slice(0, maxCount);
    }
    if (typeof transformFile === 'function') {
      for (let i = 0; i < cloneList.length; i++) {
        cloneList[i] = await transformFile(cloneList[i]);
      }
    }
    onChange(cloneList);
  });
  const onFileRemove = useMemoizedFn(async (file: UploadedFile) => {
    if (readOnly || disabled) return;
    if (typeof onFileRemoveProp === 'function') {
      const canRemove = await onFileRemoveProp(file);
      if (canRemove === false) return;
    }
    const newFileList = removeFile(file, value);
    if (newFileList) {
      await onInternalChange(newFileList);
    }
  });
  const onInternalDropAccepted = useMemoizedFn(async (acceptedFiles: UploadedFile[], e: DropEvent) => {
    const newFileList = updateFileList(acceptedFiles, value);
    if (newFileList) {
      for (let i = 0; i < newFileList.length; i++) {
        const file = newFileList[i];
        const isImg = await isImage(file);
        if (isImg && !file?.url) {
          file.url = await fileToBase64(file);
        }
      }
      await onInternalChange(newFileList);
    }
    onDropAccepted?.(acceptedFiles, e);
  });
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          gap: spacing,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          ...(fullWidth ? { width: '100%' } : {}),
        }}
      >
        <UploadZone
          ref={uploadRef}
          disabled={disabled || readOnly}
          multiple={maxCount !== 1 && props.maxFiles !== 1}
          maxFiles={maxCount}
          onDropAccepted={onInternalDropAccepted}
          {...restProps}
        >
          { dropZone ?? (
            <Button
              variant={variant}
              disabled={disabled}
              color={color}
              startDecorator={<FileUploadOutlined />}
              {...uploadButtonProps}
            >
              { uploadButtonText || '文件' }
            </Button>
          )}
        </UploadZone>
        <FileList
          files={value}
          readOnly={readOnly || disabled}
          onFileRemove={onFileRemove}
          removeIcon={removeIcon}
          fileIcon={fileIcon}
          fileListProps={fileListProps}
          fileListItemProps={fileListItemProps}
          fileTitleProps={fileTitleProps}
          removeButtonProps={removeButtonProps}
        />
      </Box>
    </FieldDecoratorBase>
  );
}, { displayName: 'FormilyJoyUpload' });
