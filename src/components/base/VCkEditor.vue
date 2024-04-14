<script lang="ts" setup>
import { useField } from 'vee-validate';
import Editor from 'primevue/editor';

defineEmits(['input']);
const props = defineProps<{
  name: string;
  rows: number;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  maxlength?: number;
  editorStyle?: string;
}>();

const { value, errorMessage } = useField<string>(props.name);
</script>
<template>
  <Editor
    @input="$emit('input')"
    :disabled="disabled"
    v-model="value"
    :maxlength="maxlength"
    :class="{
      'p-invalid': errorMessage,
    }"
    style="width: 100%"
    :id="id + '-field'"
    :placeholder="placeholder"
    :editorStyle="editorStyle"
  />
  <small class="p-error pl-2" :id="id + '-text-error'">{{
    errorMessage || '&nbsp;'
  }}</small>
</template>
