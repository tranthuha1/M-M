<script lang="ts" setup>
// eslint-disable-next-line object-curly-newline
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useField } from 'vee-validate';
import Dropdown from 'primevue/dropdown';

const props = withDefaults(
  defineProps<{
    name: string;
    options: any;
    optionValue?: string;
    optionLabel: string;
    pt?: any;
    show?: boolean;
    isFilter?: boolean;
    placeholder?: string;
    disabled?: boolean;
    filter?: boolean;
    showErr?: boolean;
    isShowIcon?: boolean;
    id?: string;
    showClear?: boolean;
  }>(),
  {
    isFilter: true,
    showErr: false,
  },
);

const dropdown = ref();
const { value, errorMessage } = useField<string>(props.name);

const dropdownWidth = ref();
const getDropdownWidth = () => {
  if (dropdown.value) {
    dropdownWidth.value = dropdown.value.$el.offsetWidth - 50;
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
      <Dropdown
        :id="id + '-component'"
        resetFilterOnHide
        ref="dropdown"
        :disabled="disabled"
        :optionValue="optionValue"
        v-model="value"
        :options="options"
        emptyFilterMessage="Không có kết quả tìm kiếm"
        :optionLabel="optionLabel"
        :class="[
          'w-full md:w-14rem',
          {
            'p-invalid': errorMessage,
          },
        ]"
        :filter="isFilter"
        :pt="pt"
        :placeholder="placeholder"
        :show-clear="showClear"
        aria-describedby="dd-error"
      >
        <template #option="slotProps">
          <div
            :style="{
              width: dropdownWidth + 'px',
              overflow: 'hidden',
              'white-space': 'nowrap',
            }"
            class="text-ellipsis"
          >
            <div class="flex items-center flex-row gap-x-4">
              <i
                v-if="isShowIcon"
                class="cursor-pointer"
                :class="slotProps.option?.icon"
              ></i
              >{{ slotProps.option[optionLabel] }}
            </div>
          </div>
        </template>
        <template #value="slotProps" v-if="isShowIcon">
          <div class="flex items-center" v-if="slotProps.value">
            <i class="cursor-pointer mr-3" :class="slotProps.value?.icon"></i>
            <div>{{ slotProps.value?.name }}</div>
          </div>
          <div v-else>{{ slotProps.placeholder }}</div>
        </template></Dropdown
      >
    </span>
    <small
      v-if="errorMessage || showErr"
      class="p-error pt-1 pl-2"
      :id="id + '-text-error'"
      >{{ errorMessage || '&nbsp;' }}</small
    >
  </div>
</template>
<style scoped></style>
