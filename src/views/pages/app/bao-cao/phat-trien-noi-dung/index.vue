<!-- eslint-disable func-names -->
<script lang="ts" setup>
import {
  onMounted, ref, watch, nextTick,
} from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/store/useApi';
import VTable from '@/components/base/VTable.vue';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import { formatDateUnix } from '@/utils/formatDate';
import * as Yup from 'yup';
import moment from 'moment';

interface ParamGetListNoiDung {
  page: number;
  limit: number;
  status: number;
  dateType: number;
  contentType?: number;
  destination?:number;
}

const schema = Yup.object().shape({
  start_date: Yup.string().test(
    'date-range',
    'Giá trị từ ngày phải nhỏ hơn hoặc bằng đến ngày',
    function (value) {
      const { end_date } = this.parent;
      const date1 = moment(value, 'DD/MM/YYYY');
      const date2 = moment(end_date, 'DD/MM/YYYY');
      if (value === 'Invalid date') {
        return true;
      } if (end_date !== 'Invalid date' && value !== 'Invalid date') {
        return date1.isBefore(date2) || date1.isSame(date2);
      }
      return true;
    },
  ),
  end_date: Yup.string(),
});

const overlayLoading = useOverLayLoadingStore();
const api = useApi();
const searchDate = ref();
const tableRef = ref();
const dateType = ref([
  { name: 'Ngày', value: 1 },
  { name: 'Tháng', value: 2 },
  { name: 'Năm', value: 3 },
]);
const dateTypeSelected = ref(1);
const today = ref(new Date());
const start_date = ref();
const end_date = ref();
const dateFromErr = ref('');
const dateView = ref();
const dateFormat = ref();
const dateKey = ref(0);
const listLoaiNoiDung = ref([
  { name: 'Tất cả', value: 0 },
  { name: 'Tin bài', value: 1 },
  { name: 'Nhà hàng', value: 2 },
  { name: 'Điểm lưu trú', value: 3 },
  { name: 'Sản phẩm OCOP', value: 4 },
  { name: 'Điểm trưng bày, giới thiệu sản phẩm', value: 5 },
  { name: 'Mô hình du lịch NNNT', value: 6 },
  { name: 'Dịch vụ du lịch cộng đồng', value: 7 },
  { name: 'Làng nghề', value: 8 },
  { name: 'Chương trình du lịch', value: 9 },
  { name: 'Thư viện ảnh', value: 10 },
  { name: 'Thư viện video', value: 11 },
]);
const loaiNoiDungSelected = ref(0);
const listNguoiTao = ref([
  { name: 'Tất cả', value: 0 },
  { name: 'Sở du lịch', value: 1 },
  { name: 'Uỷ ban nhân dân', value: 2 },
]);
const nguoiTaoSelected = ref(0);
const listDiemDen = ref([{ name: 'Tất cả', value: 0 }]);
const diemDenSelected = ref(0);
const timeView = ref(0);
const listNoiDung = ref([]) as any;
const params = ref<ParamGetListNoiDung>({
  page: 1,
  limit: 20,
  status: 0,
  dateType: dateTypeSelected.value,
  contentType: loaiNoiDungSelected.value,
  destination: diemDenSelected.value,
});
const getListDiemDen = async () => {
  try {
    const res = await api.get(
      '/cms/portal/v1/category/list_all_category?group=3',
    );
    listDiemDen.value.push(
      ...res.data.data.categories.map((item: any) => ({
        name: item.name,
        value: item.id,
      })),
    );
  } catch (err: any) {
    console.error(err);
  }
};
const getList = async () => {
  try {
    let param = `?limit=${params.value.limit}&page=${params.value.page}&date_type=${params.value.dateType}`;
    param += `&from_date=${formatDateUnix(start_date.value)}&to_date=${formatDateUnix(end_date.value)}`;
    param += `&content_type=${params.value.contentType}&destination=${params.value.destination}`;
    overlayLoading.toggleLoading(true);
    const res = await api.get(`/cms/portal/v1/report/list_content_report${param}`);
    listNoiDung.value = res.data.data;
    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
  }
};

const checkValidate = function (data: any) {
  return schema
    .validate(data, { abortEarly: false })
    .then(() => {
      dateFromErr.value = '';
    })
    .catch((err) => {
      dateFromErr.value = err.message;
    });
};

const headers = ref([
  { name: 'Thời gian' },
  'Loại nội dung',
  'Điểm đến',
  { name: 'Số nội dung được thêm mới', alight: 'center' },
]);
const linkWidth = ref();
const onSetWidth = (value: number) => {
  linkWidth.value = value * 0.25;
};
const filterDate = () => {
  params.value.dateType = dateTypeSelected.value;
  params.value.contentType = loaiNoiDungSelected.value;
  params.value.destination = diemDenSelected.value;
  const startDate = start_date.value;
  const endDate = end_date.value;
  timeView.value = dateTypeSelected.value;
  if (dateTypeSelected.value === 1) {
    start_date.value = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    end_date.value = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
  } else if (dateTypeSelected.value === 2) {
    start_date.value = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    end_date.value = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0, 23, 59, 59);
  } else {
    start_date.value = new Date(startDate.getFullYear(), 0);
    end_date.value = new Date(endDate.getFullYear(), 11, 31, 23, 59, 59);
  }
};
const filterData = () => {
  filterDate();
  tableRef.value.filterData();
};
const onPageChange = (value: number) => {
  params.value.page = value;
  filterDate();
  getList();
};
const onPerPageChange = (value: number) => {
  params.value.limit = value;
  filterDate();
};
onMounted(async () => {
  dateView.value = 'date';
  dateFormat.value = 'dd/mm/yy';
  start_date.value = new Date(today.value.getFullYear(), today.value.getMonth(), today.value.getDate());
  end_date.value = new Date(today.value.getFullYear(), today.value.getMonth(), today.value.getDate(), 23, 59, 59);
  timeView.value = dateTypeSelected.value;
  await getListDiemDen();
  await getList();
  end_date.value = new Date(today.value.getFullYear(), today.value.getMonth(), today.value.getDate());
});
const setDateType = () => {
  dateFromErr.value = '';
  dateKey.value += 1;
  start_date.value = today.value;
  end_date.value = today.value;
  if (dateTypeSelected.value === 1) {
    dateView.value = 'date';
    dateFormat.value = 'dd/mm/yy';
  } else if (dateTypeSelected.value === 2) {
    dateView.value = 'month';
    dateFormat.value = 'mm/yy';
  } else {
    dateView.value = 'year';
    dateFormat.value = 'yy';
  }
};
watch(dateTypeSelected, setDateType);

const setNoiDung = (content:number) => {
  if (content === 0) return '';
  return listLoaiNoiDung.value.find((e) => e.value === content)?.name;
};

const convertTimeStampToDate = (dateTimestamp: number) => {
  let date = '';
  if (timeView.value === 1) {
    date = moment.unix(dateTimestamp).format('DD/MM/YYYY');
  } else if (timeView.value === 2) {
    date = moment.unix(dateTimestamp).format('MM/YYYY');
  } else {
    date = moment.unix(dateTimestamp).format('YYYY');
  }

  return date;
};

const exportExcel = async () => {
  try {
    params.value.dateType = dateTypeSelected.value;
    params.value.contentType = loaiNoiDungSelected.value;
    params.value.destination = diemDenSelected.value;
    const startDate = start_date.value;
    const endDate = end_date.value;
    timeView.value = dateTypeSelected.value;
    if (dateTypeSelected.value === 1) {
      end_date.value = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
    } else if (dateTypeSelected.value === 2) {
      start_date.value = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      end_date.value = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0, 23, 59, 59);
    } else {
      start_date.value = new Date(startDate.getFullYear(), 0);
      end_date.value = new Date(endDate.getFullYear(), 11, 31, 23, 59, 59);
    }

    let param = `?date_type=${params.value.dateType}`;
    param += `&from_date=${formatDateUnix(start_date.value)}&to_date=${formatDateUnix(end_date.value)}`;
    param += `&content_type=${params.value.contentType}&destination=${params.value.destination}`;
    overlayLoading.toggleLoading(true);
    const res = await api.get(`/cms/portal/v1/report/export_content_report${param}`);

    window.location.href = res.data.data.excel_url;

    overlayLoading.toggleLoading(false);
  } catch (err: any) {
    console.error(err);
    overlayLoading.toggleLoading(false);
  }
};

const items = ref([
  {
    label: 'Báo cáo phát triển nội dung',
    to: '/bao-cao-phat-trien-noi-dung',
  },
]);
const home = ref({
  label: 'Trang chủ',
  to: '/home',
});
</script>
<template>
  <div class="flex items-center justify-between pb-5">
    <Breadcrumb class="breadcrumb" :home="home" :model="items" id="content-breadcrumb"/>
  </div>
  <div class="flex flex-col filter-container">
    <div class="flex justify-between">
      <div class="w-[32%] flex flex-col gap-1">
        <div class="w-[100px]" id="content-search-status-title">Thời gian</div>
        <Dropdown
          id="content-search-status-component"
          input-id="content-search-status-field"
          class="search-input"
          optionLabel="name"
          option-value="value"
          v-model="dateTypeSelected"
          :options="dateType"
        />
      </div>
      <div class="w-[32%] flex flex-col gap-1">
        <div class="w-[100px]" id="content-search-status-title">Từ</div>
        <Calendar
          id="from-date"
          v-model="start_date"
          showIcon
          :view="dateView"
          :manualInput="false"
          :date-format="dateFormat"
          :key="dateKey"
          @blur="checkValidate({
              start_date: moment(start_date).format('DD/MM/YYYY'),
              end_date: moment(end_date).format('DD/MM/YYYY'),
            })"
          @date-select="
            checkValidate({
              start_date: moment(start_date).format('DD/MM/YYYY'),
              end_date: moment(end_date).format('DD/MM/YYYY'),
            })
          "
          :class="{
            'p-invalid': dateFromErr,
          }"
        />
        <small v-if="dateFromErr" class="p-error pt-1 pl-2">{{
          dateFromErr || '&nbsp;'
        }}</small>
      </div>
      <div class="w-[32%] flex flex-col gap-1">
        <div class="w-[100px]" id="content-search-status-title">Đến</div>
        <Calendar
          id="end-date"
          v-model="end_date"
          showIcon
          :view="dateView"
          :date-format="dateFormat"
          :key="dateKey"
          :manualInput="false"
          @blur="checkValidate({
              start_date: moment(start_date).format('DD/MM/YYYY'),
              end_date: moment(end_date).format('DD/MM/YYYY'),
            })"
          @date-select="
            checkValidate({
              start_date: moment(start_date).format('DD/MM/YYYY'),
              end_date: moment(end_date).format('DD/MM/YYYY'),
            })"
        />
      </div>
    </div>
    <div class="flex justify-between mt-5">
      <div class="w-[48%] flex flex-col gap-1">
        <div class="w-[100px]" id="content-search-status-title">Loại nội dung</div>
        <Dropdown
          id="content-search-status-component"
          input-id="content-search-status-field"
          class="search-input"
          optionLabel="name"
          option-value="value"
          v-model="loaiNoiDungSelected"
          :options="listLoaiNoiDung"
          :filter="true"
          resetFilterOnHide
        />
      </div>
      <!-- <div class="w-[32%] flex flex-col gap-1">
        <div class="w-[100px]" id="content-search-status-title">Người tạo</div>
        <Dropdown
          id="content-search-status-component"
          input-id="content-search-status-field"
          class="search-input"
          optionLabel="name"
          option-value="value"
          v-model="nguoiTaoSelected"
          :options="listNguoiTao"
        />
      </div> -->
      <div class="w-[48%] flex flex-col gap-1">
        <div class="w-[100px]" id="content-search-status-title">Điểm đến</div>
        <Dropdown
          id="content-search-status-component"
          input-id="content-search-status-field"
          class="search-input"
          optionLabel="name"
          option-value="value"
          v-model="diemDenSelected"
          :options="listDiemDen"
          :filter="true"
          resetFilterOnHide
        />
      </div>
    </div>
    <div class="mt-5 flex justify-end items-end">
      <Button
        class="button-green"
        id="tai-khoan-search-button"
        label="Thống kê"
        @click="filterData"
        icon="pi pi-search"
      />
      <Button
        id="information-add-button"
        class="button-green ml-3"
        label="Xuất file"
        icon="pi pi-file-excel"
        @click="exportExcel"
      />
    </div>
  </div>
  <VTable
    id="noi-dung-table"
    ref="tableRef"
    @pageChanged="onPageChange"
    @perPageChange="onPerPageChange"
    @setWidth="onSetWidth"
    :rows="listNoiDung.reports"
    :show-action="false"
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
        class: 'w-[20%]',
      },
      {
        idx:3,
        class:'w-[20%]'
      }
    ]"
    :tableName="'nội dung'"
    :headers="headers"
    :pagination="{
      totalPage: listNoiDung?.total_page,
      total: listNoiDung?.record_count,
      perPage: params.limit,
    }"
  >
  <template v-slot:items="{ row }">
      <td class="px-2">
        <div class="column-container">
          {{ convertTimeStampToDate(row.report_from) }}
      </div>
      </td>
      <td class="pl-2">
        <div>
        {{ setNoiDung(row.content_type) }}
      </div>
      </td>
      <td class="pl-2">
        <div>
        {{ row.destination.name }}
      </div>
      </td>
      <td class="pl-2">
        <div class="position-container">
          {{ row.total }}
      </div>
      </td>
    </template>
  </VTable>
</template>
<style lang="scss" scoped>
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
}

</style>
