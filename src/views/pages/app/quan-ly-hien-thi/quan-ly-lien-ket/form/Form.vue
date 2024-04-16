<script lang="ts" setup>
import Button from 'primevue/button';
import * as yup from 'yup';
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import VInputText from '@/components/base/VInputText.vue';
import VTextarea from '@/components/base/VTextarea.vue';
import InputPosition from '@/components/partials/input/InputPosition.vue';
import { useApi } from '@/store/useApi';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import VUploadImage from '@/components/base/VUploadImage.vue';

const emit = defineEmits(['closeForm', 'getList', 'editForm']);
const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const toast = useToast();
const props = defineProps<{
  formType?: string;
  idForm?: number;
}>();

const validationSchema = yup.object({
  tenLienKet: yup.string().required('Tên liên kết không được để trống.').trim(),
  duongDan: yup.string().required('Đường dẫn không được để trống.').trim(),
  moTa: yup.string(),
  fileType: yup
    .string()
    .matches(/^img$/, 'File không đúng định dạng, vui lòng chọn lại.'),
  fileSize: yup
    .number()
    .max(5 * 1024 * 1024, 'File vượt quá 5MB, vui lòng chọn lại.')
    .nullable(),
  file: yup.lazy(() => (props.formType === 'them'
    ? yup.mixed().required('Ảnh đại diện không được để trống.')
    : yup.mixed())),
  status: yup.string().required('Vui lòng chọn trạng thái'),
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
});
const { values, handleSubmit, setFieldValue } = useForm({
  validationSchema,
});

const status = ref([
  { name: 'Hoạt động', code: 1 },
  { name: 'Tạm khóa', code: 2 },
]);

const refImgUpload = ref();

const getDetail = async () => {
  try {
    const res = await api.get(
      `/cms/portal/v1/link/get_link?id=${props.idForm}`,
    );
    const dataLienKet = res.data.data.link;
    setFieldValue('tenLienKet', dataLienKet?.title);
    setFieldValue('duongDan', dataLienKet?.url);
    setFieldValue('moTa', dataLienKet?.description);
    setFieldValue('viTri', dataLienKet?.address);
    if (dataLienKet?.position) {
      setFieldValue('thuTuHienThi', dataLienKet?.position);
    }
    setFieldValue('status', dataLienKet?.status);
    refImgUpload.value.imagePreviewUrl = dataLienKet?.image;
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

const onSubmit = handleSubmit(async () => {
  const formData = new FormData();
  if (values.file) {
    formData.append('file', values.file);
  }
  formData.append('title', values.tenLienKet);
  formData.append('url', values.duongDan);
  if (values.moTa) {
    formData.append('description', values.moTa);
  }
  formData.append('status', values.status);
  if (values.thuTuHienThi) {
    formData.append('position', values.thuTuHienThi);
  }
  if (props.formType === 'them') {
    overlayLoading.toggleLoading(true);
    await api
      .post('/cms/portal/v1/link/create_link', formData)
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
    formData.append('id', props.idForm);
    await api
      .put('/cms/portal/v1/link/update_link', formData)
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
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Tên liên kết</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VInputText
          :disabled="props.formType === 'xem'"
          name="tenLienKet"
          type="text"
          :maxlength="120"
          placeholder="Nhập tối đa 120 kí tự"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Đường dẫn</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VInputText
          :disabled="props.formType === 'xem'"
          name="duongDan"
          type="text"
          :maxlength="10000"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Mô tả</p>
      </div>
      <div class="w-[100%]">
        <VTextarea
          :disabled="props.formType === 'xem'"
          :rows="5"
          :cols="30"
          name="moTa"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Ảnh đại diện</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VUploadImage
          :id="formType + '_event-form-logo'"
          ref="refImgUpload"
          fileSize="fileSize"
          fileType="fileType"
          file="file"
          imgSize="30%"
          :isSave="true"
          :disabled="props.formType === 'xem'"
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
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Thứ tự hiển thị</p>
      </div>
      <div class="w-[100%]">
        <InputPosition
          :disabled="formType === 'xem'"
          name="thuTuHienThi"
          placeholder="Nhập thứ tự hiển thị"
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
