<script lang="ts" setup>
import { useField } from 'vee-validate';
import Textarea from 'primevue/textarea';

const emit = defineEmits(['input']);
const props = defineProps<{
  name: string;
  rows: number;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  maxlength?: number;
}>();

const { value, errorMessage } = useField<string>(
  props.name,
);
</script>
<template>
  <Textarea
    autoResize
    @input="$emit('input')"
    :disabled="disabled"
    v-model="value"
    :maxlength="maxlength"
    :class="{
      'p-invalid': errorMessage,
    }"
    style="width: 100%"
    :rows="rows"
    :id="id + '-field'"
    :placeholder="placeholder"
    :pt="{
        root:  { class: '!max-h-[300px]  !overflow-y-auto' }
    }"
  />
  <small
  v-if="errorMessage"
    class="p-error pl-2"
    :id="id + '-text-error'"
  >{{ errorMessage || '&nbsp;' }}</small
  >
</template>
