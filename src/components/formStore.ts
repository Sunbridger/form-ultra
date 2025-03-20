import create from 'zustand';

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  validators: Record<string, Rule[]>;
  watchers: Record<string, Record<string, Watcher>>;
  isSubmitting: boolean;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error?: string) => void;
  validateField: (field: string, rules: Rule[]) => Promise<boolean>;
  registerValidator: (field: string, rules: Rule[]) => void;
  registerWatcher: (selfName: string, field: string, handler: Watcher) => void;
  validateForm: () => Promise<boolean | Record<string, any>>;
  resetForm: () => void;
  resetField: (field: string) => void;
}

interface Rule {
  required?: boolean;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

interface Watcher {
  (value: any, formInstance: { updateSelfValHandler: (newValue: any) => void }): void;
}

const createFormStore = (initialValues: Record<string, any> = {}) => {
  return create<FormState>((set, get) => ({
    values: initialValues,
    errors: {},
    touched: {},
    validators: {},
    watchers: {},
    isSubmitting: false,

    setFieldValue: (field, value) => {
      set((state) => ({
        values: { ...state.values, [field]: value },
        touched: { ...state.touched, [field]: true },
      }));

      const rules = get().validators?.[field];
      if (rules) {
        get().validateField(field, rules);
      }

      const watchers = get().watchers?.[field];
      if (watchers) {
        Object.keys(watchers).forEach((selfName) => {
          const handler = watchers[selfName];
          if (handler) {
            handler(value, {
              updateSelfValHandler: (newValue) =>
                get().setFieldValue(selfName, newValue),
            });
          }
        });
      }
    },

    setFieldError: (field, error) => {
      set((state) => ({
        errors: { ...state.errors, [field]: error },
      }));
    },

    validateField: async (field, rules) => {
      const { values, setFieldError } = get();
      const value = values[field];

      for (const rule of rules) {
        if (rule.required && !value) {
          setFieldError(field, rule.message || '该字段为必填项');
          return false;
        }

        if (rule.validator) {
          const isValid = await rule.validator(value);
          if (!isValid) {
            setFieldError(field, rule.message || '校验失败');
            return false;
          }
        }
      }

      setFieldError(field, undefined);
      return true;
    },

    registerValidator: (field, rules) => {
      set((state) => ({
        validators: { ...state.validators, [field]: rules },
      }));
    },

    registerWatcher: (selfName, field, handler) => {
      set((state) => ({
        watchers: {
          ...state.watchers,
          [field]: {
            ...state.watchers?.[field],
            [selfName]: handler,
          },
        },
      }));
    },

    validateForm: async () => {
      const { validators, validateField, values } = get();
      let isValid = true;

      for (const field of Object.keys(validators || {})) {
        const rules = validators[field];
        const fieldIsValid = await validateField(field, rules);
        if (!fieldIsValid) {
          isValid = false;
        }
      }

      return isValid ? values : false;
    },

    resetForm: () => {
      set({
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
      });
    },

    resetField: (field) => {
      set((state) => ({
        values: { ...state.values, [field]: initialValues[field] },
        errors: { ...state.errors, [field]: undefined },
        touched: { ...state.touched, [field]: false },
        isSubmitting: false,
      }));
    },
  }));
};

export default createFormStore;