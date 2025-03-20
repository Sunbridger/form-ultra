---
nav:
  title: 使用示例
---

# @zcy/rc-FormUltra-front

## 何时使用

当需要获取表示范围的数值时。

### 基础使用

```tsx
import React from 'react';
import { Input, Button } from 'antd';
import { FormField, FormProvider, useFormUltra } from '@zcy/rc-FormUltra-front';

const LoginForm = () => {
  const { validateForm, resetForm } = useFormUltra();

  const handleSubmit = async () => {
    const formData = await validateForm();
    if (formData) {
      console.log('Submitting:', formData);
    } else {
      console.log('Validation failed');
    }
  };

  return (
    <div>
      <FormField name="name" label="姓名">
        <Input placeholder="请输入" />
      </FormField>
      <FormField name="address" label="地址">
        <Input placeholder="请输入" />
      </FormField>
      <Button onClick={resetForm}>重置</Button>
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default () => (
  <FormProvider>
    <LoginForm />
  </FormProvider>
);
```

### 自定义validator模式

```tsx
import React from 'react';
import { Input, Button } from 'antd';
import { FormField, FormProvider, useFormUltra } from '@zcy/rc-FormUltra-front';

const LoginForm = () => {
  const { validateForm, isSubmitting, resetForm } = useFormUltra();

  const handleSubmit = async () => {
    const formData = await validateForm();
    if (formData) {
      console.log('Submitting:', formData);
    } else {
      console.log('Validation failed');
    }
  };

  return (
    <div>
      <FormField
        name="name"
        label="姓名"
        rules={[
          { required: true, message: '姓名不能为空' },
          {
            validator: (value) => /[A-Z]/.test(value),
            message: '姓名必须包含大写字母',
          },
        ]}
      >
        <Input placeholder="请输入" />
      </FormField>
      <FormField
        name="address"
        label="地址"
        rules={[
          { required: true, message: '地址不能为空' },
          {
            validator: (value) => /[A-Z]/.test(value),
            message: '地址必须包含大写字母',
          },
        ]}
      >
        <Input placeholder="请输入" />
      </FormField>

      <Button onClick={resetForm}>重置</Button>
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default () => (
  <FormProvider>
    <LoginForm />
  </FormProvider>
);
```

### 联动模式

```tsx
import React from 'react';
import { Select, Input, Button } from 'antd';
import { FormField, FormProvider, useFormUltra } from '@zcy/rc-FormUltra-front';

const LoginForm = () => {
  const { validateForm, isSubmitting, resetForm } = useFormUltra();

  const handleSubmit = async () => {
    const formData = await validateForm();
    if (formData) {
      console.log('Submitting:', formData);
    } else {
      console.log('Validation failed');
    }
  };

  return (
    <div>
      <FormField
        name="org"
        label="机构"
        rules={[{ required: true, message: '机构不能为空' }]}
      >
        <Select
          style={{ width: '220px' }}
          allowClear
          labelInValue
          options={[
            {
              value: 111111,
              label: '张三机构',
            },
            {
              value: 222222,
              label: '李四机构',
            },
            {
              value: 333333,
              label: '七彩机构',
            },
          ]}
        />
      </FormField>

      <FormField
        name="name"
        label="姓名"
        rules={[
          { required: true, message: '姓名不能为空' },
          {
            validator: (value) => /[A-Z]/.test(value),
            message: '姓名必须包含大写字母',
          },
        ]}
        watch={{
          org: (orgVal, { updateSelfValHandler }) => {
            updateSelfValHandler(`我是${orgVal.label}的姓名`);
          },
        }}
      >
        <Input placeholder="请输入" />
      </FormField>
      <FormField
        name="address"
        label="地址"
        rules={[
          { required: true, message: '地址不能为空' },
          {
            validator: (value) => /[A-Z]/.test(value),
            message: '地址必须包含大写字母',
          },
        ]}
        watch={{
          name: (nameVal, { updateSelfValHandler }) => {
            updateSelfValHandler(`我是${nameVal}的地址`);
          },
        }}
      >
        <Input placeholder="请输入" />
      </FormField>

      <Button onClick={resetForm}>重置</Button>
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default () => (
  <FormProvider>
    <LoginForm />
  </FormProvider>
);
```

### 自定义组件

```tsx
import React, { useState, useEffect } from 'react';
import { Radio, Select, Input, Button } from 'antd';
import { FormField, FormProvider, useFormUltra } from '@zcy/rc-FormUltra-front';

// 这是一个自定义组件

const RadioInput = ({ value, onChange }) => {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleRadioChange = (e: any) => {
    setVal({
      ...(val || {}),
      radio: e.target.value,
    });
    onChange({
      ...(val || {}),
      radio: e.target.value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal({
      ...(val || {}),
      input: e.target.value,
    });
    onChange({
      ...(val || {}),
      input: e.target.value,
    });
  };

  return (
    <div className="radio-input">
      <Radio.Group value={value?.radio} onChange={handleRadioChange}>
        {[
          {
            value: 1,
            label: 1,
          },
          {
            value: 2,
            label: 2,
          },
        ].map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
      <Input
        placeholder="请输入"
        value={value?.input}
        onChange={handleInputChange}
      />
    </div>
  );
};

const LoginForm = () => {
  const { validateForm, isSubmitting, resetForm } = useFormUltra();

  const handleSubmit = async () => {
    const formData = await validateForm();
    if (formData) {
      console.log('Submitting:', formData);
    } else {
      console.log('Validation failed');
    }
  };

  return (
    <div>
      <FormField
        name="customField"
        label="自定义组件"
        rules={[
          { required: true, message: 'customField不能为空' },
          {
            validator: (value) => {
              return value.input && value.radio;
            },
            message: '必须都填写',
          },
        ]}
      >
        <RadioInput />
      </FormField>

      <Button onClick={resetForm}>重置</Button>
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default () => (
  <FormProvider>
    <LoginForm />
  </FormProvider>
);
```

### 多表单字段模式，保证只render有依赖的item字段

```tsx
import React from 'react';
import { Select, Input, Button } from 'antd';
import { FormField, FormProvider, useFormUltra } from '@zcy/rc-FormUltra-front';

const LoginForm = () => {
  const { validateForm, isSubmitting, resetForm } = useFormUltra();

  const handleSubmit = async () => {
    const formData = await validateForm();
    if (formData) {
      console.log('Submitting:', formData);
    } else {
      console.log('Validation failed');
    }
  };

  return (
    <div>
      <FormField
        name="org"
        label="机构"
        rules={[{ required: true, message: '机构不能为空' }]}
      >
        <Select
          style={{ width: '220px' }}
          allowClear
          labelInValue
          options={[
            {
              value: 111111,
              label: '张三机构',
            },
            {
              value: 222222,
              label: '李四机构',
            },
            {
              value: 333333,
              label: '七彩机构',
            },
          ]}
        />
      </FormField>

      <FormField
        name="name"
        label="姓名"
        rules={[
          { required: true, message: '姓名不能为空' },
          {
            validator: (value) => /[A-Z]/.test(value),
            message: '姓名必须包含大写字母',
          },
        ]}
        watch={{
          org: (orgVal, { updateSelfValHandler }) => {
            updateSelfValHandler(`我是${orgVal.label}的姓名`);
          },
        }}
      >
        <Input placeholder="请输入" />
      </FormField>
      <FormField
        name="address"
        label="地址"
        rules={[
          { required: true, message: '地址不能为空' },
          {
            validator: (value) => /[A-Z]/.test(value),
            message: '地址必须包含大写字母',
          },
        ]}
        watch={{
          name: (nameVal, { updateSelfValHandler }) => {
            updateSelfValHandler(`我是${nameVal}的地址`);
          },
        }}
      >
        <Input placeholder="请输入" />
      </FormField>

      {Array.from({ length: 100 }, (v, k) => k).map((key) => (
        <FormField
          key={`custom${key}`}
          name={`custom${key}`}
          label={`嘿嘿${key}`}
        >
          <Input placeholder="请输入" />
        </FormField>
      ))}

      <Button onClick={resetForm}>重置</Button>
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default () => (
  <FormProvider>
    <LoginForm />
  </FormProvider>
);
```

## API

### FormField API

`FormField` 是一个用于管理表单字段的 React 组件。它与 `useFormUltra` 钩子配合使用，支持字段值管理、校验规则、字段监听等功能。

| Prop      | Type                          | Description                                                                 |
|-----------|-------------------------------|-----------------------------------------------------------------------------|
| `name`    | `string`                      | 字段名，必须唯一。                                                          |
| `label`   | `string`                      | 字段标签，显示在输入框上方。                                                |
| `children`| `React.ReactElement`          | 输入组件（如 `<input />`、`<select />` 等）。                              |
| `rules`   | `Rule[]`                      | 校验规则数组。                                                              |
| `watch`   | `{ [key: string]: Function }` | 监听其他字段变化的回调函数集合。                                            |
| `style`   | `{}` | 样式                                            |

---

### `Rule` Type

| Prop         | Type                        | Description                                                                 |
|--------------|-----------------------------|-----------------------------------------------------------------------------|
| `required`   | `boolean`                  | 是否必填。                                                                  |
| `message`    | `string`                   | 校验失败时的错误信息。                                                      |
| `validator`  | `(value: any) => boolean`  | 自定义校验函数，返回 `true` 表示校验通过，`false` 表示校验失败。            |

---

### `watch` Callback

监听其他字段变化的回调函数。回调函数接收两个参数：

1. `value`: 被监听字段的最新值。
2. `{ updateSelfValHandler }`: 包含一个 `updateSelfValHandler` 方法，用于更新当前字段的值。


```
watch={{
  otherField: (value, { updateSelfValHandler }) => {
    updateSelfValHandler(value.toUpperCase()); // 更新当前字段的值
  },
}}
```

---

## Example

### Example 1: Basic Form

```
<FormField name="username" label="Username" rules={[{ required: true, message: 'Username is required' }]}>
  <input type="text" />
</FormField>
```

### Example 2: Custom Validator

```
<FormField
  name="password"
  label="Password"
  rules={[
    {
      validator: (value) => value.length >= 8,
      message: 'Password must be at least 8 characters',
    },
  ]}
>
  <input type="password" />
</FormField>
```

### Example 3: Watch Another Field

```
<FormField
  name="confirmPassword"
  label="Confirm Password"
  watch={{
    password: (value, { updateSelfValHandler }) => {
      updateSelfValHandler(value); // 同步密码字段的值
    },
  }}
>
  <input type="password" />
</FormField>
```

---

## Styling

默认情况下，校验失败时会在输入框周围添加红色边框，并在下方显示错误信息。你可以通过自定义样式覆盖默认行为。

```css
.form-ultra-field {
  margin-bottom: 21px;
  &-error-border {
    border: 1px solid #dc3545;
  }
  &-error-text {
    color: #dc3545;
  }
  &-label{
    color: #565656;
    font-size: 14px;
    font-weight: 400;
  }
}
```
