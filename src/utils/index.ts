export const splitFieldMessage = (messages: any[]) => {
  return messages.reduce((buf, text, index) => {
    if (!text) return buf;
    return index < messages.length - 1
      ? buf.concat([ text, ', ' ])
      : buf.concat([ text ]);
  }, []);
};

export const ContentSizeMinHeight = {
  sm: '2rem',
  md: '2.5rem',
  lg: '3rem',
};
