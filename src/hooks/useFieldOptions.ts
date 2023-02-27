import { useEffect } from 'react';
import { useMemoizedFn, useSafeState } from 'ahooks';

import { FieldObjOption, FieldPropsOptions, FieldOption } from '@/types/index';

interface UseFieldOptionsConfig {
  /** 外部管理Loading状态：setLoading */
  onLoading?: (loading: boolean) => void,
  /** 获取完options后进行的其他操作，不会影响返回options，为options的副作用 */
  callback?: (options: FieldObjOption[]) => void,
  /** 更新依赖项数组,不需要传递optionsProp,optionsProp会默认加入 */
  deps?: any,
}

export const useFetchOptions = (optionsProp?: FieldPropsOptions, config: UseFieldOptionsConfig = {}) => {
  const { onLoading, callback, deps } = config;
  const [ loading, setLoading ] = useSafeState<boolean>(false);
  const [ options, setOptions ] = useSafeState<FieldObjOption[]>([]);
  const getOptions = useMemoizedFn(async () => {
    let result: FieldOption[] = [];
    onLoading?.(true);
    try {
      if (Array.isArray(optionsProp) && optionsProp.length) {
        result = [ ...optionsProp ];
      }
      if (!result.length && typeof optionsProp === 'function') {
        setLoading(true);
        const res = await optionsProp();
        if (Array.isArray(res)) { // 如果结果不是Array则直接丢弃
          result = [ ...res ];
        }
      }
      result = result.map((item) => (typeof item === 'object' ? item : { value: item, label: `${item}` }));
      onLoading?.(false);
      setOptions(result as FieldObjOption[]);
      callback?.(result as FieldObjOption[]);
    } catch (error) {
      onLoading?.(false);
    }
    setLoading(false);
  });
  useEffect(() => {
    getOptions();
  }, [ optionsProp, deps ]);
  return { options, loading };
};
