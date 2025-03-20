import ReactDOM from 'react-dom/client';
import { FormProvider, FormField, useFormUltra } from './index';

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
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
      <FormField
        name="org"
        label="机构"
        rules={[{ required: true, message: '机构不能为空' }]}
      >
        <input placeholder="请输入" />
      </FormField>
      <FormField
        name="name"
        label="姓名"
        rules={[{ required: true, message: '姓名不能为空' }]}
        watch={{
          org: (orgVal, { updateSelfValHandler }) => {
            updateSelfValHandler(`我是${orgVal}的姓名`);
          },
        }}
      >
        <input placeholder="请输入" />
      </FormField>

      <button onClick={resetForm}>重置</button>
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <FormProvider>
    <App />
  </FormProvider>
);
