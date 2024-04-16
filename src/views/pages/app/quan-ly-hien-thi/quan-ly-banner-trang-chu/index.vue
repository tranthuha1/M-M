<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { color } from '@/constants/statusColor';
import Dropdown from 'primevue/dropdown';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'vue-toastification';
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/store/useApi';
import VTable from '@/components/base/VTable.vue';
import { checkPermission } from '@/utils';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import { FormResponse } from '@/models/form';
import VPositionPopup from '@/components/base/VPositionPopup.vue';
import BannerInfoForm from './BannerInfoForm.vue';

interface ParamGetListBanner {
  search?: string;
  page: number;
  limit: number;
  status: number;
}

const confirmPrime = useConfirm();
const overlayLoading = useOverLayLoadingStore();
const api = useApi();
const toast = useToast();
const isShowModal = ref(false);
const ModalPrime = ref<string>('');
const searchKey = ref<string>('');
const tableRef = ref();
const params = ref<ParamGetListBanner>({
  search: searchKey.value,
  page: 1,
  limit: 20,
  status: 0,
});
const selectedStatus = ref({
  name: 'Tất cả',
  value: 0,
});
const status = ref([
  { name: 'Tất cả', value: 0 },
  { name: 'Hoạt động', value: 1 },
  { name: 'Tạm khoá', value: 2 },
]);
const customName = (name: string) => {
  let str = '';
  if (name?.length > 100) {
    str += name.substr(0, 99);
    str += '...';
    str += name.substr(name.length, name.length);
    return str;
  }
  return name;
};
const listBanner = ref([]) as any;
const banner = ref();
const getList = async () => {
  try {
    let param = `?limit=${params.value.limit}&page=${params.value.page}&status=${params.value.status}`;
    if (params.value.search) {
      param += `&search=${params.value.search}`;
    }
    overlayLoading.toggleLoading(true);
    const res = await api.get(`/cms/portal/v1/banner/list_banner${param}`);
    listBanner.value = res.data.data;
    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
  }
};
const openViewDetail = function (value:any) {
  banner.value = value;
  ModalPrime.value = 'xem';
  isShowModal.value = true;
};
const openEditForm = function (value: any) {
  banner.value = value;
  ModalPrime.value = 'sua';
  isShowModal.value = true;
};
const openAddForm = function () {
  banner.value = undefined;
  ModalPrime.value = 'them';
  isShowModal.value = true;
};
const deleteBanner = (value: any) => {
  confirmPrime.require({
    message: 'Bạn có chắc chắn muốn xóa banner này?',
    header: 'Xóa banner',
    acceptClass: 'button-error p-button-xs banner-accept-delete-button',
    rejectClass: 'p-button-secondary p-button-xs banner-reject-delete-button',
    icon: 'pi pi-info-circle',
    acceptLabel: 'Đồng ý',
    rejectLabel: 'Đóng',
    accept: async () => {
      overlayLoading.toggleLoading(true);
      await api
        .delete(`/cms/portal/v1/banner/delete_banner?banner_id=${value.id}`)
        .then((response) => {
          if (response.data.code === 0) {
            overlayLoading.toggleLoading(false);
            getList();
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
  position: number;
  banner_id: number;
}

const updatePosition = async (bannerId: number, inputNumber: any) => {
  const param: Params = {
    position: 0,
    banner_id: 0,
  };
  try {
    param.banner_id = bannerId;
    param.position = inputNumber === '' ? null : inputNumber;

    const { data: formResponse } = await api.put<FormResponse>(
      '/cms/portal/v1/banner/update_banner_position',
      param,
    );
    if (formResponse.code === 0) {
      toast.success(formResponse.message);
    } else {
      toast.error(formResponse.message);
    }
    getList();
  } catch (err: any) {
    console.error(err);
  }
};
const organization = ref<any>();
const headers = ref([
  'Ảnh banner PC',
  'Ảnh banner mobile',
  { name: 'Trạng thái', alight: 'center' },
  { name: 'Thứ tự hiển thị', alight: 'center' },
]);
const editForm = function (value: any) {
  ModalPrime.value = 'sua';
  isShowModal.value = true;
  organization.value = value;
};
const linkWidth = ref();
const onSetWidth = (value: number) => {
  linkWidth.value = value * 0.25;
};
const filterData = () => {
  params.value.search = searchKey.value.trim();
  params.value.status = selectedStatus.value.value;
  tableRef.value.filterData();
};
const onPageChange = (value: number) => {
  params.value.page = value;
  getList();
};
const onPerPageChange = (value: number) => {
  params.value.limit = value;
};
onMounted(async () => {
  await getList();
});
const items = ref([
  {
    label: 'Quản lý hiển thị trang chủ',
  },
  {
    label: 'Quản lý Banner',
    to: '/quan-ly-banner-trang-chu',
  },
]);
const home = ref({
  label: 'Trang chủ',
  to: '/home',
});
</script>
<template>
  <div class="flex items-center justify-between pb-5">
    <Breadcrumb class="breadcrumb" :home="home" :model="items" id="banner-breadcrumb"/>
    <Button
      id="banner-add-button"
      @click="openAddForm"
      class="button-green"
      label="Thêm mới"
      icon="pi pi-plus"
      v-show="checkPermission('them_banner')"
    />
  </div>
  <div class="flex flex-col filter-container" v-show="checkPermission('tim_kiem_banner')">
    <div class="flex justify-start">
      <div class="w-[48%] flex flex-col gap-1">
        <div class="w-[100px]" id="banner-search-status-title">Trạng thái</div>
        <Dropdown
          id="banner-search-status-component"
          input-id="banner-search-status-field"
          class="search-input"
          optionLabel="name"
          v-model="selectedStatus"
          :options="status"
          @change="filterData"
        />
      </div>
    </div>
  </div>
  <VTable
    id="banner-table"
    ref="tableRef"
    @pageChanged="onPageChange"
    @perPageChange="onPerPageChange"
    @setWidth="onSetWidth"
    :rows="listBanner.banners"
    :styleHeaders="[
      {
        idx: 0,
        class: 'w-[30%]',
      },
      {
        idx: 1,
        class: 'w-[20%]',
      },
      {
        idx: 2,
        class: 'w-[20%]',
      },
      {
        idx: 3,
        class: 'w-[20%]',
      },
    ]"
    :tableName="'banner'"
    :headers="headers"
    :pagination="{
      totalPage: listBanner?.total_page,
      total: listBanner?.record_count,
      perPage: params.limit,
    }"
  >
    <template v-slot:items="{ row }">
      <td class="text-[#54667a] px-2">
        <img
          class="w-[100%] h-[auto] pt-2 pb-2"
          :src="row.image_url"
          alt="Red dot"
        />
      </td>
      <td class="text-[#54667a] px-5">
        <img
          class="w-[100%] h-[auto] pt-2 pb-2"
          :src="row.app_image_url"
          alt="Red dot"
        />
      </td>
      <td class="px-2">
        <div class="center-container">
          <Tag :class="row.status === 1 ? color.Green : color.Red"
               :value="row.status === 1 ? 'Hoạt động' : 'Tạm dừng'"></Tag>
        </div>
      </td>
      <td class="px-2">
        <div class="center-container">
          <VPositionPopup
            @save="updatePosition(row.id, $event)"
            :num="row.position"
          ></VPositionPopup>
        </div>
      </td>
    </template>
    <template v-slot:actions="{ row }">
      <li
       @keydown="openViewDetail" class="item" @click="openViewDetail(row)"
       v-show="checkPermission('xem_chi_tiet_banner')">
        <i class="pi pi-eye text-xs mr-3"></i><span>Xem chi tiết</span>
      </li>
      <li
        @keydown="editForm"
        class="item"
        @click="openEditForm(row)"
        v-show="checkPermission('cap_nhat_thong_tin_banner')"
      >
        <i class="pi pi-pencil text-xs mr-3"></i><span>Cập nhật</span>
      </li>
      <li
        @keydown="deleteBanner(row)"
        class="item"
        @click="deleteBanner(row)"
        v-show="checkPermission('xoa_banner')"
      >
        <i class="pi pi-trash text-xs mr-3"></i><span>Xóa</span>
      </li>
    </template>
  </VTable>
  <Dialog
    id="banner-dialog"
    :closable="true"
    v-model:visible="isShowModal"
    :draggable="false"
    modal
    :header="ModalPrime === 'them' ? 'THÊM MỚI BANNER' : ModalPrime === 'xem' ? 'CHI TIẾT BANNER' : 'CẬP NHẬT BANNER'"
    :style="{
      width: '70vw',
      height: '90vh',
      backgroundColor: '#fff',
      maxHeight: '100%',
    }"
    :pt="{
      content: { class: 'mb-[70px]' },
    }"
  >
    <BannerInfoForm
      :banner="banner"
      :formType="ModalPrime"
      @closeForm="isShowModal = false"
      @getList="getList"
      @openEditForm="openEditForm"
    ></BannerInfoForm>
  </Dialog>
</template>
<style scoped>
.p-button-xs {
  min-width: 130px;
}

.item {
  padding: 4px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: var(--item-hover);
  }
}

.search-input {
  width: 100%;
}

.position-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
  width: 81px;
}

</style>
