<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue';

interface header {
  name: string;
  alight?: string;
  colSpan?: number;
  rowSpan?: number;
}
interface styleHeader {
  idx: number;
  row: number;
  class: string;
}
const tableCustom = ref();
const emit = defineEmits(['setWidth']);
const props = withDefaults(
  defineProps<{
    headers: header[][];
    styleHeaders: styleHeader[];
    disable?: boolean;
    idTable?: string;
  }>(),
  {
    disable: false,
  },
);
function updateWidth() {
  emit('setWidth', tableCustom.value.offsetWidth);
}
onMounted(() => {
  window.addEventListener('resize', updateWidth);
  emit('setWidth', tableCustom.value?.offsetWidth);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const styleHeaders = (idx: number, idxRow: number) => {
  const classObj = props.styleHeaders?.find(
    (item: any) => item.idx === idx && item.row === idxRow,
  );
  if (classObj) {
    return classObj.class;
  }
  return '';
};
</script>
<template>
  <div class="w-full p-3">
    <div ref="tableCustom" class="v-table-container">
      <table :id="idTable" class="v-table">
        <thead>
          <tr v-for="(row, idx1) in (headers as any)" :key="idx1">
            <th
              v-for="(col, idx) in (row as any)"
              :key="idx"
              :rowSpan="col.rowSpan ? col.rowSpan : 1"
              :colspan="col.colSpan ? col.colSpan : 1"
              :class="styleHeaders(idx, idx1)"
            >
              <div
                :class="col.alight ? 'flex justify-center items-center' : ''"
              >
                <div class="flex items-center">
                  <div class="flex items-center">
                    {{ col.name }}
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <slot name="items"></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  font-size: 13px;
  width: 100%;

  thead {
    top: 0;
    overflow-y: auto;
    background-color: #fff;
    z-index: 1;
  }
  thead tr {
    &:last-child {
      border-bottom: none;
    }
    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      font-weight: bold;
      border: 2px solid #eceeef;
      color: #54667a;
    }
  }
}
</style>
