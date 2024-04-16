<script lang="ts" setup>
import { useField } from 'vee-validate';
import RadioButton from 'primevue/radiobutton';
import { onKeyDown } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    name: string;
    data: { name: string; key: any }[];
    disabled?: boolean;
    id?: string;
    flexCol?: boolean;
  }>(),
  {
    flexCol: false,
  },
);
const { value, errorMessage } = useField<string>(props.name);

const onLabelClick = (id: string) => {
  value.value = id;
};
const emit = defineEmits(['change']);
</script>
<template>
  <div
    class="flex flex-wrap gap-3 mt-2 radio-container"
    :class="flexCol ? 'flex-col' : ''"
    :id="id + '-component'"
  >
    <div
      v-for="item in data"
      :key="'rdb_' + item.key"
      class="flex align-items-center radio-item"
    >
      <RadioButton
        v-model="value"
        :id="id + '-field-radio-' + item.key"
        :name="item.name"
        :value="item.key"
        @change="emit('change')"
        :inputId="id + '-field-' + item.key"
        :disabled="disabled"
      />
      <label
        :class="disabled ? 'disable' : ''"
        @click="onLabelClick(item.key)"
        :for="item.name"
        :htmlFor="item.key"
        class="ml-2 cursor-pointer"
        :id="id + '-label-' + item.key"
        @keydown="onKeyDown"
        >{{ item.name }}</label
      >
    </div>
    <small v-if="errorMessage" class="p-error" :id="id + '-text-error'">{{
      errorMessage || '&nbsp;'
    }}</small>
  </div>
</template>
<style scoped>
.radio-container {
  font-size: 14px;
}

.disable {
  pointer-events: none;
}
</style>
