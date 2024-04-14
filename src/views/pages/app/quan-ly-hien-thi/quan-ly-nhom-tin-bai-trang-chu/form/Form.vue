<script lang="ts" setup>
import Button from 'primevue/button';
import * as yup from 'yup';
import { ref, onMounted, watch } from 'vue';
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import VInputText from '@/components/base/VInputText.vue';
import InputPosition from '@/components/partials/input/InputPosition.vue';
import { useApi } from '@/store/useApi';
import { useOverLayLoadingStore } from '@/store/overlayLoading';

const emit = defineEmits(['closeForm', 'getList', 'editForm']);
const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const toast = useToast();
const props = defineProps<{
  formType?: string;
  idForm?: number;
}>();

const validationSchema = yup.object({
  tenNhomTinBai: yup
    .string()
    .required('Tên nhóm tin bài không được để trống.')
    .trim(),
  thuTuHienThi: yup
    .string()
    .test(
      'is-positive-integer',
      'Giá trị nhập vào phải là số nguyên dương.',
      (value) => {
        if (value && value.trim() !== '') {
          const intValue = parseInt(value, 10);
          return (
            /^[0-9]\d*$/.test(value) && intValue > 0 && intValue <= 1000000
          );
        }
        return true;
      },
    ),
  chuyenMuc: yup.string().required('Chuyên mục không được để trống'),
  chuyenMucCon: yup.string(),
  status: yup.number(),
});
const { values, handleSubmit, setFieldValue } = useForm({
  validationSchema,
});

const listChuyenMuc = ref([
  { name: 'Tin tức', code: 1 },
  { name: 'Điểm lưu trú', code: 4 },
  { name: 'Nhà hàng đạt chuẩn', code: 5 },
  { name: 'Sản phẩm OCOP', code: 6 },
  { name: 'Khảo sát', code: 2 },
]);

const listChuyenMucCon = ref([]) as any;
const getListChuyenMucCon = async () => {
  try {
    const res = await api.get(
      `/cms/portal/v1/category/list_all_category?group=${values.chuyenMuc}`,
    );
    listChuyenMucCon.value = res.data.data.categories;
  } catch (err: any) {
    console.error(err);
  }
};

const status = ref([
  { name: 'Hoạt động', code: 1 },
  { name: 'Tạm khóa', code: 2 },
]);

const getDetail = async () => {
  try {
    const res = await api.get(
      `/cms/portal/v1/page_setting/get_page_setting?id=${props.idForm}`,
    );
    const data = res.data.data.page_setting;
    setFieldValue('tenNhomTinBai', data?.title);
    if (data.position) {
      setFieldValue('thuTuHienThi', data?.position);
    }
    setFieldValue('chuyenMuc', data?.group);
    setFieldValue('chuyenMucCon', data?.category.id);
    setFieldValue('status', data?.status);
  } catch (err: any) {
    console.error(err);
  }
};

const redirectUpdate = () => {
  emit('editForm', {
    id: props.idForm,
  });
};

onMounted(async () => {
  overlayLoading.toggleLoading(true);
  if (props.formType !== 'them') {
    await getDetail();
  } else {
    setFieldValue('status', 1);
  }
  overlayLoading.toggleLoading(false);
});

watch(
  () => values.chuyenMuc,
  (value) => {
    getListChuyenMucCon();
  },
);

const onSubmit = handleSubmit(async () => {
  if (props.formType === 'them') {
    const data = {
      category_type: values.chuyenMucCon,
      group: values.chuyenMuc,
      position: Number(values.thuTuHienThi),
      status: values.status,
      title: values.tenNhomTinBai,
    };
    overlayLoading.toggleLoading(true);
    await api
      .post('/cms/portal/v1/page_setting/create_page_setting', data)
      .then((response) => {
        if (response.data.code === 0) {
          overlayLoading.toggleLoading(false);
          emit('closeForm');
          emit('getList');
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
  } else if (props.formType === 'sua') {
    const data = {
      category_type: values.chuyenMucCon,
      group: values.chuyenMuc,
      position: Number(values.thuTuHienThi),
      status: values.status,
      title: values.tenNhomTinBai,
      id: props.idForm,
    };
    await api
      .put('/cms/portal/v1/page_setting/update_page_setting', data)
      .then((response) => {
        if (response.data.code === 0) {
          overlayLoading.toggleLoading(false);
          emit('closeForm');
          emit('getList');
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
  }
});
</script>
<template>
  <div class="grid grid-cols-1 gap-x-4">
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Tên nhóm tin bài</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VInputText
          :disabled="props.formType === 'xem'"
          name="tenNhomTinBai"
          type="text"
          :maxlength="30"
          placeholder="Nhập nội dung"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Thứ tự hiển thị</p>
      </div>
      <div class="w-[100%]">
        <InputPosition
          :maxlength="9"
          :disabled="formType === 'xem'"
          name="thuTuHienThi"
          placeholder="Nhập thứ tự hiển thị"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Chuyên mục</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VDropDown
          :show="true"
          optionLabel="name"
          optionValue="code"
          :isFilter="false"
          :disabled="props.formType === 'xem'"
          :options="listChuyenMuc"
          name="chuyenMuc"
          type="text"
          placeholder="Chọn chuyên mục"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Chuyên mục con</p>
      </div>
      <div class="w-[100%]">
        <VDropDown
          :show="true"
          optionLabel="name"
          optionValue="id"
          :isFilter="false"
          :disabled="props.formType === 'xem' || !values.chuyenMuc"
          :options="listChuyenMucCon"
          name="chuyenMucCon"
          type="text"
          placeholder="Chọn chuyên mục con"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-o-lai-bao-lau-label">Trạng thái</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VDropDown
          id="notification-form-status"
          :show="true"
          optionLabel="name"
          optionValue="code"
          :isFilter="false"
          :disabled="props.formType === 'xem'"
          :options="status"
          name="status"
          type="text"
        />
      </div>
    </div>
  </div>

  <div class="save-container flex justify-end gap-5 mt-5">
    <Button
      @click="() => emit('closeForm')"
      class="button-gray"
      label="Đóng"
      icon="pi pi-times"
      id="dieu-tra-khach-du-lich-form-close-button"
    />
    <Button
      v-if="props.formType !== 'xem'"
      class="button-green"
      label="Lưu"
      icon="pi pi-check"
      id="dieu-tra-khach-du-lich-form-save-button"
      @click="onSubmit"
    />
    <Button
      v-else
      @click="redirectUpdate"
      class="button-green"
      id="tai-khoan-update-form-button"
      label="Cập nhật"
      icon="pi pi-replay"
    />
  </div>
</template>
<style scoped>
.save-container {
  background-color: #fff;
  border-radius: 0 0 30px 30px;
  width: 100%;
  position: absolute;
  padding: 24px 70px 21px 0;
  right: 0;
  bottom: 0;
}
td {
  height: 53px;
  border: 2px solid #eceeef;
  color: #54667a;
}
.input-table {
  width: 50%;
  text-align: center;
  border-bottom: 1px dashed #ccc;
}
input:focus {
  outline: none;
  border-bottom: 1px dashed #ccc;
}
</style>
