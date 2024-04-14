<script lang="ts" setup>
import Button from 'primevue/button';
import { useToast } from 'vue-toastification';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { onMounted, ref } from 'vue';
import { checkPermission } from '@/utils';
import VUploadImage from '@/components/base/VUploadImage.vue';
import Ckeditor from '@/components/base/Ckeditor.vue';
import VTextarea from '@/components/base/VTextarea.vue';
import VDropDown from '@/components/base/VDropDown.vue';
import VInputText from '@/components/base/VInputText.vue';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import { useApi } from '@/store/useApi';

const emit = defineEmits(['closeForm', 'getList', 'updateForm']);
const props = defineProps<{
  user: number;
  formType: string;
  tinBaiID?: any;
}>();
const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const toast = useToast();
const refImgUpload = ref();
const imgURL = ref();
const listDiemDen = ref();
const listChuyenMuc = ref([
  { name: 'Tin du lịch', id: 4 },
  { name: 'Tuyên truyền quảng bá', id: 6 },
  { name: 'Ăn gì', id: 7 },
  { name: 'Mua gì', id: 8 },
]);
const listStatusAdd = ref([
  { name: 'Hoạt động', id: 2 },
  { name: 'Tạm khóa', id: 4 },
]);
const listStatusUpdate = ref();
const validationSchema = yup.object({
  fileSize: yup
    .number()
    .max(5242880, 'File vượt quá 5MB, vui lòng chọn lại')
    .nullable(),
  fileType: yup
    .string()
    .matches(/^img$/, 'File không đúng định dạng, vui lòng chọn lại'),
  file: yup.mixed().when((linkTypeSelected, schema) => {
    if (imgURL.value) {
      return schema;
    }
    return schema.required('Ảnh đại diện không được để trống');
  }),
  tieuDeTinBai: yup
    .string()
    .required('Tiêu đề tin bài không được để trống')
    .trim(),
  chuyenMuc: yup.number().required('Vui lòng chọn chuyên mục'),
  status: yup.number().when((status, schema) => {
    if (props.user === -1) {
      return schema.required('Vui lòng chọn trạng thái');
    }
    return schema;
  }),
  noiDungTin: yup.string().required('Nội dung tin không được để trống'),
});
const {
  values, handleSubmit, setFieldValue, setFieldError,
} = useForm({
  validationSchema,
});
const getListDiemDen = async () => {
  try {
    const res = await api.get(
      '/cms/portal/v1/category/list_all_category?group=3',
    );
    listDiemDen.value = res.data.data.categories.map((item: any) => ({
      name: item.name,
      id: item.id,
    }));
  } catch (err: any) {
    console.error(err);
  }
};
const getDetail = async () => {
  try {
    const res = await api.get(
      `/cms/portal/v1/article/get_article?id=${props.tinBaiID}`,
    );
    const tinBai = res.data.data.article;
    setFieldValue('tieuDeTinBai', tinBai.title);
    setFieldValue('diemDen', tinBai.destination.id);
    setFieldValue('chuyenMuc', tinBai.category_type[0].id);
    if (tinBai.description) {
      setFieldValue('moTa', tinBai.description);
    }
    setFieldValue('status', tinBai.status);
    imgURL.value = tinBai.avatar;
    refImgUpload.value.imagePreviewUrl = imgURL.value;
    setFieldValue('noiDungTin', tinBai.content);
  } catch (err: any) {
    console.error(err);
  }
};
const onSubmit = handleSubmit(async () => {
  const params = new FormData();
  params.append('title', values.tieuDeTinBai);
  params.append('destination_id', values.diemDen ?? 0);
  params.append('category_type', values.chuyenMuc);
  if (values.moTa) {
    params.append('description', values.moTa);
  }
  if (values.file) {
    params.append('file', values.file);
  }
  params.append('status', values.status);
  params.append('content', values.noiDungTin);
  if (props.formType === 'them') {
    await api
      .post('/cms/portal/v1/article/create_article', params)
      .then((response) => {
        if (response.data.code === 0) {
          overlayLoading.toggleLoading(false);
          emit('closeForm');
          emit('getList');
          toast.success(response.data.message, {
            timeout: 3000,
          });
        } else if (response.data.code === 20002) {
          overlayLoading.toggleLoading(false);
          setFieldError('tieuDeTinBai', response.data.message);
        } else {
          overlayLoading.toggleLoading(false);
          toast.error(response.data.message, {
            timeout: 3000,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        overlayLoading.toggleLoading(false);
      });
  }
  if (props.formType === 'sua') {
    params.append('id', props.tinBaiID);
    await api
      .put('/cms/portal/v1/article/update_article', params)
      .then((response) => {
        if (response.data.code === 0) {
          overlayLoading.toggleLoading(false);
          emit('closeForm');
          emit('getList');
          toast.success(response.data.message, {
            timeout: 3000,
          });
        } else if (response.data.code === 20002) {
          overlayLoading.toggleLoading(false);
          setFieldError('tieuDeTinBai', response.data.message);
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
const { resetField: setNoiDungTin } = useField(
  'noiDungTin',
  (value) => !!value,
);
onMounted(async () => {
  overlayLoading.toggleLoading(true);
  setNoiDungTin({
    value: null,
    touched: false,
  });
  await getListDiemDen();
  if (props.formType === 'xem' || props.formType === 'sua') {
    await getDetail();
    if (values.status === 2 || values.status === 4) {
      listStatusUpdate.value = listStatusAdd.value;
    } else if (values.status === 1) {
      listStatusUpdate.value = [
        { name: 'Chờ duyệt', id: 1 },
        { name: 'Hoạt động', id: 2 },
        { name: 'Từ chối duyệt', id: 3 },
      ];
    } else if (values.status === 3) {
      listStatusUpdate.value = [{ name: 'Từ chối duyệt', id: 3 }];
    }
  } else {
    setFieldValue('status', 2);
    if (!(props.user === -1)) {
      setFieldValue('diemDen', listDiemDen.value[0].id);
    }
  }
  overlayLoading.toggleLoading(false);
});
</script>
<template>
  <div
    class="info-item-container1 mt-5"
    :class="props.formType === 'xem' ? 'disable-event' : ''"
  >
    <div class="flex flex-col" id="banner-form-banner-name-group">
      <div class="flex items-center">
        <p id="banner-form-banner-name-title">Tiêu đề tin bài</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VInputText
          id="banner-form-banner-name"
          placeholder="Nhập tối đa 120 ký tự"
          name="tieuDeTinBai"
          type="text"
          :maxlength="120"
        />
      </div>
    </div>
    <div class="flex-col flex mt-5">
      <div class="flex items-center">
        <p>Điểm đến</p>
      </div>
      <div class="w-[100%]">
        <VDropDown
          :show="true"
          :options="listDiemDen"
          optionValue="id"
          optionLabel="name"
          placeholder="Chọn điểm đến"
          name="diemDen"
          :showClear="true"
        />
      </div>
    </div>
    <div class="flex-col flex mt-5">
      <div class="flex items-center">
        <p>Chuyên mục</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VDropDown
          :show="true"
          :options="listChuyenMuc"
          optionValue="id"
          optionLabel="name"
          placeholder="Chọn chuyên mục"
          name="chuyenMuc"
        />
      </div>
    </div>
    <div class="flex flex-col mt-5" id="banner-form-banner-name-group">
      <div id="banner-form-banner-name-title">Mô tả</div>
      <div class="w-[100%]">
        <VTextarea :rows="5" :cols="30" :maxlength="5000" name="moTa" />
      </div>
    </div>
    <div
      class="flex flex-col mt-5 gap-1 items-start"
      id="banner-form-banner-file-group"
    >
      <div class="flex items-center w-[100%]">
        <p id="banner-form-banner-file-title">Ảnh đại diện</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <VUploadImage
        ref="refImgUpload"
        styleImg="w-[120px]"
        :size-to-validate="5242880"
        fileSize="fileSize"
        fileType="fileType"
        :disabled="formType === 'xem'"
        file="file"
        imgSize="100%"
      />
    </div>
    <div v-if="user === -1" class="flex-col flex mt-5">
      <div class="flex items-center">
        <p>Trạng thái</p>
      </div>
      <div class="w-[100%]">
        <VDropDown
          :show="true"
          :options="formType === 'them' ? listStatusAdd : listStatusUpdate"
          optionValue="id"
          optionLabel="name"
          :is-filter="false"
          placeholder="Chọn trạng thái"
          name="status"
        />
      </div>
    </div>
    <div class="mt-5 flex-col flex items-start">
      <div class="flex items-center">
        <p>
          Nội dung tin
          <span style="color: red">*</span>
        </p>
      </div>
      <div class="w-[100%] mt-1">
        <Ckeditor name="noiDungTin"></Ckeditor>
      </div>
    </div>
  </div>
  <div class="save-container flex justify-end gap-5 mt-5">
    <Button
      id="banner-form-close-button"
      @click="() => emit('closeForm')"
      class="button-gray"
      label="Đóng"
      icon="pi pi-times"
    />
    <Button
      id="banner-form-save-button"
      @click="onSubmit()"
      class="button-green"
      v-if="!(formType === 'xem')"
      label="Lưu"
      icon="pi pi-check"
    />
    <Button
      id="banner-form-save-button"
      @click="emit('updateForm')"
      class="button-green"
      v-if="formType === 'xem' && checkPermission('cap_nhat_thong_tin_tin_bai')"
      label="Cập nhật"
      icon="pi pi-replay"
    />
  </div>
</template>
<style scoped>
.info-item-container1 {
  height: auto;
  display: flex;
  flex-direction: column;
}

.save-container {
  background-color: #fff;
  border-radius: 0 0 30px 30px;
  width: 100%;
  position: absolute;
  padding: 25px 70px 22px 0;
  right: 0;
  bottom: 0;
}

.item-container {
  background-color: #f7f7f7;
  border-radius: 10px;
  border: 1px solid #e3e2ea;
  padding: 15px;
}
</style>
