<script lang="ts" setup>
import { useField } from 'vee-validate';
import Checkbox from 'primevue/checkbox';

const props = defineProps<{
  name: string;
  disabled?: boolean;
  id?: string;
  label?: string;
}>();

const { value, errorMessage } = useField<string>(props.name);
</script>
<template>
  <div class="flex flex-wrap gap-3 mt-2">
    <Checkbox
      :input-id="id + '-field'"
      v-model="value"
      :class="{ 'p-invalid': errorMessage }"
      :disabled="disabled"
      binary
      aria-describedby="chbx-error"
    />
    <label for="ingredient1" class="ml-2"> {{ label }} </label>
    <small class="p-error" :id="id + '-text-error'">{{
      errorMessage || '&nbsp;'
    }}</small>
  </div>
</template>
