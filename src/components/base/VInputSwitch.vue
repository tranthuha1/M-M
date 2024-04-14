<script lang="ts" setup>
import { useField } from 'vee-validate';
import InputSwitch from 'primevue/inputswitch';

const props = defineProps<{
  name: string;
  disabled?: boolean;
  trueValue?: any;
  falseValue?: any;
  id?: string;
}>();

const { value, errorMessage } = useField<string>(props.name);
</script>
<template>
  <div>
    <InputSwitch
      :input-id="id+'-field'"
      :id="id+'-component'"
      :class="{ 'p-invalid': errorMessage }"
      aria-describedby="text-error"
      :disabled="disabled"
      v-model="value"
      :trueValue="trueValue"
      :falseValue="falseValue"
    />
    <small class="p-error pt-1 pl-2" :id="id+'-text-error'">{{
        errorMessage || '&nbsp;'
      }}</small>
  </div>
</template>
