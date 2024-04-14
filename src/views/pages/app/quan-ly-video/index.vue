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
import { statusVideo } from '@/constants/video';
import Form from './form/Form.vue';

export interface ParamsVideo {
  str: string;
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
const typeUser = ref();
const items = ref([
  {
    label: 'Quản lý video',
  },
]);
const home = ref({
  label: 'Trang chủ',
  to: '/home',
});

const headers = ref([
  'Tên video',
  'Ảnh đại diện',
  { name: 'Điểm đến' },
  { name: 'Trạng thái', alight: 'center' },
  { name: 'Thứ tự hiển thị', alight: 'center' },
]);
const status = ref([
  { name: 'Tất cả' },
  { name: 'Hoạt động', id: 1 },
  { name: 'Tạm khóa', id: 2 },
  { name: 'Chờ duyệt', id: 3 },
  { name: 'Từ chối duyệt', id: 4 },
]);
const selectedStatus = ref<{
  name: string;
  id?: number;
}>({ name: 'Tất cả' });

const listVideo = ref([]) as any;
const searchKey = ref<string>('');
const params = ref<ParamsVideo>({
  str: searchKey.value,
  page_index: 1,
  page_size: 20,
  status: selectedStatus.value.id,
});

const diemDen = ref([]) as any;
const getListDiemDen = async () => {
  try {
    const res = await api.get(
      '/cms/portal/v1/category/list_all_category?group=3',
    );
    const newArray = res.data.data.categories.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
    diemDen.value.push(...newArray);
  } catch (err: any) {
    console.error(err);
  }
};

const getList = async () => {
  overlayLoading.toggleLoading(true);
  try {
    const res = await api.get(
      `/cms/portal/v1/video/list_video?keyword=${encodeURIComponent(
        params.value.str.trim(),
      )}&limit=${params.value.page_size}&page=${
        params.value.page_index
      }&status=${params.value.status ? params.value.status : 0}`,
    );
    listVideo.value = res.data.data;
    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
  }
};

onMounted(async () => {
  await getList();
  await getListDiemDen();
  typeUser.value = JSON.parse(
    localStorage.getItem('user') as any,
  ).destination_id;
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
  nameWidth.value = value;
};
const itemsWidth = (percent: number) => nameWidth.value * percent;
const filterData = () => {
  params.value.str = encodeURIComponent(searchKey.value.trim());
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
const viewVideo = (values: any) => {
  isForm.value = 'xem';
  visibleModal.value = true;
  idForm.value = values.id;
};
const getColorStatus = (value: any) => {
  const colorStatus = ref();
  if (value === statusVideo.statusChoDuyet) {
    colorStatus.value = color.Yellow;
  } else if (value === statusVideo.statusDuyet) {
    colorStatus.value = color.Green;
  } else if (value === statusVideo.statusKhoa) {
    colorStatus.value = color.Red;
  } else if (value === statusVideo.statusTuChoi) {
    colorStatus.value = color.Dark;
  }
  return colorStatus.value;
};
const getValueStatus = (value: any) => {
  const valueStatus = ref();
  if (value === statusVideo.statusChoDuyet) {
    valueStatus.value = 'Chờ duyệt';
  } else if (value === statusVideo.statusDuyet) {
    valueStatus.value = 'Hoạt động';
  } else if (value === statusVideo.statusTuChoi) {
    valueStatus.value = 'Từ chối duyệt';
  } else if (value === statusVideo.statusKhoa) {
    valueStatus.value = 'Tạm khóa';
  }
  return valueStatus.value;
};
const confirmDetete = (item: any) => {
  confirm.require({
    message: 'Bạn có chắc chắn muốn xóa video này?',
    header: 'XÓA VIDEO',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger p-button-xs nha-hang-accept-delete-button',
    acceptLabel: 'Đồng ý',
    rejectLabel: 'Đóng',
    rejectClass: 'p-button-secondary p-button-xs nha-hang-reject-delete-button',
    accept: async () => {
      await api
        .delete(`/cms/portal/v1/video/delete_video?id=${item.id}`)
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
const confirmActive = (item: any) => {
  confirm.require({
    message: 'Vui lòng xác nhận trạng thái cho video?',
    header: 'XÁC NHẬN VIDEO',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-success p-button-xs nha-hang-accept-delete-button',
    acceptLabel: 'Phê duyệt',
    rejectLabel: 'Từ chối',
    rejectClass: 'p-button-danger p-button-xs nha-hang-accept-delete-button',
    accept: async () => {
      const data = {
        id: item.id,
        status: statusVideo.statusDuyet,
      };
      await api
        .post('/cms/portal/v1/video/update_video_status', data)
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
    reject: async () => {
      const data = {
        id: item.id,
        status: statusVideo.statusTuChoi,
      };
      await api
        .post('/cms/portal/v1/video/update_video_status', data)
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
      '/cms/portal/v1/video/update_video_position',
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
      <Breadcrumb class="breadcrumb" :home="home" :model="items" />
      <Button
        @click="addForm"
        class="button-green"
        label="Thêm mới"
        icon="pi pi-plus"
        v-show="checkPermission('them_video')"
      />
    </div>
    <div
      class="filter-container flex flex-col gap-5"
      v-show="checkPermission('tim_kiem_video')"
    >
      <div class="flex justify-between gap-5">
        <div
          class="w-[48%] flex flex-col gap-1"
          id="notification-search-key-group"
        >
          <div class="w-[100px]" id="notification-search-key-title">
            Tên video
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
    idTable="video-table"
    ref="tableRef"
    @pageChanged="onPageChange"
    @perPageChange="onPerPageChange"
    @setWidth="onSetWidth"
    :tableName="'video'"
    @selectRow="getRow"
    :rows="listVideo.videos"
    :headers="headers"
    :styleHeaders="[
      {
        idx: 0,
        class: 'w-[15%]',
      },
      {
        idx: 1,
        class: 'w-[30%]',
      },
      {
        idx: 2,
        class: 'w-[15%] pl-8',
      },
      {
        idx: 3,
        class: 'w-[15%]',
      },
      {
        idx: 4,
        class: 'w-[15%]',
      },
    ]"
    :pagination="{
      totalPage: listVideo.total_page,
      total: listVideo.record_count,
      perPage: params.page_size,
    }"
  >
    <template v-slot:items="{ row }">
      <td class="px-2">
        <div
          class="column-container"
          :style="{ width: itemsWidth(0.15) + 'px' }"
        >
          {{ row.title }}
        </div>
      </td>
      <td
        class="px-2 text-[#54667a]"
        :style="{ width: itemsWidth(0.3) + 'px' }"
      >
        <img
          class="w-[100%] h-[auto] pt-2 pb-2"
          :src="row.image"
          alt="Red dot"
        />
      </td>
      <td class="px-2">
        <div
          class="pl-8"
          v-if="row.destination"
          :style="{ width: itemsWidth(0.15) + 'px' }"
        >
          {{ row.destination?.name }}
        </div>
      </td>
      <td class="text-[#54667a] px-2">
        <div
          class="center-container"
          :style="{ width: itemsWidth(0.15) + 'px' }"
        >
          <Tag
            :class="getColorStatus(row.status)"
            :value="getValueStatus(row.status)"
          ></Tag>
        </div>
      </td>
      <td class="px-2">
        <div
          class="center-container"
          :style="{ width: itemsWidth(0.15) + 'px' }"
        >
          <VPositionPopup
            @save="savePosition(row.id, $event)"
            :num="row.position"
          ></VPositionPopup>
        </div>
      </td>
    </template>
    <template v-slot:actions="{ row }">
      <li
        @keydown="viewVideo"
        class="item-action"
        @click="viewVideo(row)"
        v-show="checkPermission('xem_chi_tiet_thong_tin_1_video')"
      >
        <i class="pi pi-eye text-xs mr-3"></i><span>Xem chi tiết</span>
      </li>
      <li
        @keydown="editForm"
        class="item-action"
        @click="editForm(row)"
        v-show="checkPermission('cap_nhat_thong_tin_video')"
      >
        <i class="pi pi-pencil text-xs mr-3"></i><span>Cập nhật</span>
      </li>
      <li
        class="item-action"
        @click="confirmDetete(row)"
        @keydown="onKeyDown"
        v-show="checkPermission('xoa_video')"
      >
        <i class="pi pi-trash text-xs mr-3"></i><span>Xóa</span>
      </li>
      <li
        v-if="typeUser === -1 && row.status === statusVideo.statusChoDuyet"
        class="item-action"
        @click="confirmActive(row)"
        @keydown="onKeyDown"
        v-show="checkPermission('duyet_video')"
      >
        <i class="pi pi-check text-xs mr-3"></i><span>Duyệt</span>
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
        ? 'THÊM MỚI VIDEO'
        : isForm === 'sua'
        ? 'CẬP NHẬT VIDEO'
        : isForm === 'xem'
        ? 'XEM CHI TIẾT VIDEO'
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
      :dataDiemDen="diemDen"
      :typeUser="typeUser"
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

::v-deep .p-tag {
  width: 120px;
}
</style>
