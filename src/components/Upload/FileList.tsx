import { type ReactNode, type FC, type MemoExoticComponent, Fragment } from 'react';
import { observer } from '@formily/react';
import { Avatar, List, ListItem, ListItemDecorator, type ListItemProps, type ListProps, IconButton, Typography, ListDivider, type TypographyProps, Tooltip, type IconButtonProps } from '@mui/joy';
import { type SystemStyleObject } from '@mui/system';
import { AttachmentOutlined, Delete } from '@mui/icons-material';

import type { UploadedFile } from '@/types/index';

export interface FileListProps {
  files?: UploadedFile[],
  readOnly?: boolean,
  onFileRemove: (file: UploadedFile) => void,
  removeIcon?: ReactNode,
  fileIcon?: ReactNode,
  /**
   * @default
   * {
   *  size: 'sm',
   *  variant: 'outlined',
   *  sx: { width: '100%' },
   * }
   */
  fileListProps?: ListProps,
  /**
   * @default
   * {
   *  sx: {
   *  width: '100%',
   *  display: 'flex',
   *  flexWrap: 'nowrap',
   *  gap: 0.5,
   *  p: 0,
   * },
   * }
   */
  fileListItemProps?: ListItemProps,
  /**
   * @default
   * {
   *  fontSize: 'sm',
   *  sx: {
   *  flex: 1,
   *  textAlign: 'left',
   *  overflow: 'hidden',
   *  whiteSpace: 'nowrap',
   *  textOverflow: 'ellipsis',
   * },
   * }
   */
  fileTitleProps?: TypographyProps,
  /**
   * @default { variant: 'plain', color: 'neutral'}
   */
  removeButtonProps?: IconButtonProps
}

export const FileList: MemoExoticComponent<FC<FileListProps>> = observer((props: FileListProps) => {
  const { files, readOnly, onFileRemove, removeIcon = <Delete />, fileIcon = <AttachmentOutlined />, fileListProps, fileListItemProps, fileTitleProps, removeButtonProps } = props;
  if (!files?.length) return null;
  return (
    <List
      variant='outlined'
      size='sm'
      {...fileListProps}
      sx={(theme) => {
        const extraSx = (typeof fileListProps?.sx === 'function' ? fileListProps?.sx?.(theme) : fileListProps?.sx) as SystemStyleObject;
        return {
          width: '100%',
          borderRadius: 'sm',
          boxShadow: 'sm',
          ...extraSx,
        };
      }}
    >
      { files.map((file, i) => (
        <Fragment key={i}>
          { i > 0 && (
            <ListDivider />
          )}
          <ListItem
            {...fileListItemProps}
            color={file.error ? 'danger' : undefined}
            sx={(theme) => {
              const extraSx = (typeof fileListItemProps?.sx === 'function' ? fileListItemProps?.sx?.(theme) : fileListItemProps?.sx) as SystemStyleObject;
              return {
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 0.5,
                p: 0,
                width: '100%',
                ...extraSx,
              };
            }}
          >
            <ListItemDecorator>
              <Avatar src={file.url}>
                { fileIcon }
              </Avatar>
            </ListItemDecorator>
            <Tooltip placement='top' arrow variant='outlined' color='danger' title={file.error || ''} >
              <Typography
                fontSize='sm'
                {...fileTitleProps}
                sx={(theme) => {
                  const extraSx = (typeof fileTitleProps?.sx === 'function' ? fileTitleProps?.sx?.(theme) : fileTitleProps?.sx) as SystemStyleObject;
                  return {
                    flex: 1,
                    textAlign: 'left',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    ...extraSx,
                  };
                }}
              >
                { file.name }
              </Typography>
            </Tooltip>
            { !readOnly && (
              <IconButton
                variant='plain'
                color='neutral'
                {...removeButtonProps}
                onClick={() => onFileRemove(file)}
              >
                { removeIcon }
              </IconButton>
            )}
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
}, { displayName: 'FormilyJoyUpload/FileList' });
