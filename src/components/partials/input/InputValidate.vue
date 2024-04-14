<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    decima?: boolean;
    min?: number;
    max?: number;
    id?: string;
    modelValue: number;
  }>(),
  {
    decima: false,
  },
);
defineEmits(['update:modelValue']);

// variable
const inputValue = ref('');

// function
const handleKeyDown = (event: any) => {
  if (inputValue.value.length === 6 && event.keyCode !== 8) {
    event.preventDefault();
  }
  if (
    event.key === 'e'
    || event.key === 'E'
    || event.key === '+'
    || (event.key === '-' && !props.decima)
    || (event.key === '.' && !props.decima)
    || parseInt(inputValue.value + event.key, 10) > 100000
  ) {
    event.preventDefault();
  }
};
const handlePaste = (event: any) => {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.Clipboard;
  const pastedText = clipboardData.getData('text/plain');
  inputValue.value = pastedText.replace(/[^0-9.\\-]/g, '');
  inputValue.value = inputValue.value.replace(/(\..*)\./g, '$1');
  inputValue.value = pastedText.replace(/[^0-9\\-]/g, '');
};
</script>
<template>
  <div class="w-full justify-center flex">
    <input
      :id="id + '-field'"
      class="input-table"
      type="number"
      :disabled="disabled"
      :placeholder="placeholder"
      :min="!decima ? 0 : min"
      :max="max ? max : 1000000"
      @keydown="handleKeyDown"
      @input="$emit('update:modelValue', $event.target.value)"
      @paste="handlePaste"
    />
  </div>
</template>

<style scoped lang="scss">
.input-table {
  width: 50%;
  text-align: center;
  border-bottom: 1px dashed #ccc;
}
input:focus {
  outline: none;
  border-bottom: 1px dashed #ccc;
}
</style>
