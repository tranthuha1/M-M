<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb';
import {
  onMounted, ref, onBeforeUnmount, nextTick, watch,
} from 'vue';
import InputText from 'primevue/inputtext';
import * as yup from 'yup';
import { useToast } from 'vue-toastification';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';
import VDropDown from '@/components/base/VDropDown.vue';
import { checkPermission } from '@/utils';
import { color } from '@/constants/statusColor';
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/store/useApi';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import VTable from '@/components/base/VTable.vue';
import Form from './form/Form.vue';

export interface ParamsUploadImage {
  page_index: number;
  page_size: number;
}
const confirmPrime = useConfirm();
const overlayLoading = useOverLayLoadingStore();
const toast = useToast();
const api = useApi();
const searchKey = ref<string>('');
const tableRef = ref();
const status = ref([
  { name: 'Tất cả', id: 0 },
  { name: 'Chờ duyệt', id: 1 },
  { name: 'Hoạt động', id: 2 },
  { name: 'Từ chối duyệt', id: 3 },
  { name: 'Tạm khóa', id: 4 },
]);
const listDiemDen = ref([{ name: 'Tất cả', id: 0 }]);
const listChuyenMuc = ref([
  { name: 'Tất cả', id: 0 },
  { name: 'Tin du lịch', id: 4 },
  { name: 'Tuyên truyền quảng bá', id: 6 },
  { name: 'Ăn gì', id: 7 },
  { name: 'Mua gì', id: 8 },
]);
const { values, setFieldValue } = useForm({
  validationSchema: yup.object({
    org_id: yup.mixed(),
  }),
});
const params = ref<ParamsUploadImage>({
  page_index: 1,
  page_size: 20,
});
const items = ref([
  {
    label: 'Quản lý tin bài',
  },
]);
const headers = ref([
  'Tiêu đề tin bài',
  'Chuyên mục',
  'Điểm đến',
  {
    key: 'read_count',
    name: 'Lượt xem',
    alight: 'center',
  },
  {
    name: 'Trạng thái',
    alight: 'center',
  },
]);
const tableWidth = ref();
const order = ref();
const listTinBai = ref([]) as any;
const getListDiemDen = async () => {
  try {
    const res = await api.get(
      '/cms/portal/v1/category/list_all_category?group=3',
    );
    listDiemDen.value.push(
      ...res.data.data.categories.map((item: any) => ({
        name: item.name,
        id: item.id,
      })),
    );
  } catch (err: any) {
    console.error(err);
  }
};
const getList = async () => {
  overlayLoading.toggleLoading(true);
  try {
    let url = `/cms/portal/v1/article/list_article?limit=${params.value.page_size}&page=${params.value.page_index}`;

    if (values.diemDen) {
      url += `&destination_id=${values.diemDen}`;
    }
    if (values.chuyenMuc) {
      url += `&category_type=${values.chuyenMuc}`;
    }
    if (values.status) {
      url += `&status=${values.status}`;
    }
    if (searchKey.value) {
      url += `&title_search=${encodeURIComponent(searchKey.value.trim())}`;
    }
    if (order.value) {
      url += `&order=${order.value}`;
    }
    const res = await api.get(url);
    listTinBai.value = res.data.data;
    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
    toast.error(
      'Không thể kết nối tới máy chủ do hệ thống đang bận. Vui lòng thử lại!',
      {
        timeout: 5000,
      },
    );
  }
};
const filterData = () => {
  tableRef.value.filterData();
};
const onPageChange = (value: number) => {
  params.value.page_index = value;
  getList();
};
const onPerPageChange = (value: number) => {
  params.value.page_size = value;
};
const onSetWidth = (value: number) => {
  tableWidth.value = value;
};
const itemsWidth = (percent: number) => tableWidth.value * percent;
const home = ref({
  label: 'Trang chủ',
  to: '/',
});
const typeUser = ref();
onMounted(async () => {
  overlayLoading.toggleLoading(true);
  typeUser.value = JSON.parse(
    localStorage.getItem('user') as any,
  ).destination_id;
  await getListDiemDen();
  await getList();
  setFieldValue('status', 0);
  setFieldValue('diemDen', 0);
  setFieldValue('chuyenMuc', 0);
  overlayLoading.toggleLoading(false);
});
const deleteTinBai = async function (value: any) {
  overlayLoading.toggleLoading(true);
  await api
    .delete(`cms/portal/v1/article/delete_article?id=${value.id}`)
    .then((response) => {
      if (response.data.code === 0) {
        overlayLoading.toggleLoading(false);
        getList();
        toast.success(response.data.message, {
          timeout: 5000,
        });
      } else {
        overlayLoading.toggleLoading(false);
        toast.error(response.data.message, {
          timeout: 5000,
        });
      }
    })
    .catch((error) => {
      overlayLoading.toggleLoading(false);
    });
};
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const updateStatus = async function (param: any) {
  overlayLoading.toggleLoading(true);
  await api
    .put('cms/portal/v1/article/approve_article', param)
    .then((response) => {
      if (response.data.code === 0) {
        overlayLoading.toggleLoading(false);
        getList();
        toast.success(response.data.message, {
          timeout: 5000,
        });
      } else {
        overlayLoading.toggleLoading(false);
        toast.error(response.data.message, {
          timeout: 5000,
        });
      }
    })
    .catch((error) => {
      overlayLoading.toggleLoading(false);
    });
};
const duyetTinBai = (value: any, type: any) => {
  let acceptButton;
  let rejectButton;
  const mess = function () {
    if (type === 'xóa') {
      acceptButton = 'Đồng ý';
      rejectButton = 'Đóng';
      return 'Bạn có chắc chắn muốn xóa tin bài này?';
    }
    acceptButton = 'Phê duyệt';
    rejectButton = 'Từ chối';
    return 'Vui lòng xác nhận trạng thái cho tin bài';
  };
  const header = function () {
    if (type === 'xóa') {
      return 'Xóa tin bài';
    }
    return 'Xác nhận tin bài';
  };
  const param: any = {
    id: value.id,
  };
  confirmPrime.require({
    message: mess(),
    header: header(),
    acceptClass: `${
      type === 'duyệt' ? 'p-button-success' : 'button-error'
    } p-button-xs tai-khoan-accept-lock-button`,
    rejectClass: `${
      type === 'xóa' ? 'p-button-secondary' : 'button-error'
    } p-button-xs tai-khoan-reject-lock-button`,
    icon: 'pi pi-info-circle',
    acceptLabel: acceptButton,
    rejectLabel: rejectButton,
    accept: async () => {
      if (type === 'xóa') {
        await deleteTinBai(value);
      } else {
        if (type === 'duyệt') {
          param.status = 2;
        }
        await updateStatus(param);
      }
    },
    reject: async () => {
      if (type === 'duyệt') {
        param.status = 3;
        await updateStatus(param);
      }
    },
  });
};
const visibleModal = ref(false);
const isForm = ref();
const tinBaiID = ref();
const refDialog = ref();

const addForm = () => {
  visibleModal.value = true;
  isForm.value = 'them';
};
const editForm = (value: any) => {
  isForm.value = 'sua';
  visibleModal.value = true;
  tinBaiID.value = value;
};
const viewDetail = (id: number) => {
  isForm.value = 'xem';
  visibleModal.value = true;
  tinBaiID.value = id;
};
const sortTable = (value: any) => {
  if (Object.values(value)[0] === 'desc') {
    order.value = `-${Object.keys(value)[0]}` as string;
  } else {
    order.value = Object.keys(value)[0] as string;
  }
  getList();
};
</script>
<template>
  <div class="flex items-center justify-between pb-5">
    <Breadcrumb
      id="tai-khoan-breadcrumb"
      class="breadcrumb"
      :home="home"
      :model="items"
    />
    <Button
      @click="addForm"
      class="button-green"
      id="tai-khoan-create-button"
      v-if="checkPermission('them_tin_bai')"
      label="Thêm mới"
      icon="pi pi-plus"
    />
  </div>
  <div
    class="flex flex-col filter-container"
    v-if="checkPermission('tim_kiem_tin_bai')"
  >
    <div class="flex justify-between">
      <div class="w-[48%] flex flex-col gap-1" id="tai-khoan-search-key-group">
        <div id="tai-khoan-search-key-label">Tin bài</div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="searchKey"
            id="tai-khoan-search-key-field"
            class="search-input"
            @keydown.enter="filterData"
            placeholder="Nhập từ khóa tìm kiếm"
          />
        </span>
      </div>
      <div class="w-[48%] flex flex-col gap-1" id="tai-khoan-status-group">
        <div id="tai-khoan-status-label">Trạng thái</div>
        <VDropDown
          :show="true"
          class="status-dropdown"
          name="status"
          optionValue="id"
          optionLabel="name"
          :is-filter="false"
          :options="status"
        />
      </div>
    </div>
    <div class="flex mt-5 justify-between">
      <div class="w-[48%] flex flex-col gap-1" id="tai-khoan-to-chuc-group">
        <div class="w-20" id="tai-khoan-to-chuc-label">Điểm đến</div>
        <div>
          <VDropDown
            :show="true"
            class="status-dropdown"
            name="diemDen"
            optionValue="id"
            optionLabel="name"
            :options="listDiemDen"
          />
        </div>
      </div>
      <div class="w-[48%] flex flex-col gap-1" id="tai-khoan-nhom-quyen-group">
        <div id="tai-khoan-nhom-quyen-label">Chuyên mục</div>
        <VDropDown
          :show="true"
          class="status-dropdown"
          name="chuyenMuc"
          optionValue="id"
          optionLabel="name"
          :options="listChuyenMuc"
        />
      </div>
    </div>
    <div class="mt-5 flex justify-end items-end">
      <Button
        class="button-green"
        id="tai-khoan-search-button"
        label="Tra cứu"
        @click="filterData"
        icon="pi pi-search"
      />
    </div>
  </div>
  <VTable
    idTable="tai-khoan-table"
    ref="tableRef"
    @pageChanged="onPageChange"
    @perPageChange="onPerPageChange"
    @setWidth="onSetWidth"
    :rows="listTinBai.articles"
    :styleHeaders="[
      {
        idx: 0,
        class: 'w-[25%]',
      },
      {
        idx: 1,
        class: 'w-[15%]',
      },
      {
        idx: 2,
        class: 'w-[15%]',
      },
      {
        idx: 3,
        class: 'w-[10%]',
      },
      {
        idx: 4,
        class: 'w-[15%]',
      },
    ]"
    :tableName="'tin bài'"
    :headers="headers"
    :keySortTable="['read_count']"
    @sortTable="sortTable"
    :pagination="{
      totalPage: listTinBai?.total_page,
      total: listTinBai?.record_count,
      perPage: params.page_size,
    }"
  >
    <template v-slot:items="{ row }">
      <td class="text-[#54667a] px-2">
        <div
          class="column-container"
          :style="{ width: itemsWidth(0.2) + 'px' }"
        >
          {{ row.title }}
        </div>
      </td>
      <td class="text-[#54667a] px-2">
        <div
          class="column-container"
          :style="{ width: itemsWidth(0.15) + 'px' }"
        >
          {{ row?.category_type[0]?.name }}
        </div>
      </td>
      <td class="text-[#54667a] px-2">
        <div
          class="column-container"
          :style="{ width: itemsWidth(0.15) + 'px' }"
        >
          {{ row.destination?.name }}
        </div>
      </td>
      <td class="text-[#54667a] px-2">
        <div
          class="center-container"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        >
          {{ row.read_count }}
        </div>
      </td>
      <td class="text-[#54667a] px-2">
        <div
          class="center-container"
          :style="{ width: itemsWidth(0.15) + 'px' }"
        >
          <Tag
            :class="
              row.status === 1
                ? color.Yellow
                : row.status === 2
                ? color.Green
                : row.status === 3
                ? color.Dark
                : color.Red
            "
            :value="
              row.status === 1
                ? 'Chờ Duyệt'
                : row.status === 2
                ? 'Hoạt động'
                : row.status === 3
                ? 'Từ chối duyệt'
                : 'Tạm khóa'
            "
          ></Tag>
        </div>
      </td>
    </template>
    <template v-slot:actions="{ row }">
      <li
        @keydown="viewDetail(row.id)"
        class="item"
        @click="viewDetail(row.id)"
      >
        <i
          class="pi pi-eye text-xs mr-3"
          v-if="checkPermission('xem_chi_tiet_thong_tin_1_tin_bai')"
        ></i
        ><span>Xem chi tiết</span>
      </li>
      <li @keydown="editForm" class="item" @click="editForm(row.id)">
        <i
          class="pi pi-pencil text-xs mr-3"
          v-if="checkPermission('cap_nhat_thong_tin_tin_bai')"
        ></i
        ><span>Cập nhật</span>
      </li>
      <li
        @keydown="duyetTinBai(row, 'xóa')"
        class="item"
        @click="duyetTinBai(row, 'xóa')"
      >
        <i
          class="pi pi-trash text-xs mr-3"
          v-if="checkPermission('xoa_tin_bai')"
        ></i
        ><span>Xóa</span>
      </li>
      <li
        @keydown="duyetTinBai(row, 'duyệt')"
        class="item"
        @click="duyetTinBai(row, 'duyệt')"
        v-if="
          typeUser === -1 &&
          row.status === 1 &&
          checkPermission('duyet_tin_bai')
        "
      >
        <i class="pi pi-check text-xs mr-3"></i><span>Duyệt</span>
      </li>
    </template>
  </VTable>
  <Dialog
    ref="refDialog"
    id="tai-khoan-dialog"
    v-model:visible="visibleModal"
    :draggable="false"
    :pt="{
      content: { class: 'mb-[5rem]', id: 'tai-khoan-dialog-content' },
      root: { class: 'bg-[#fff]' },
    }"
    modal
    :header="
      isForm === 'them'
        ? 'THÊM MỚI TIN BÀI'
        : isForm === 'sua'
        ? 'CẬP NHẬT TIN BÀI'
        : isForm === 'xem'
        ? 'CHI TIẾT TIN BÀI'
        : ''
    "
    :style="{
      width: '70vw',
      height: '90vh',
      backgroundColor: '#fff',
      maxHeight: '100%',
    }"
  >
    <Form
      :user="typeUser"
      @get-list="getList"
      @close-form="visibleModal = false"
      :form-type="isForm"
      @update-form="isForm = 'sua'"
      :tin-bai-i-d="tinBaiID"
    ></Form>
  </Dialog>
</template>
<style lang="scss" scoped>
.status-dropdown {
  width: 100%;
}

.search-input {
  width: 100%;
}
.item {
  padding: 4px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 150px;

  &:hover {
    background-color: var(--item-hover);
  }
}
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
}
::v-deep .p-tag {
  width: 120px;
}
</style>
