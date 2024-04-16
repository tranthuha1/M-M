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
import { statusVideo } from '@/constants/video';
import VDropDown from '@/components/base/VDropDown.vue';

const emit = defineEmits(['closeForm', 'getList', 'editForm']);
const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const toast = useToast();
const props = defineProps<{
  formType?: string;
  dataDiemDen?: any;
  typeUser?: number;
  idForm?: number;
}>();
const fileLogoImageValidate = ref(true);
const validationSchema = yup.object({
  tenVideo: yup.string().required('Tên video không được để trống.').trim(),
  moTa: yup.string(),
  fileType: yup
    .string()
    .matches(/^img$/, 'File không đúng định dạng, vui lòng chọn lại.'),
  fileSize: yup
    .number()
    .max(10 * 1024 * 1024, 'File vượt quá 10MB, vui lòng chọn lại.')
    .nullable(),
  file: yup.mixed().when((linkTypeSelected, schema) => {
    if (fileLogoImageValidate.value) {
      return schema.required('Ảnh đại diện không được để trống');
    }
    return schema;
  }),
  status: yup.lazy(() => (props.typeUser === -1
    ? yup.string().required('Vui lòng chọn trạng thái.')
    : yup.string())),
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
  linkVideo: yup.string().required('Link video không được để trống.').trim(),
});
const { values, handleSubmit, setFieldValue } = useForm({
  validationSchema,
});

const status = ref([
  { name: 'Hoạt động', code: statusVideo.statusDuyet },
  { name: 'Tạm khóa', code: statusVideo.statusKhoa },
]);

const diemDen = ref([]);

const refImgUpload = ref();

const getDetail = async () => {
  try {
    const res = await api.get(
      `/cms/portal/v1/video/get_video?id=${props.idForm}`,
    );
    const dataVideo = res.data.data.video;
    setFieldValue('tenVideo', dataVideo?.title);
    if (dataVideo?.destination_id) {
      setFieldValue('diemDen', dataVideo?.destination_id);
    }
    setFieldValue('linkVideo', dataVideo?.url);
    setFieldValue('moTa', dataVideo?.description);
    if (dataVideo?.position) {
      setFieldValue('thuTuHienThi', dataVideo?.position);
    }
    setFieldValue('status', dataVideo?.status);

    const searchPattern = `${process.env.VUE_APP_BASE_API_URL}/cms`;
    refImgUpload.value.imagePreviewUrl = dataVideo?.image;
    refImgUpload.value.imagePreviewPath = dataVideo.image.replace(
      searchPattern,
      '',
    );
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
    fileLogoImageValidate.value = false;
    await getDetail();
    if (values.status === statusVideo.statusChoDuyet) {
      status.value = [
        { name: 'Chờ duyệt', code: statusVideo.statusChoDuyet },
        { name: 'Hoạt động', code: statusVideo.statusDuyet },
        { name: 'Từ chối duyệt', code: statusVideo.statusTuChoi },
      ];
    } else if (values.status === statusVideo.statusTuChoi) {
      status.value = [
        { name: 'Từ chối duyệt', code: statusVideo.statusTuChoi },
      ];
    } else if (values.status === statusVideo.statusDuyet) {
      status.value = [
        { name: 'Hoạt động', code: statusVideo.statusDuyet },
        { name: 'Tạm khóa', code: statusVideo.statusKhoa },
      ];
    } else if (values.status === statusVideo.statusKhoa) {
      status.value = [
        { name: 'Tạm khóa', code: statusVideo.statusKhoa },
        { name: 'Hoạt động', code: statusVideo.statusDuyet },
      ];
    }
  } else {
    setFieldValue('status', statusVideo.statusDuyet);
  }
  overlayLoading.toggleLoading(false);
  diemDen.value = props.dataDiemDen.map((item: any) => ({
    code: item.id,
    name: item.name,
  }));
});

const onSubmit = handleSubmit(async () => {
  const formData = new FormData();
  formData.append('avt_url', refImgUpload.value.imagePreviewPath);
  formData.append('title', values.tenVideo);
  formData.append('destination_id', values.diemDen ?? 0);
  formData.append('url', values.linkVideo);
  if (values.moTa) {
    formData.append('description', values.moTa);
  }
  if (values.thuTuHienThi) {
    formData.append('position', values.thuTuHienThi);
  }
  if (props.formType === 'them') {
    if (props.typeUser !== -1) {
      formData.append('status', statusVideo.statusChoDuyet);
    } else {
      formData.append('status', values.status);
    }
    overlayLoading.toggleLoading(true);
    await api
      .post('/cms/portal/v1/video/create_video', formData)
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
    formData.append('status', values.status);
    formData.append('id', props.idForm);
    await api
      .put('/cms/portal/v1/video/update_video', formData)
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
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Tên video</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VInputText
          :disabled="props.formType === 'xem'"
          name="tenVideo"
          type="text"
          :maxlength="120"
          placeholder="Nhập tối đa 120 kí tự"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <div class="flex items-center">
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Điểm đến</p>
      </div>
      <div class="w-[100%]">
        <VDropDown
          id="notification-form-status"
          :show="true"
          optionLabel="name"
          optionValue="code"
          :disabled="props.formType === 'xem'"
          :options="diemDen"
          name="diemDen"
          type="text"
          placeholder="Chọn điểm đến"
          :showClear="true"
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
          @validate="
            () => {
              fileLogoImageValidate = true;
            }
          "
          file="file"
          :isSave="true"
          :type="4"
          :disabled="props.formType === 'xem'"
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
    <div class="flex flex-col mt-5" v-if="props.typeUser === -1">
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
        <p id="dieu-tra-khach-du-lich-form-ho-va-ten-label">Link video</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VInputText
          :disabled="props.formType === 'xem'"
          name="linkVideo"
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
