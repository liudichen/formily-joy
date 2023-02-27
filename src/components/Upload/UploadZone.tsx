import { type PropsWithChildren, type RefObject, forwardRef, type ForwardedRef, useImperativeHandle } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';

export interface UploadRefObj {
  /** 打开上传选择文件的窗口方法 */
  open?: () => void,
  rootRef?: RefObject<HTMLElement>,
  inputRef?: RefObject<HTMLElement>,
}

export const UploadZone = forwardRef((props: PropsWithChildren<DropzoneOptions>, ref: ForwardedRef<UploadRefObj>) => {
  const { children, ...options } = props;
  const { getInputProps, getRootProps, inputRef, rootRef } = useDropzone(options);
  useImperativeHandle(ref, () => ({ inputRef, rootRef, open }));
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      { children }
    </div>
  );
});

UploadZone.defaultProps = {
  useFsAccessApi: false,
};
