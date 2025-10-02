/**
 * Exportações dos componentes de formulários dinâmicos
 */

export { default as DynamicForm } from '@/components/dynamic-forms/DynamicForm';
export { default as DynamicField } from '@/components/dynamic-forms/DynamicField';
export { default as DynamicInput } from '@/components/dynamic-forms/DynamicInput';
export { default as DynamicSelect } from '@/components/dynamic-forms/DynamicSelect';
export { default as DynamicFileInput } from '@/components/dynamic-forms/DynamicFileInput';
export { default as DynamicContainer } from '@/components/dynamic-forms/DynamicContainer';
export { default as DynamicButton } from '@/components/dynamic-forms/DynamicButton';
export { default as DynamicAutocomplete } from '@/components/dynamic-forms/DynamicAutocomplete';
export { default as DynamicCheckbox } from '@/components/dynamic-forms/DynamicCheckbox';

// Re-exporta o hook
export { useDynamicForm } from '@/hooks/use-dynamic-form';

// Re-exporta utilitários
export * from '@/lib/dynamic-forms/utils';
export * from '@/lib/dynamic-forms/validators';
