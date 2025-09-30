/**
 * Exportações dos componentes de formulários dinâmicos
 */

export { default as DynamicForm } from './DynamicForm';
export { default as DynamicField } from './DynamicField';
export { default as DynamicInput } from './DynamicInput';
export { default as DynamicSelect } from './DynamicSelect';
export { default as DynamicFileInput } from './DynamicFileInput';
export { default as DynamicContainer } from './DynamicContainer';
export { default as DynamicButton } from './DynamicButton';

// Re-exporta o hook
export { useDynamicForm } from '@/hooks/use-dynamic-form';

// Re-exporta utilitários
export * from '@/lib/dynamic-forms/utils';
export * from '@/lib/dynamic-forms/validators';
