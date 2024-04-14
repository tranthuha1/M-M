<script lang="ts" setup>
// eslint-disable-next-line
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue';
import { useField } from 'vee-validate';
import { useApi } from '@/store/useApi';
import MultiSelect from 'primevue/multiselect';

const props = defineProps<{
  name: string;
  options: any;
  optionValue: string;
  optionLabel: string;
  pt?: any;
  show?: true;
  placeholder?: string;
  id?: string;
}>();

const { value, errorMessage } = useField<string>(
  props.name,
);
const maxSelectedLabels = 3;
const multiSelect = ref();
const dropdownWidth = ref();
const getDropdownWidth = () => {
  if (multiSelect.value) {
    dropdownWidth.value = multiSelect.value.$el.offsetWidth;
  }
};
onMounted(async () => {
  getDropdownWidth();
  window.addEventListener('resize', getDropdownWidth);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', getDropdownWidth);
});

</script>
<template>
  <div class="flex-col flex w-[100%]">
    <MultiSelect ref="multiSelect"
                 v-model="value"
                 :input-id="id+'-field'"
                 :id="id+'-component'"
                 :optionValue="optionValue"
                 :optionLabel="optionLabel"
                 :maxSelectedLabels="1"
                 :options="options"
                 filter
                 :placeholder="placeholder"
                 :class="['w-full md:w-14rem', {'p-invalid': errorMessage,}]"
                 :aria-describedby="value+'-dd-error'"
                 :pt="{
                    wrapper: { style: `width:${dropdownWidth}px` }
                    }"
    >
      <template #option="slotProps">
        <div :style="{ 'width': dropdownWidth + 'px', overflow: 'hidden', 'white-space': 'nowrap' }"
             class="text-ellipsis">
          {{ slotProps.option[optionLabel] }}
        </div>
      </template>
    </MultiSelect>
    <small class="p-error" :id="id+'-text-error'">{{ errorMessage || '&nbsp;' }}</small>
  </div>

</template>
<style>
.p-multiselect {
  height: 35px !important;
}

.p-multiselect-label {
  margin-top: -7px !important;
  font-size: 14px;
}

.p-multiselect-panel {
  font-size: 14px;
}
</style>
