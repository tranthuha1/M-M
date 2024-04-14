<script lang="ts" setup>
import { useField } from 'vee-validate';
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';

const props = defineProps<{
  name: string;
  categories: any[];
  disabled?: boolean;
  id?: string;
}>();

const selectedCategories = ref(['Marketing']);
const { value, errorMessage } = useField<any[]>(props.name);
const test = function () {
  console.log(value.value);
};
</script>
<template>
  <div class="flex flex-wrap gap-3 mt-2">
    <div class="flex flex-col gap-3">
      <div v-for="(category, index) of categories" :key="index">
        <Checkbox
          v-model="value"
          @change="test"
          :input-id="id + '-field-' + index"
          :value="category.key"
          name="category"
          :disabled="disabled"
          aria-describedby="chbx-error"
        />
        <label class="pl-[20px] cursor-pointer" :for="id + '-field-' + index">{{ category.name }}</label>
      </div>
    </div>
  </div>
</template>
