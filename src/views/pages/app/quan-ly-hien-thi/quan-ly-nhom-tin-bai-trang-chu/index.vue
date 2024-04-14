<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'vue-toastification';
import { onKeyDown } from '@vueuse/core';
import { checkPermission } from '@/utils';
import { color } from '@/constants/statusColor';
import VPositionPopup from '@/components/base/VPositionPopup.vue';
import VTable from '@/components/base/VTable.vue';
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/store/useApi';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import Form from './form/Form.vue';

export interface ParamsNhomTinBai {
  page_index: number;
  page_size: number;
  status?: number;
}

const api = useApi();
const confirm = useConfirm();
const toast = useToast();
const overlayLoading = useOverLayLoadingStore();
const visibleModal = ref(false);
const isForm = ref<string>('');
const idForm = ref();
const tableRef = ref();
const items = ref([
  {
    label: 'Quản lý hiển thị trang chủ',
  },
  {
    label: 'Quản lý nhóm tin bài',
  },
]);
const home = ref({
  label: 'Trang chủ',
  to: '/home',
});

const headers = ref([
  'Tên nhóm tin bài',
  'Trạng thái',
  { name: 'Thứ tự hiển thị', alight: 'center' },
]);

const listTinBai = ref([]) as any;

const params = ref<ParamsNhomTinBai>({
  page_index: 1,
  page_size: 20,
});

const getList = async () => {
  overlayLoading.toggleLoading(true);
  try {
    const res = await api.get(
      `/cms/portal/v1/page_setting/list_page_setting?limit=${
        params.value.page_size
      }&page=${params.value.page_index}&status=${
        params.value.status ? params.value.status : 0
      }`,
    );
    listTinBai.value = res.data.data;
    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
  }
};

onMounted(async () => {
  await getList();
});

const onPageChange = (value: number) => {
  params.value.page_index = value;
  getList();
};
const onPerPageChange = (value: number) => {
  params.value.page_size = value;
};
const nameWidth = ref();
const onSetWidth = (value: number) => {
  nameWidth.value = value * 0.3;
};
const addForm = () => {
  visibleModal.value = true;
  isForm.value = 'them';
};
const editForm = (values: any) => {
  isForm.value = 'sua';
  visibleModal.value = true;
  idForm.value = values.id;
};
const viewTinBai = (values: any) => {
  isForm.value = 'xem';
  visibleModal.value = true;
  idForm.value = values.id;
};
const confirmDetete = (item: any) => {
  confirm.require({
    message: 'Bạn có chắc chắn muốn xóa nhóm tin bài này?',
    header: 'Xóa nhóm tin bài',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger p-button-xs nha-hang-accept-delete-button',
    acceptLabel: 'Đồng ý',
    rejectLabel: 'Đóng',
    rejectClass: 'p-button-secondary p-button-xs nha-hang-reject-delete-button',
    accept: async () => {
      await api
        .delete(`/cms/portal/v1/page_setting/delete_page_setting?id=${item.id}`)
        .then((response) => {
          if (response.data.code === 0) {
            overlayLoading.toggleLoading(false);
            getList();
            overlayLoading.toggleLoading(false);
            toast.success(response.data.message, {
              timeout: 3000,
            });
          } else {
            overlayLoading.toggleLoading(false);
            toast.error(response.data.message, {
              timeout: 3000,
            });
          }
        })
        .catch((error) => {
          overlayLoading.toggleLoading(false);
        });
    },
  });
};
interface Params {
  position?: any;
  id?: number;
}
const savePosition = async (id: number, inputNumber: any) => {
  const data: Params = {
    id,
    position: 0,
  };
  try {
    data.position = inputNumber === '' ? null : Number(inputNumber);
    const { data: formResponse } = await api.put(
      '/cms/portal/v1/page_setting/update_page_setting_position',
      data,
    );
    if (formResponse.code === 0) {
      toast.success(formResponse.message, {
        timeout: 5000,
      });
    } else {
      toast.error(formResponse.message, {
        timeout: 5000,
      });
    }
    getList();
  } catch (err) {
    console.error(err);
  }
};
const getRow = (value: any) => {
  console.log(value);
};
</script>
<template>
  <div class="filter">
    <div class="flex items-center justify-between pb-5">
      <Breadcrumb
        id="nha-hang-breadcrumb"
        class="breadcrumb"
        :home="home"
        :model="items"
      />
      <Button
        @click="addForm"
        class="button-green"
        id="nha-hang-add-button"
        label="Thêm mới"
        icon="pi pi-plus"
        v-show="checkPermission('them_nhom_tin_bai')"
      />
    </div>
  </div>
  <VTable
    idTable="nha-hang-table"
    ref="tableRef"
    @pageChanged="onPageChange"
    @perPageChange="onPerPageChange"
    @setWidth="onSetWidth"
    :tableName="'nhóm tin bài trang chủ'"
    @selectRow="getRow"
    :rows="listTinBai.page_settings"
    :headers="headers"
    :styleHeaders="[
      {
        idx: 0,
        class: 'w-[30%]',
      },
      {
        idx: 1,
        class: 'w-[20%] pl-4',
      },
      {
        idx: 2,
        class: 'w-[10%]',
      },
    ]"
    :pagination="{
      totalPage: listTinBai.total_page,
      total: listTinBai.record_count,
      perPage: params.page_size,
    }"
  >
    <template v-slot:items="{ row }">
      <td class="px-2">
        <div class="column-container" :style="{ width: nameWidth + 'px' }">
          {{ row.title }}
        </div>
      </td>
      <td class="text-[#54667a] px-2">
        <div class="column-container">
          <Tag
            :class="row.status === 2 ? color.Red : color.Green"
            :value="row.status === 2 ? 'Tạm khóa' : 'Hoạt động'"
          ></Tag>
        </div>
      </td>
      <td class="px-2">
        <div class="center-container">
          <VPositionPopup
            @save="savePosition(row.id, $event)"
            :num="row.position"
          ></VPositionPopup>
        </div>
      </td>
    </template>
    <template v-slot:actions="{ row }">
      <li
        @keydown="viewTinBai"
        class="item-action"
        @click="viewTinBai(row)"
        v-show="checkPermission('xem_chi_tiet_nhom_tin_bai')"
      >
        <i class="pi pi-eye text-xs mr-3"></i><span>Xem chi tiết</span>
      </li>
      <li
        @keydown="editForm"
        class="item-action"
        @click="editForm(row)"
        v-show="checkPermission('cap_nhat_thong_tin_nhom_tin_bai')"
      >
        <i class="pi pi-pencil text-xs mr-3"></i><span>Cập nhật</span>
      </li>
      <li
        class="item-action"
        @click="confirmDetete(row)"
        @keydown="onKeyDown"
        v-show="checkPermission('xoa_nhom_tin_bai')"
      >
        <i class="pi pi-trash text-xs mr-3"></i><span>Xóa</span>
      </li>
    </template>
  </VTable>
  <Dialog
    id="nha-hang-dialog"
    v-model:visible="visibleModal"
    :draggable="false"
    modal
    :header="
      isForm === 'them'
        ? 'THÊM MỚI NHÓM TIN BÀI'
        : isForm === 'sua'
        ? 'CẬP NHẬT NHÓM TIN BÀI'
        : isForm === 'xem'
        ? 'XEM CHI TIẾT NHÓM TIN BÀI'
        : ''
    "
    :style="{
      width: '70vw',
      height: '90vh',
      backgroundColor: '#fff',
      maxHeight: '100%',
    }"
    :pt="{
      content: { class: 'mb-[48px]' },
    }"
  >
    <Form
      :formType="isForm"
      :idForm="idForm"
      @closeForm="visibleModal = false"
      @editForm="editForm"
      @getList="getList"
    ></Form>
  </Dialog>
</template>
<style lang="scss" scoped>
.search-input {
  width: 180%;
}
.cap-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
  width: 20px;
}
</style>
