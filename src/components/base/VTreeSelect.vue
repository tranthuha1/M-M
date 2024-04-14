<script lang="ts" setup>
import { useField } from 'vee-validate';
import TreeSelect from 'primevue/treeselect';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  name: string;
  options: any;
  pt?: any;
  show?: true;
  placeholder?: string;
  disabled?: boolean;
  filter?: false;
}>();

const { value, errorMessage } = useField<string>(props.name);

const treeRef = ref();
const dropdownWidth = ref();
const getDropdownWidth = () => {
  if (treeRef.value) {
    dropdownWidth.value = treeRef.value.$el.offsetWidth;
  }
};
onMounted(() => {
  getDropdownWidth();
  window.addEventListener('resize', getDropdownWidth);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', getDropdownWidth);
});
</script>
<template>
  <div v-show="show" class="flex-col flex">
    <span class="p-float-label">
      <TreeSelect emptyMessage="Không có kết quả tìm kiếm" ref="treeRef" :disabled="disabled" v-model="value" :options="options" :class="[
        'w-full md:w-14rem',
        {
          'p-invalid': errorMessage,
        },
      ]" filter :pt="{
  wrapper: { style: `width:${dropdownWidth}px` }, ...pt
}" :placeholder="placeholder" aria-describedby="dd-error"></TreeSelect>
    </span>
    <small v-if="errorMessage" class="p-error" id="dd-error">{{
      errorMessage || '&nbsp;'
    }}</small>
  </div>
</template>
