import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import createFormStore, { FormState } from './formStore';

interface FormProviderProps {
  children: ReactNode;
  initialValues?: Record<string, unknown>;
}


export const FormContext = createContext<UseBoundStore<StoreApi<FormState>> | null>(null);

export const FormProvider: React.FC<FormProviderProps> = ({ children, initialValues }) => {
  const store = useMemo(() => createFormStore(initialValues), [initialValues]);
  return <FormContext.Provider value={store}>{children}</FormContext.Provider>;
};

export const useFormUltra = () => {
  const store = useContext(FormContext);
  if (!store) throw new Error('Missing FormProvider');

  const isSubmitting = store((state) => state.isSubmitting);
  const resetForm = store((state) => state.resetForm);
  const validateForm = store((state) => state.validateForm);

  return {
    store,
    validateForm,
    isSubmitting,
    resetForm,
  };
};
