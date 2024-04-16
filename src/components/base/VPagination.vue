<script setup lang="ts">
import { watch, ref } from 'vue';
import Paginate from 'vuejs-paginate-next';

const emit = defineEmits([
  'pageChanged',
  'perPageChange',
]);
defineProps({
  total: {
    type: Number,
    required: true,
  },
  totalPage: {
    type: Number,
    required: true,
  },
});
const perPage = ref(20);
const currentPage = ref(1);

const options = [
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 50,
    label: '50',
  },
];
const clickCallback = (pageNum: number) => {
  emit('pageChanged', pageNum);
};
const filterData = () => {
  clickCallback(1);
  currentPage.value = 1;
};
watch(perPage, (value) => {
  emit('perPageChange', value);
  clickCallback(1);
  currentPage.value = 1;
});
watch(currentPage, (value) => {
  console.log(value);
});
defineExpose({
  filterData,
});
</script>
<template>
  <div class="flex mt-4 items-center justify-between">
    <div class="flex items-center">
      <paginate v-model="currentPage" :page-count="totalPage" :page-range="2" :margin-pages="2"
        :click-handler="clickCallback" :prev-text="'«'" :next-text="'»'" :first-last-button="true"
        first-button-text="Trước" last-button-text="Sau">
      </paginate>
      <el-select v-model="perPage" class="w-[60px] ml-2" placeholder="Select" size="default">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <p class="text-sm text-[#54667a]">
      Hiển thị
      {{ (currentPage - 1) * perPage + 1 }} đến
      {{
        currentPage * perPage > total
        ? total
        : currentPage * perPage
      }}
      trong số {{ total }} mục
    </p>
  </div>
</template>
<style lang="scss" scoped>
@import url('../../css/component/pagination.css');
</style>
