<!-- eslint-disable no-param-reassign -->
<script lang="ts" setup>
import { useField } from 'vee-validate';
import Skeleton from 'primevue/skeleton';
import {
  ref, watch, onMounted, nextTick,
} from 'vue';
import { cloneDeep, debounce } from 'lodash';
import CheckDownIcon from '@/components/base/CheckDownIcon.vue';
import { useTreeSelect } from '@/store/treeSelect';

defineEmits(['change']);
const props = withDefaults(
  defineProps<{
    name: string;
    data: any;
    pt?: any;
    placeholder?: string;
    disabled?: boolean;
    showErr?: boolean;
    id?: string;
  }>(),
  {
    showErr: false,
  },
);

const refTree = ref();
const listFilter = ref();
const expandedKeys = ref([1]) as any;
const isLoading = ref(false);
const { value, errorMessage } = useField<string>(props.name);
const isScroll = useTreeSelect();
const dropdownWidth = ref();
const isHideDropdown = ref(true);

const getDropdownWidth = () => {
  if (refTree.value) {
    dropdownWidth.value = refTree.value.$el.offsetWidth - 50;
  }
};
// eslint-disable-next-line vue/no-setup-props-destructure
onMounted(() => {
  window.addEventListener('resize', getDropdownWidth);
  nextTick(() => {
    refTree.value.$el
      .querySelectorAll('.el-input__inner')[0]
      .removeAttribute('readonly');
  });
});

function filterTreeByLabel(tree: any, searchText: string) {
  return tree?.filter((node: any) => {
    if (
      node?.label
        ?.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(searchText)
    ) {
      const filteredChildren = filterTreeByLabel(node.children, searchText);
      if (filteredChildren?.length > 0) {
        node.children = filteredChildren;
        return true;
      }
      return true;
    }
    const filteredChildren = filterTreeByLabel(node.children, searchText);
    if (filteredChildren?.length > 0) {
      node.children = filteredChildren;
      return true;
    }
    return false;
  });
}
const expandNode = (node: any) => {
  expandedKeys.value[node.value] = node.value;
  if (node.children && node.children.length) {
    node.children.map(expandNode);
  }
};
const expandAll = () => {
  listFilter.value[0].children.slice(0, 2).map(expandNode);
};
const debouncedInputHandler = debounce((event) => {
  listFilter.value = filterTreeByLabel(
    cloneDeep(props.data),
    event.target.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
  );
  isLoading.value = false;
  if (event.target.value !== '') {
    expandAll();
  } else {
    expandedKeys.value = [1];
  }
}, 1000);

nextTick(() => {
  const input = refTree.value.$el.querySelectorAll('.el-input__inner')[0];
  input?.addEventListener('input', (event: any) => {
    isLoading.value = true;
    debouncedInputHandler(event);
  });
});
const blurTree = function () {
  refTree.value.blur();
};
const visibleDropdown = (type) => {
  isHideDropdown.value = !isHideDropdown.value;
  if (!type) {
    refTree.value.$el.querySelectorAll('.el-input__inner')[0].blur();
  }
};

watch(isScroll, () => {
  blurTree();
});
watch(
  () => props.data,
  (data) => {
    listFilter.value = props.data;
  },
);
</script>
<template>
  <div
    :class="[
      'w-full container',
      {
        'p-invalid': errorMessage,
      },
    ]"
  >
    <el-tree-select
      :id="id"
      ref="refTree"
      class="rounded-3xl w-full md:w-14rem el-tree"
      v-model="value"
      empty-text="Không có kết quả tìm kiếm"
      :suffix-icon="CheckDownIcon"
      :suffix-transition="false"
      :data="listFilter"
      :disabled="disabled"
      check-strictly
      :placeholder="placeholder"
      :default-expanded-keys="expandedKeys"
      @change="() => $emit('change')"
      @visible-change="visibleDropdown"
    >
      <template #default="{ data: { label } }">
        <div v-if="isLoading">
          <Skeleton width="100%" class="mb-2"></Skeleton>
        </div>
        <div
          v-else
          :class="id + label"
          :style="{ width: dropdownWidth * 0.9 + 'px' }"
        >
          {{ label }}
        </div>
      </template></el-tree-select
    >
  </div>
  <small
    v-if="(errorMessage && isHideDropdown) || showErr"
    class="p-error pl-2"
    :id="id + '-text-error'"
    >{{ errorMessage || '&nbsp;' }}</small
  >
</template>
<style scoped lang="scss">
.select-element-container {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.container {
  border-radius: 30px;
}
::v-deep .el-input__wrapper {
  border-radius: 30px;
}
::v-deep .el-popper {
  --el-tree-node-content-height: 40px;
  display: none;
}
.p-invalid {
  border: 1px solid #e24c4c;
}

::v-deep .el-tree {
  --el-tree-node-content-height: 26px;
  border-radius: 30px !important;
}
</style>
