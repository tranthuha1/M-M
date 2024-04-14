<script lang="ts" setup>
import { useField } from 'vee-validate';
import InputText from 'primevue/inputtext';

const emit = defineEmits(['input']);
const props = withDefaults(
  defineProps<{
    name: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    max?: number;
    endTail?: string;
  }>(),
  {
    max: 100000,
  },
);

const { value: inputNumber, errorMessage } = useField<string>(props.name);
const handleInput = (event: any) => {
  inputNumber.value = event.target.value.replace(/[^0-9.\\-]/g, '');
  inputNumber.value = inputNumber.value.replace(/(\..*)\./g, '$1');
};

const handleKeyDown = (event: any) => {
  if (inputNumber.value?.length === 6 && event.keyCode !== 8) {
    event.preventDefault();
  }
  if (
    event.key === 'e'
    || event.key === 'E'
    || event.key === '+'
    || event.key === '-'
    || event.key === '.'
    || parseInt(inputNumber.value + event.key, 10) > 100000
  ) {
    event.preventDefault();
  }
};
const handlePaste = (event: any) => {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.Clipboard;
  const pastedText = clipboardData.getData('text/plain');
  inputNumber.value = pastedText.replace(/[^0-9.\\-]/g, '');
  inputNumber.value = inputNumber.value.replace(/(\..*)\./g, '$1');
};
</script>
<template>
  <div class="flex-col flex">
    <div class="p-inputgroup flex-1">
      <InputText
        @input="handleInput"
        @keydown="handleKeyDown"
        @paste="handlePaste"
        :disabled="disabled"
        v-model="inputNumber"
        :class="{
          'p-invalid': errorMessage,
        }"
        style="width: auto"
        class="mt-1"
        type="number"
        :placeholder="placeholder"
        min="1"
        :max="max"
        :id="id + 'field'"
      />
      <span
        v-if="endTail"
        class="p-inputgroup-addon text-sm"
        :class="{
          'invalid-end-tail': errorMessage,
        }"
        >{{ endTail }}</span
      >
    </div>
    <small
      v-if="errorMessage"
      class="p-error pt-1 pl-2"
      :id="id + '-text-error'"
      >{{ errorMessage || '&nbsp;' }}</small
    >
  </div>
</template>
