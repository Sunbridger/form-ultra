import React, { useEffect } from 'react';
import { useFormUltra } from './FormProvider';
import './form.css';


interface Rule {
  required?: boolean; // 是否必填
  message?: string; // 校验失败时的错误信息
  validator?: (value: unknown) => boolean | Promise<boolean>; // 自定义校验函数
}

interface FormFieldProps {
  name: string; // 字段名
  label?: string; // 标签
  children?: React.ReactElement; // 子组件
  rules?: Rule[]; // 校验规则
  watch?: {
    [key: string]: (value: unknown, { updateSelfValHandler }: { updateSelfValHandler: (val: unknown) => void }) => void; // 监听字段及其回调
  };
  style?: React.CSSProperties;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  rules,
  children,
  watch,
  style,
}) => {
  console.log(`${name} 字段渲染了`);

  const { store } = useFormUltra();

  const value = store((state) => state.values[name]);
  const error = store((state) => state.errors[name]);
  const touched = store((state) => state.touched[name]);

  const setFieldValue = store((state) => state.setFieldValue);
  const registerWatcher = store((state) => state.registerWatcher);
  const registerValidator = store((state) => state.registerValidator);

  // 注册监听器
  useEffect(() => {
    if (watch) {
      Object.keys(watch).forEach((key) => {
        registerWatcher(name, key, watch[key]);
      });
    }
  }, [watch, name, registerWatcher]);

  // 注册验证规则
  useEffect(() => {
    if (rules) {
      registerValidator(name, rules);
    }
  }, [name, rules, registerValidator]);

  // 后续可以支持 valueExtractor?: (value: any) => any; // 自定义值提取逻辑
  const handleChange = (value: unknown) => {
    // 如果是事件对象，提取 target.value
    if (
      value &&
      typeof value === 'object' &&
      'target' in value &&
      value.target &&
      typeof value.target === 'object' &&
      'value' in value.target
    ) {
      setFieldValue(name, value.target.value);
    } else if (value && typeof value === 'object' && 'value' in value) {
      // 如果 value 是一个包含 value 属性的对象
      setFieldValue(name, value.value);
    } else {
      // 否则直接使用 value
      setFieldValue(name, value);
    }
  };

  const styleObj = error
    ? {
        border: '1px solid #dc3545',
      }
    : undefined;

  return (
    <div className="form-ultra-field" style={style}>
      {/* todo 解耦 不在组件内定义样式 */}
      {label && <label className="form-ultra-field-label">{label}：</label>}
      {children
        ? React.cloneElement(children, {
            value,
            onChange: handleChange,
            error,
            touched,
            style: { ...children.props.style, ...styleObj }, // 合并样式
          })
        : null}
      {/* todo 解耦 不在组件内定义样式 */}
      {error && <div className="form-ultra-field-error-text">{error}</div>}
    </div>
  );
};

export default FormField;
