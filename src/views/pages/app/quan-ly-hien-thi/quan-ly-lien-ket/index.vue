<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'vue-toastification';
import { onKeyDown } from '@vueuse/core';
import { checkPermission } from '@/utils';
import VTable from '@/components/base/VTable.vue';
import { color } from '@/constants/statusColor';
import VPositionPopup from '@/components/base/VPositionPopup.vue';
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/store/useApi';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import Form from './form/Form.vue';

export interface ParamsLienKet {
  str: string;
  page_index: number;
  page_size: number;
  status?: number;
  diemDen?: number;
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
    label: 'Quản lý hiển thị',
  },
  {
    label: 'Quản lý liên kết',
  },
]);
const home = ref({
  label: 'Trang chủ',
  to: '/home',
});

const headers = ref([
  'Tên liên kết',
  'Trạng thái',
  { name: 'Thứ tự hiển thị', alight: 'center' },
]);
const status = ref([
  { name: 'Tất cả' },
  { name: 'Hoạt động', id: 1 },
  { name: 'Tạm khóa', id: 2 },
]);
const selectedStatus = ref<{
  name: string;
  id?: number;
}>({ name: 'Tất cả' });

const listLienKet = ref([]) as any;
const searchKey = ref<string>('');
const params = ref<ParamsLienKet>({
  str: searchKey.value,
  page_index: 1,
  page_size: 20,
  status: selectedStatus.value.id,
});

const getList = async () => {
  overlayLoading.toggleLoading(true);
  try {
    const res = await api.get(
      `/cms/portal/v1/link/list_link?keyword=${encodeURIComponent(
        params.value.str.trim(),
      )}&limit=${params.value.page_size}&page=${
        params.value.page_index
      }&status=${params.value.status ? params.value.status : 0}`,
    );
    listLienKet.value = res.data.data;
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
const filterData = () => {
  params.value.str = searchKey.value;
  params.value.status = selectedStatus.value.id;
  tableRef.value.filterData();
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
const viewLienKet = (values: any) => {
  isForm.value = 'xem';
  visibleModal.value = true;
  idForm.value = values.id;
};
const confirmDetete = (item: any) => {
  confirm.require({
    message: 'Bạn có chắc chắn muốn xóa liên kết này?',
    header: 'Xóa liên kết',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger p-button-xs nha-hang-accept-delete-button',
    acceptLabel: 'Đồng ý',
    rejectLabel: 'Đóng',
    rejectClass: 'p-button-secondary p-button-xs nha-hang-reject-delete-button',
    accept: async () => {
      await api
        .delete(`/cms/portal/v1/link/delete_link?id=${item.id}`)
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
      '/cms/portal/v1/link/update_link_position',
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
        v-show="checkPermission('them_lien_ket')"
      />
    </div>
    <div
      class="filter-container flex flex-col gap-5"
      v-show="checkPermission('tim_kiem_lien_ket')"
    >
      <div class="flex justify-between gap-5">
        <div
          class="w-[48%] flex flex-col gap-1"
          id="notification-search-key-group"
        >
          <div class="w-[100px]" id="notification-search-key-title">
            Liên kết
          </div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              class="search-input-qlbv"
              @keydown.enter="filterData"
              type="text"
              v-model="searchKey"
              placeholder="Nhập từ khóa tìm kiếm"
              id="notification-search-key-field"
            />
          </span>
        </div>
        <div
          class="w-[48%] flex flex-col gap-1"
          id="notification-search-status-group"
        >
          <div id="notification-search-status-title">Trạng thái</div>
          <Dropdown
            id="notification-search-status-component"
            input-id="notification-search-status-field"
            class="status-dropdown"
            optionLabel="name"
            v-model="selectedStatus"
            :options="status"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <Button
          class="button-green"
          label="Tra cứu"
          id="nha-hang-search-button"
          icon="pi pi-search"
          @click="filterData"
        />
      </div>
    </div>
  </div>
  <VTable
    idTable="lien-ket-table"
    ref="tableRef"
    @pageChanged="onPageChange"
    @perPageChange="onPerPageChange"
    @setWidth="onSetWidth"
    :tableName="'liên kết'"
    @selectRow="getRow"
    :rows="listLienKet.links"
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
      totalPage: listLienKet.total_page,
      total: listLienKet.record_count,
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
        @keydown="viewLienKet"
        class="item-action"
        @click="viewLienKet(row)"
        v-show="checkPermission('xem_chi_tiet_lien_ket')"
      >
        <i class="pi pi-eye text-xs mr-3"></i><span>Xem chi tiết</span>
      </li>
      <li
        @keydown="editForm"
        class="item-action"
        @click="editForm(row)"
        v-show="checkPermission('cap_nhat_thong_tin_lien_ket')"
      >
        <i class="pi pi-pencil text-xs mr-3"></i><span>Cập nhật</span>
      </li>
      <li
        class="item-action"
        @click="confirmDetete(row)"
        @keydown="onKeyDown"
        v-show="checkPermission('xoa_lien_ket')"
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
        ? 'THÊM MỚI LIÊN KẾT'
        : isForm === 'sua'
        ? 'CẬP NHẬT LIÊN KẾT'
        : isForm === 'xem'
        ? 'XEM CHI TIẾT LIÊN KẾT'
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
