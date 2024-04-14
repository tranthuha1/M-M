<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Breadcrumb from 'primevue/breadcrumb';
import Calendar from 'primevue/calendar';
import * as yup from 'yup';
import moment from 'moment';
import { formatDateUnix } from '@/utils/formatDate';
import VTable from '@/components/base/VTable.vue';
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/store/useApi';
import { useOverLayLoadingStore } from '@/store/overlayLoading';

export interface ParamsView {
  str: string;
  page_index: number;
  page_size: number;
  status?: number;
  dateType?: number;
  contentType?: number;
  diemDen?: number;
}

const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const tableRef = ref();
const typeUser = ref();
const items = ref([
  {
    label: 'Báo cáo',
  },
  {
    label: 'Lượt view',
  },
]);
const home = ref({
  label: 'Trang chủ',
  to: '/home',
});

const schema = yup.object().shape({
  dateFrom: yup
    .string()
    .test(
      'date-range',
      'Giá trị từ ngày phải nhỏ hơn hoặc bằng đến ngày',
      function (value) {
        const { dateTo } = this.parent;
        const date1 = moment(value, 'DD/MM/YYYY');
        const date2 = moment(dateTo, 'DD/MM/YYYY');
        if (value === 'Invalid date') {
          return true;
        }
        if (dateTo !== 'Invalid date' && value !== 'Invalid date') {
          return date1.isBefore(date2) || date1.isSame(date2);
        }
        return true;
      },
    ),
  dateTo: yup.string(),
});
const dateFrom = ref();
const dateFromErr = ref();
const dateTo = ref();
const today = ref(new Date());
const checkValidate = function (data: any) {
  schema
    .validate(data, { abortEarly: false })
    .then(() => {
      dateFromErr.value = '';
    })
    .catch((err) => {
      dateFromErr.value = err.message;
    });
};

const headers = ref([
  'Tên nội dung',
  'Loại nội dung',
  'Điểm đến',
  {
    name: 'Lượt view',
    alight: 'center',
  },
  {
    name: 'View Web',
    alight: 'center',
  },
  {
    name: 'View IOS',
    alight: 'center',
  },
  {
    name: 'View Android',
    alight: 'center',
  },
]);
const loaiNoidung = ref([
  { name: 'Tin bài', id: 5 },
  { name: 'Nhà hàng', id: 1 },
  { name: 'Điểm lưu trú', id: 2 },
  { name: 'Sản phẩm OCOP', id: 3 },
  { name: 'Điểm trưng bày, giới thiệu sản phẩm', id: 6 },
  { name: 'Mô hình du lịch NNNT', id: 7 },
  { name: 'Dịch vụ du lịch cộng đồng', id: 8 },
  { name: 'Làng nghề', id: 9 },
  { name: 'Chương trình du lịch', id: 10 },
  { name: 'Thư viện ảnh', id: 11 },
  { name: 'Thư viện video', id: 12 },
]);
const selectedLoaiNoiDung = ref<{
  name: string;
  id?: number;
}>({ name: 'Tin bài', id: 5 });

const listTypeDate = ref([
  { name: 'Ngày', id: 1 },
  { name: 'Tháng', id: 2 },
  { name: 'Năm', id: 3 },
]);

const selectedTypeDate = ref<{
  name: string;
  id?: number;
}>({ name: 'Ngày', id: 1 });

const diemDen = ref([{ name: 'Tất cả' }]);
const selectedDiemDen = ref<{
  name: string;
  id?: number;
}>({ name: 'Tất cả' });
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

const listView = ref([]) as any;
const searchKey = ref<string>('');
const params = ref<ParamsView>({
  str: searchKey.value,
  page_index: 1,
  page_size: 20,
  contentType: selectedLoaiNoiDung.value.id,
  dateType: selectedTypeDate.value.id,
  diemDen: selectedDiemDen.value.id,
});

const getList = async () => {
  overlayLoading.toggleLoading(true);
  try {
    const res = await api.get(
      `/cms/portal/v1/report/list_view_report?keyword=${
        encodeURIComponent(params.value.str.trim())
      }&limit=${params.value.page_size}&page=${
        params.value.page_index
      }&destination=${
        params.value.diemDen ? params.value.diemDen : 0
      }&date_type=${params.value.dateType}&content_type=${
        params.value.contentType ? params.value.contentType : 0
      }&from_date=${formatDateUnix(dateFrom.value)}&to_date=${formatDateUnix(
        dateTo.value,
      )}`,
    );
    listView.value = res.data.data;
    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
  }
};
const exportExcel = async () => {
  try {
    const res = await api.get(
      `/cms/portal/v1/report/export_view_report?keyword=${
        params.value.str
      }&limit=${params.value.page_size}&page=${
        params.value.page_index
      }&destination=${
        params.value.diemDen ? params.value.diemDen : 0
      }&date_type=${params.value.dateType}&content_type=${
        params.value.contentType ? params.value.contentType : 0
      }&from_date=${formatDateUnix(dateFrom.value)}&to_date=${formatDateUnix(
        dateTo.value,
      )}`,
    );

    window.location.href = res.data.data.excel_file_name;

    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
  }
};
const dateFormat = ref();
const viewDate = ref();
const getTypeDate = () => {
  if (selectedTypeDate.value.id === 1) {
    dateFormat.value = 'dd/mm/yy';
    viewDate.value = 'date';
  } else if (selectedTypeDate.value.id === 2) {
    dateFormat.value = 'mm/yy';
    viewDate.value = 'month';
  } else if (selectedTypeDate.value.id === 3) {
    dateFormat.value = 'yy';
    viewDate.value = 'year';
  }
  dateFromErr.value = '';
  dateFrom.value = new Date();
  dateTo.value = new Date();
};
watch(
  () => selectedTypeDate.value.id,
  (value) => {
    console.log(selectedTypeDate.value.id);
  },
);
onMounted(async () => {
  await getList();
  await getListDiemDen();
  typeUser.value = JSON.parse(
    localStorage.getItem('user') as any,
  ).destination_id;
  dateFrom.value = new Date(
    today.value.getFullYear(),
    today.value.getMonth(),
    today.value.getDate(),
  );
  dateTo.value = new Date(
    today.value.getFullYear(),
    today.value.getMonth(),
    today.value.getDate(),
    23,
    59,
    59,
  );
  dateFormat.value = 'dd/mm/yy';
  viewDate.value = 'date';
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
  params.value.str = searchKey.value;
  params.value.contentType = selectedLoaiNoiDung.value.id;
  params.value.dateType = selectedTypeDate.value.id;
  params.value.diemDen = selectedDiemDen.value.id;
  const startDate = dateFrom.value;
  const endDate = dateTo.value;
  if (selectedTypeDate.value.id === 1) {
    dateFrom.value = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );
    dateTo.value = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23,
      59,
      59,
    );
  } else if (selectedTypeDate.value.id === 2) {
    dateFrom.value = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    dateTo.value = new Date(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
  } else {
    dateFrom.value = new Date(startDate.getFullYear(), 0);
    dateTo.value = new Date(endDate.getFullYear(), 11, 31, 23, 59, 59);
  }
  tableRef.value.filterData();
};

const getRow = (value: any) => {
  console.log(value);
};
</script>
<template>
  <div class="filter">
    <div class="flex items-center justify-between pb-5">
      <Breadcrumb class="breadcrumb" :home="home" :model="items" />
    </div>
    <div class="filter-container flex flex-col gap-5">
      <div class="flex justify-between gap-5">
        <div
          class="w-[48%] flex flex-col gap-1"
          id="notification-search-key-group"
        >
          <div id="notification-search-status-title">Thời gian</div>
          <Dropdown
            id="notification-search-status-component"
            input-id="notification-search-status-field"
            class="status-dropdown"
            optionLabel="name"
            v-model="selectedTypeDate"
            :options="listTypeDate"
            @change="getTypeDate()"
          />
        </div>
        <div
          class="w-[48%] flex flex-col gap-1"
          id="program-search-from-date-group"
        >
          <div class="w-[100px]" id="program-search-from-date-title">
            Từ ngày
          </div>
          <Calendar
            :key="selectedTypeDate.id"
            class="search-input-qlbv"
            :dateFormat="dateFormat"
            :view="viewDate"
            :showOnFocus="false"
            id="program-search-from-date-component"
            input-id="program-search-from-date-field"
            @blur="
              checkValidate({
                dateFrom: moment(dateFrom).format('DD/MM/YYYY'),
                dateTo: moment(dateTo).format('DD/MM/YYYY'),
              })
            "
            @date-select="
              checkValidate({
                dateFrom: moment(dateFrom).format('DD/MM/YYYY'),
                dateTo: moment(dateTo).format('DD/MM/YYYY'),
              })
            "
            :class="{
              'p-invalid': dateFromErr,
            }"
            name="timeThoiGianGui"
            showIcon
            v-model="dateFrom"
          />
          <small v-if="dateFromErr" class="p-error pt-1 pl-2">{{
            dateFromErr || '&nbsp;'
          }}</small>
        </div>
        <div class="w-[48%] flex flex-col gap-1">
          <div class="w-[100px]" id="program-search-to-date-title">
            Đến ngày
          </div>
          <Calendar
            :key="selectedTypeDate.id"
            class="search-input-qlbv"
            id="program-search-to-date-component"
            input-id="program-search-to-date-field"
            @blur="
              checkValidate({
                dateFrom: moment(dateFrom).format('DD/MM/YYYY'),
                dateTo: moment(dateTo).format('DD/MM/YYYY'),
              })
            "
            @date-select="
              checkValidate({
                dateFrom: moment(dateFrom).format('DD/MM/YYYY'),
                dateTo: moment(dateTo).format('DD/MM/YYYY'),
              })
            "
            :showOnFocus="false"
            :dateFormat="dateFormat"
            :view="viewDate"
            name="timeThoiGianGui"
            showIcon
            v-model="dateTo"
          />
        </div>
      </div>
      <div class="flex justify-between gap-5">
        <div
          class="w-[48%] flex flex-col gap-1"
          id="notification-search-key-group"
        >
          <div class="w-[100px]" id="notification-search-key-title">
            Tên nội dung
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
          <div id="notification-search-status-title">Loại nội dung</div>
          <Dropdown
            id="notification-search-status-component"
            input-id="notification-search-status-field"
            class="status-dropdown"
            optionLabel="name"
            v-model="selectedLoaiNoiDung"
            :options="loaiNoidung"
          />
        </div>
        <div
          class="w-[48%] flex flex-col gap-1"
          id="notification-search-status-group"
        >
          <div id="notification-search-status-title">Điểm đến</div>
          <Dropdown
            id="notification-search-status-component"
            input-id="notification-search-status-field"
            class="status-dropdown"
            optionLabel="name"
            v-model="selectedDiemDen"
            :options="diemDen"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <Button
          class="button-green mr-5"
          label="Thống kê"
          id="nha-hang-search-button"
          icon="pi pi-search"
          @click="filterData"
        />
        <Button
          class="button-green"
          label="Xuất file"
          id="nha-hang-search-button"
          icon="pi pi-file-excel"
          @click="exportExcel"
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
    :tableName="'báo cáo lượt view'"
    @selectRow="getRow"
    :rows="listView.reports"
    :showAction="false"
    :headers="headers"
    :styleHeaders="[
      {
        idx: 0,
        class: 'w-[12%]',
      },
      {
        idx: 1,
        class: 'w-[10%]',
      },
      {
        idx: 2,
        class: 'w-[10%]',
      },
      {
        idx: 3,
        class: 'w-[10%]',
      },
      {
        idx: 4,
        class: 'w-[10%]',
      },
      {
        idx: 5,
        class: 'w-[10%]',
      },
      {
        idx: 6,
        class: 'w-[10%]',
      },
    ]"
    :pagination="{
      totalPage: listView.total_page,
      total: listView.record_count,
      perPage: params.page_size,
    }"
  >
    <template v-slot:items="{ row }">
      <td class="px-2">
        <div
          class="column-container"
          :style="{ width: itemsWidth(0.12) + 'px' }"
        >
          {{ row.title }}
        </div>
      </td>
      <td class="px-2">
        <div
          class="column-container"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        >
          {{ row.content_type_name }}
        </div>
      </td>
      <td class="px-2">
        <div
          v-if="row.destination"
          class="column-container"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        >
          {{ row.destination.name }}
        </div>
        <div
          v-else
          class="column-container"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        ></div>
      </td>
      <td class="px-2">
        <div
          class="column-container text-center"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        >
          {{ row.total_view }}
        </div>
      </td>
      <td class="px-2">
        <div
          class="column-container text-center"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        >
          {{ row.view_web }}
        </div>
      </td>
      <td class="px-2">
        <div
          class="column-container text-center"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        >
          {{ row.view_ios }}
        </div>
      </td>
      <td class="px-2">
        <div
          class="column-container text-center"
          :style="{ width: itemsWidth(0.1) + 'px' }"
        >
          {{ row.view_android }}
        </div>
      </td>
    </template>
  </VTable>
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
