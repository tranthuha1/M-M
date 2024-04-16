<script lang="ts" setup>
import { useField } from 'vee-validate';
import InputText from 'primevue/inputtext';

const emit = defineEmits(['input', 'keydown']);
const props = withDefaults(
  defineProps<{
    name: string;
    type: string;
    placeholder?: string;
    disabled?: boolean;
    maxlength?: number;
    min?: number;
    showErr?: boolean;
    max?: number;
    id?: string;
    endTail?: string;
  }>(),
  {
    showErr: false,
  },
);

const { value: inputNumber, errorMessage } = useField<string>(props.name);

const handleKeyDown = (event: any) => {
  if (props.type === 'onlyNumber') {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
    }
  }
};
function isNumeric(str: any) {
  return /^\d+$/.test(str);
}
const handlePaste = (event: any) => {
  if (props.type === 'onlyNumber') {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.Clipboard;
    const pastedText = clipboardData.getData('text/plain');
    if (isNumeric(pastedText)) {
      inputNumber.value += pastedText;
    }
  }
};
const handleBlur = (event: any) => {
  if (props.type === 'onlyNumber') {
    if (!isNumeric(inputNumber.value)) {
      inputNumber.value = '';
    }
  }
};
</script>
<template>
  <div class="flex-col flex">
    <div class="p-inputgroup flex-1">
      <InputText
        :id="id + '-field'"
        @input="$emit('input')"
        @keypress="handleKeyDown"
        @paste="handlePaste"
        @blur="handleBlur"
        :disabled="disabled"
        v-model="inputNumber"
        :maxlength="maxlength"
        :class="{
          'p-invalid': errorMessage,
        }"
        style="width: auto"
        class="mt-1"
        :type="type || 'text'"
        :placeholder="placeholder"
        :min="min"
        :max="max"
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
      v-if="errorMessage || showErr"
      class="p-error pt-1 pl-2"
      :id="id + '-text-error'"
      >{{ errorMessage || '&nbsp;' }}</small
    >
  </div>
</template>
<style scoped lang="scss">
.invalid-end-tail {
  background-color: #dd8484;
  border-color: #e24c4c;
  color: #e24c4c;
  font-weight: 500;
  border-right: 1px solid #dd848491 !important;
}
</style>
