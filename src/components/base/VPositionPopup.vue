<script setup lang="ts">
import { ref, unref } from 'vue';
import * as yup from 'yup';
import { onKeyDown } from '@vueuse/core';
import { ClickOutside as vClickOutside } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import InputText from 'primevue/inputtext';

const emit = defineEmits(['save']);
const props = defineProps(['num']);

const validationSchema = yup.object({
  inputNumber: yup
    .string()
    .test(
      'is-positive-integer',
      'Giá trị nhập vào phải là số nguyên dương.',
      (value) => {
        if (value && value.trim() !== '') {
          const intValue = parseInt(value, 10);
          return (
            /^[0-9]\d*$/.test(value) && intValue > 0 && intValue <= 1000000
          );
        }
        return true;
      },
    ),
});
const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema,
});
const { value: inputNumber, errorMessage } = useField<string>('inputNumber');

const popoverRef = ref();
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
const getItem = () => {
  setFieldValue('inputNumber', props.num !== 0 ? props.num : '');
};
const close = () => {
  popoverRef.value.hide();
};
const formattedNumber = (number: string) => {
  const numStr = number.toString();
  if (numStr.length <= 4) {
    return numStr;
  }
  return `${numStr.slice(0, 2)}...${numStr.slice(-1)}`;
};
const onSubmit = handleSubmit(() => {
  emit('save', values.inputNumber);
  popoverRef.value.hide();
});
const handleInput = (event: any) => {
  inputNumber.value = event.target.value.replace(/[^0-9.\\-]/g, '');
  inputNumber.value = inputNumber.value.replace(/(\..*)\./g, '$1');
};

const handleKeyDown = (event: any) => {
  if (inputNumber.value.length === 6 && event.keyCode !== 8) {
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
  inputNumber.value = pastedText.replace(/[^0-9\\-]/g, '');
};
</script>
<template>
  <el-button
    class="w-[60px] !text-[13px]"
    @click="getItem"
    v-popover="popoverRef"
    v-click-outside="onClickOutside"
    >{{ num ? num : '...' }}</el-button
  >
  <el-popover
    width="160"
    ref="popoverRef"
    trigger="click"
    title="Thứ tự hiển thị"
    virtual-triggering
    persistent
    placement="right"
  >
    <form @submit="onSubmit">
      <div>
        <InputText
          class="mb-1"
          :min="1"
          :max="100000"
          v-model="inputNumber"
          type="number"
          @input="handleInput"
          @keydown="handleKeyDown"
          @paste="handlePaste"
        />
        <small
          v-if="errorMessage"
          class="p-error"
          id="oldpassworderr-text-error"
          >{{ errorMessage || '&nbsp;' }}</small
        >
      </div>
      <div class="mt-4 flex justify-between text-xs">
        <div
          class="bg-[#64748b] p-2 rounded-2xl text-white w-[56px] flex justify-center cursor-pointer"
          @click="close"
          @keydown="onKeyDown"
        >
          Đóng
        </div>
        <button
          class="bg-[#25BB94] p-2 rounded-2xl text-white w-[56px]"
          type="submit"
        >
          Lưu
        </button>
      </div>
    </form>
  </el-popover>
</template>

<style scoped lang="scss"></style>
