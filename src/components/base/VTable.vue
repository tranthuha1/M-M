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
import { OnClickOutside } from '@vueuse/components';
import { onKeyDown } from '@vueuse/core';
import { useSideBar } from '@/store/sidebar';
import VPagination from './VPagination.vue';

export interface StyleHeaders {
  idx: number;
  class: string;
}

const emit = defineEmits([
  'pageChanged',
  'selectRow',
  'perPageChange',
  'sortTable',
  'setWidth',
]);
const visible = ref([]) as any;
const sideBar = useSideBar();
const selectedSortField = ref(null);
const paginationRef = ref();
const editWidth = ref('w-[10%]');
const STTWidth = ref('w-[10%]');
const props = defineProps({
  headers: {
    type: Array,
    required: false,
  },
  rows: {
    type: [Object],
    required: true,
  },
  titleSTT: {
    type: String,
    default() {
      return 'STT';
    },
  },
  pagination: {
    type: Object,
    required: true,
  },
  showChecbox: {
    type: Boolean,
    default: false,
  },
  tableName: {
    type: String,
  },
  styleHeaders: {
    type: Array,
  },
  keySortTable: {
    type: Array,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  showAction: {
    type: Boolean,
    default: true,
  },
  idTable: {
    type: String,
    default: 'table',
  },
});
const sortStates = reactive({}) as any;
const rowIds = ref([]) as any;
const checkedAll = ref<boolean>(false);
const currentPage = ref<number>(1);
const close = (idx: string) => {
  visible.value[idx] = false;
};
const tableCustom = ref();
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
const onPageChange = (page: number) => {
  emit('pageChanged', page);
  currentPage.value = page;
};
const onPerPageChange = (perPage: number) => {
  emit('perPageChange', perPage);
};
const select = (row: any) => {
  checkedAll.value = rowIds.value.length === props.rows.length;
  emit('selectRow', rowIds.value);
};
const selectAll = () => {
  rowIds.value = [];
  if (checkedAll.value) {
    rowIds.value = props.rows.map((row: any) => row);
  }
  emit('selectRow', rowIds.value);
};
const filterData = () => {
  paginationRef.value.filterData();
};
const styleHeaders = (idx: number) => {
  const classObj = props.styleHeaders?.find(
    (item: any) => item.idx === idx,
  ) as StyleHeaders;
  if (classObj) {
    return classObj.class;
  }
  return '';
};
const checkOrder = computed(
  () => (key: string) => props.keySortTable?.includes(key) || false,
);
const updateSortState = (key: string) => {
  if (sortStates[key] === undefined) {
    sortStates[key] = 'asc';
  } else if (sortStates[key] === 'asc') {
    sortStates[key] = 'desc';
  } else {
    sortStates[key] = 'asc';
  }
};
const sortTable = (colKey: any) => {
  if (props.keySortTable?.includes(colKey)) {
    selectedSortField.value = colKey;
    updateSortState(colKey);
    emit('sortTable', { [colKey]: sortStates[colKey] });
  }
};
watch(
  () => sideBar.changeWidth,
  () => {
    nextTick(() => {
      updateWidth();
    });
  },
);
defineExpose({
  rowIds,
  filterData,
  editWidth,
  STTWidth,
  checkedAll,
  selectAll,
  updateWidth,
});
</script>
<template>
  <div class="w-full p-3">
    <div ref="tableCustom" class="v-table-container">
      <table class="v-table" :id="idTable" style="width: 100%">
        <thead>
          <tr>
            <th class="pl-2 w-[5%]" v-if="showChecbox">
              <div for="checkAll">
                <input
                  class="checkBoxTable"
                  type="checkbox"
                  v-model="checkedAll"
                  @change="selectAll"
                />
              </div>
            </th>
            <th :class="`${STTWidth}`">{{ titleSTT }}</th>
            <th
              class="px-2"
              v-for="(col, idx) in (headers as any)"
              :key="idx"
              :class="styleHeaders(idx)"
              @click="sortTable(col.key)"
            >
              <div
                :class="col.alight ? 'flex justify-center items-center' : ''"
              >
                <div
                  class="flex items-center"
                  :class="checkOrder(col.key) ? ' cursor-pointer' : ''"
                >
                  <div
                    :class="
                      col.key === selectedSortField ? 'text-[#7aca97]' : ''
                    "
                    class="flex items-center"
                  >
                    {{ col.name || col }}
                    <div
                      class="pl-2"
                      v-if="checkOrder(col.key)"
                      @keydown="onKeyDown"
                    >
                      <i
                        class="pi pi-sort-alt"
                        v-if="
                          checkOrder(col.key) &&
                          (col.key !== selectedSortField ||
                            !sortStates[col.key])
                        "
                      ></i>
                      <div v-else>
                        <i
                          class="pi pi-sort-amount-down-alt"
                          v-if="sortStates[col.key] === 'desc'"
                        ></i>
                        <i class="pi pi-sort-amount-up-alt" v-else></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </th>
            <th v-if="showAction" :class="`${editWidth}`">
              <div class="flex justify-end">Thao tác</div>
            </th>
          </tr>
        </thead>
        <tbody v-if="rows?.length">
          <tr v-for="(row, idx) in rows" :key="idx">
            <td class="w-[5%]" v-if="showChecbox">
              <label for="checkbox">
                <input
                  class="checkBoxTable"
                  type="checkbox"
                  @change="select"
                  v-model="rowIds"
                  :value="row"
                />
              </label>
            </td>
            <td>
              {{ (currentPage - 1) * pagination.perPage + idx + 1 }}
            </td>
            <slot name="items" :row="row"></slot>
            <td v-if="showAction" class="px-2 action">
              <div class="flex justify-end">
                <OnClickOutside
                  class="w-[18px] relative cursor-pointer mr-3"
                  @trigger="close(idx)"
                >
                  <div>
                    <i
                      class="pi pi-ellipsis-h py-2"
                      @click="() => (visible[idx] = !visible[idx])"
                      @keydown="onKeyDown"
                    ></i>
                  </div>
                  <div
                    class="dropdown-menu"
                    v-if="visible[idx]"
                    @click="() => (visible[idx] = !visible[idx])"
                    @keydown="onKeyDown"
                  >
                    <ul>
                      <slot :row="row" name="actions"></slot>
                    </ul>
                  </div>
                </OnClickOutside>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4 text-[#000]" v-if="!rows?.length">
        <h1>{{ `Không tìm thấy ${props.tableName} phù hợp` }}</h1>
      </div>
    </div>
    <div v-show="rows?.length && showPagination">
      <VPagination
        :id="idTable + '-pagination'"
        ref="paginationRef"
        :total="pagination.total"
        :totalPage="pagination.totalPage"
        @pageChanged="onPageChange"
        @perPageChange="onPerPageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-table {
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
    border-bottom: 1px solid #f3f1f1;

    &:last-child {
      border-bottom: none;
    }

    td {
      height: 53px;
      padding: 8px;
      color: #54667a;
    }

    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      font-weight: bold;
      border-bottom: 2px solid #eceeef;
      color: #54667a;
    }
  }
}

tbody tr {
  border-bottom: 1px solid #f3f1f1;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #ddd;
  }

  td {
    height: 53px;
    padding: 8px;
    color: #54667a;
  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    font-weight: bold;
    border-bottom: 2px solid #eceeef;
    color: #54667a;
  }
}

.dropdown-menu {
  position: absolute;
  left: -134px;
  z-index: 999;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  width: 150px;
}
.checkBoxTable {
  cursor: pointer;
}
</style>
