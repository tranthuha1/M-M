<script lang="ts" setup>
import { useField } from 'vee-validate';
import Calendar from 'primevue/calendar';

const props = defineProps<{
  name: string;
  disabled?: boolean;
  id?: string;
}>();

const { value, errorMessage } = useField<string>(
  props.name,
);
</script>
<template>
  <div class="flex flex-wrap gap-3 mt-2 w-[100%]">
    <Calendar :input-id="id" class="w-full" v-model="value" :class="{ 'p-invalid': errorMessage }" dateFormat="dd/mm/yy"
              placeholder="dd/mm/yyyy hh:mm"
              showTime binary aria-describedby="chbx-error" :disabled="disabled" showIcon/>
    <!--    <small class="p-error" id="chbx-error">{{-->
    <!--        errorMessage || '&nbsp;'-->
    <!--      }}</small>-->
  </div>

</template>
