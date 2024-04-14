<script lang="ts" setup>
import { useField } from 'vee-validate';
import Calendar from 'primevue/calendar';

const props = withDefaults(
  defineProps<{
    name: string;
    disabled?: boolean;
    placeholder?: string;
    dateFormat?: string;
    showTime?: boolean;
    minDate?: any;
    maxDate?: any;
    id?: string;
  }>(),
  {
    showTime: false,
  },
);
const emit = defineEmits(['dateChange', 'blur']);
const { value, errorMessage } = useField<string>(props.name);
</script>
<template>
  <div class="flex flex-wrap gap-1 w-[100%]">
    <Calendar
      :id="id + '-component'"
      :input-id="id + '-field'"
      class="v-calendar"
      :showOnFocus="false"
      v-model="value"
      :class="{ 'p-invalid': errorMessage && !disabled }"
      :dateFormat="dateFormat"
      :placeholder="placeholder"
      @blur="emit('blur')"
      :showTime="showTime"
      :disabled="disabled"
      showIcon
      :minDate="minDate"
      :maxDate="maxDate"
      @update:modelValue="emit('dateChange')"
    />
    <small
      v-if="errorMessage && !disabled"
      class="p-error"
      :id="id + '-text-error'"
      >{{ errorMessage || '&nbsp;' }}</small
    >
  </div>
</template>
<style scoped>
.v-calendar {
  width: 100%;
}
</style>
