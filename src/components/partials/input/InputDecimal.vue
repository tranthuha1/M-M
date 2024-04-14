<script lang="ts" setup>
import { useField } from 'vee-validate';
import InputNumber from 'primevue/inputnumber';

const emit = defineEmits(['input']);
const props = withDefaults(
  defineProps<{
    name: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    min?: number;
    max?: number;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    endTail?: string;
    suffix?: string;
    useGrouping?: boolean;
  }>(),
  {
    max: 100000000000000,
    useGrouping: false,
  },
);

const { value: inputNumber, errorMessage } = useField<number>(props.name);
</script>
<template>
  <div class="flex-col flex">
    <div class="p-inputgroup flex-1">
      <InputNumber
        :disabled="disabled"
        v-model="inputNumber"
        :class="{
          'p-invalid': errorMessage,
        }"
        style="width: auto"
        :useGrouping="useGrouping"
        class="mt-1"
        type="number"
        :input-id="id + '-field'"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :minFractionDigits="minFractionDigits"
        :maxFractionDigits="maxFractionDigits"
        :suffix="suffix"
      />
      <span
        v-if="endTail"
        class="p-inputgroup-addon text-sm min-w-[110px]"
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
