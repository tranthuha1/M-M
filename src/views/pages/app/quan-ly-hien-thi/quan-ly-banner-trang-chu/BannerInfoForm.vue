<script lang="ts" setup>
import Button from 'primevue/button';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { onMounted, ref } from 'vue';
import VUploadImage from '@/components/base/VUploadImage.vue';
import VDropDown from '@/components/base/VDropDown.vue';
import VInputText from '@/components/base/VInputText.vue';
import VInputSwitch from '@/components/base/VInputSwitch.vue';
import InputPosition from '@/components/partials/input/InputPosition.vue';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import { useApi } from '@/store/useApi';

const emit = defineEmits(['closeForm', 'getList', 'openEditForm']);
const props = defineProps<{
  formType: string;
  banner?: any;
}>();
const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const toast = useToast();
const refImgUpload = ref();
const refImgMobileUpload = ref();
const linkType = ref([
  { name: 'Không liên kết', code: 1 },
  { name: 'Nội dung', code: 2 },
  { name: 'URL', code: 3 },
  // { name: 'Cuộc thi' },
]);
const status = ref([
  { name: 'Hoạt động', code: 1 },
  { name: 'Tạm khoá', code: 2 },
]);
const imgURL = ref();
const listPost = ref();
const validationSchema = yup.object({
  fileSize: yup
    .number()
    .max(10485760, 'File vượt quá 10MB, vui lòng chọn lại')
    .nullable(),
  fileType: yup
    .string()
    .matches(/^img$/, 'Ảnh tải lên phải có định dạng jpg, png'),
  file: yup.mixed().when((linkTypeSelected, schema) => {
    if (imgURL.value) {
      return schema;
    }
    return schema.required('File ảnh không được để trống');
  }),
  fileMobileSize: yup
    .number()
    .max(10485760, 'File vượt quá 10MB, vui lòng chọn lại')
    .nullable(),
  fileMobileType: yup
    .string()
    .matches(/^img$/, 'Ảnh tải lên phải có định dạng jpg, png'),
  fileMobile: yup.mixed().when((linkTypeSelected, schema) => {
    if (imgURL.value) {
      return schema;
    }
    return schema.required('File ảnh không được để trống');
  }),
  bannerText: yup.string().max(120, 'Tên banner không được vượt quá 120 ký tự'),
  linkTypeSelected: yup.number(),
  link: yup.string().when('linkTypeSelected', (linkTypeSelected, schema) => {
    if (linkTypeSelected[0] === 3) {
      return schema
        .required('Đường link không được để trống')
        .test(
          'is-all-space',
          'Đường link không được để trống',
          (value) => !/^\s*$/.test(value || ''),
        );
    }
    return schema;
  }),
  postId: yup.number().when('linkTypeSelected', (linkTypeSelected, schema) => {
    if (linkTypeSelected[0] === 2) {
      return schema.required('Vui lòng chọn tin tức');
    }
    return schema;
  }),
  position: yup
    .string()
    .test('is-positive-integer', 'Chỉ nhập số nguyên dương.', (value) => {
      if (value && value.trim() !== '') {
        const intValue = parseInt(value, 10);
        return /^[0-9]\d*$/.test(value) && intValue > 0;
      }
      return true;
    }),
  bannerStatus: yup.number(),
});

const {
  values, handleSubmit, setFieldValue, setFieldError,
} = useForm({
  validationSchema,
});
const getListPost = async () => {
  try {
    const res = await api.get('/cms/portal/v1/post/list_all_post');
    listPost.value = res.data.data.data.map((item: any) => ({
      name: item.name,
      code: item.id,
    }));
  } catch (err: any) {
    console.error(err);
  }
};

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

const onSubmit = handleSubmit(async () => {
  const params = new FormData();
  params.append('file', values.file);
  params.append('file_mobile', values.fileMobile);
  params.append('status', values.bannerStatus);
  params.append('ref_type', String(values.linkTypeSelected));
  params.append(
    'position',
    values.position === '' || !values.position ? 0 : values.position,
  );
  if (values.bannerText) {
    params.append('name_title', values.bannerText);
  }
  if (values.link) {
    params.append('url_ref', values.link);
  }
  if (values.postId) {
    params.append('post_ref', values.postId);
  }
  if (props.formType === 'them') {
    await api
      .post('/cms/portal/v1/banner/create_banner', params)
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
  if (props.formType === 'sua') {
    params.append('banner_id', props.banner.id);
    await api
      .put('/cms/portal/v1/banner/update_banner', params)
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
// const handleKeyDown = (event: any) => {
//   if (position.value.length === 6 && event.keyCode !== 8) {
//     event.preventDefault();
//   }
//   if (
//     (event.key === 'e' || event.key === '+' || event.key === '-') || (parseInt(position.value + event.key, 10) > 100000)
//   ) {
//     event.preventDefault();
//   }
// };
const OpenUpdateBannerForm = function () {
  emit('openEditForm', props.banner);
};
onMounted(async () => {
  await getListPost();
  overlayLoading.toggleLoading(true);
  if (props.formType === 'them') {
    setFieldValue('linkTypeSelected', 1);
    setFieldValue('bannerStatus', 1);
    overlayLoading.toggleLoading(false);
  }
  if (props.formType === 'sua' || props.formType === 'xem') {
    overlayLoading.toggleLoading(true);
    await api
      .get(`/cms/portal/v1/banner/get_banner?banner_id=${props.banner.id}`)
      .then((response) => {
        if (response.data.code === 0) {
          const res = response.data.data.banner;
          setFieldValue('bannerText', res.title_name);
          if (res.position > 0) {
            setFieldValue('position', res.position);
          }

          setFieldValue('bannerStatus', res.status);
          imgURL.value = res.image_url;
          refImgUpload.value.imagePreviewUrl = imgURL.value;
          refImgMobileUpload.value.imagePreviewUrl = res.app_image_url;
          if (res.ref_type === 3) {
            setFieldValue('linkTypeSelected', 3);
            setFieldValue('link', res.url_ref);
          } else if (res.ref_type === 2) {
            setFieldValue('linkTypeSelected', 2);
            setFieldValue('postId', res.ref.id);
          } else {
            setFieldValue('linkTypeSelected', 1);
          }
          overlayLoading.toggleLoading(false);
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
  <div class="info-item-container1 mt-5">
    <div
      class="flex flex-col mt-5 gap-1 items-start"
      id="banner-form-banner-file-group"
    >
      <div class="flex items-center w-[100%]">
        <p id="banner-form-banner-file-title">Ảnh banner PC</p>
        <span class="ml-1" style="color: red">*</span>
        <p
          class="text-sm italic pl-5 text-red-600"
          id="banner-form-banner-file-warning"
        >
          Ảnh tải lên dạng jpg, png. Kích thước tối đa 10MB. Kích thước tiêu
          chuẩn 1920 x 720px
        </p>
      </div>
      <VUploadImage
        id="banner-form-banner-file"
        ref="refImgUpload"
        styleImg="w-[120px]"
        fileSize="fileSize"
        fileType="fileType"
        file="file"
        imgSize="100%"
        :disabled="props.formType === 'xem'"
      />
    </div>
    <div class="flex flex-col mt-5 gap-1" id="banner-form-banner-file-group">
      <div class="flex items-center w-[100%]">
        <p id="banner-form-banner-file-title">Ảnh banner mobile</p>
        <span class="ml-1" style="color: red">*</span>
        <p
          class="text-sm italic pl-5 text-red-600"
          id="banner-form-banner-file-warning"
        >
          Ảnh tải lên dạng jpg, png. Kích thước tối đa 10MB. Kích thước tiêu
          chuẩn 560 x 720px
        </p>
      </div>
      <VUploadImage
        id="banner-form-banner-file"
        ref="refImgMobileUpload"
        styleImg="w-[120px]"
        fileSize="fileMobileSize"
        fileType="fileMobileType"
        file="fileMobile"
        imgSize="100%"
        :disabled="props.formType === 'xem'"
      />
    </div>
    <div class="flex-col flex mt-5" id="banner-form-banner-position-group">
      <div class="flex items-center w-[200px]">
        <p id="banner-form-banner-position-title">Thứ tự hiển thị</p>
      </div>
      <div class="w-[100%] mt-1">
        <InputPosition id="banner-form-position" name="position" type="text" />
      </div>
    </div>
    <div class="flex-col flex mt-5" id="banner-form-banner-link-type-group">
      <div class="flex items-center">
        <p id="banner-form-banner-link-type-title">Liên kết tới</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="mt-1 input-user-info w-[100%]">
        <VDropDown
          id="banner-form-banner-link-type"
          :isFilter="false"
          :show="true"
          optionLabel="name"
          optionValue="code"
          :options="linkType"
          name="linkTypeSelected"
          type="text"
          :disabled="props.formType === 'xem'"
        />
      </div>
    </div>
    <div
      v-show="values.linkTypeSelected === 3"
      class="flex-col flex mt-5"
      id="banner-form-banner-url-group"
    >
      <div class="flex items-center">
        <p id="banner-form-banner-url-title">Đường link</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VInputText
          id="banner-form-banner-url"
          name="link"
          type="text"
          :disabled="props.formType === 'xem'"
        />
      </div>
    </div>
    <div
      v-if="values.linkTypeSelected === 2"
      class="flex-col flex mt-5"
      id="banner-form-banner-post-group"
    >
      <div class="flex items-center">
        <p id="banner-form-banner-post-title">Chọn nội dung</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%]">
        <VDropDown
          :show="true"
          :options="listPost"
          optionValue="code"
          optionLabel="name"
          placeholder="Chọn nội dung"
          id="banner-form-banner-post"
          name="postId"
          type="text"
          :disabled="props.formType === 'xem'"
        />
      </div>
    </div>
    <div class="flex-col flex mt-5" id="banner-form-banner-text-group">
      <div class="flex items-center w-[200px]">
        <p id="banner-form-banner-text">Text hiển thị</p>
      </div>
      <div class="w-[100%] mt-1">
        <VInputText
          id="banner-form-banner-url"
          label="Nhập tối đa 120 kí tự"
          name="bannerText"
          type="text"
          :maxlength="120"
          :disabled="props.formType === 'xem'"
        />
      </div>
    </div>
    <div class="flex-col flex mt-5" id="banner-form-banner-status-group">
      <div class="flex items-center w-[200px]">
        <p id="banner-form-banner-text">Trạng thái</p>
        <span class="ml-1" style="color: red">*</span>
      </div>
      <div class="w-[100%] mt-1">
        <VDropDown
          :show="true"
          :isFilter="false"
          :options="status"
          optionValue="code"
          optionLabel="name"
          id="banner-form-banner-status"
          name="bannerStatus"
          type="text"
          :disabled="props.formType === 'xem'"
        />
      </div>
    </div>
    <!-- <div v-if="selectedLinkType.name === 'Cuộc thi'" class="flex-col flex mt-5" id="banner-form-banner-cuoc-thi-group">
        <div class="w-[200px]">
      <p id="banner-form-banner-cuoc-thi-title">Chọn cuộc thi</p>
    </div>
    <div class="w-[100%]">
      <VDropDown :show="true" :options="listPermission" optionValue="id" optionLabel="name"
        name="group_permission_id" type="text" id="banner-form-banner-cuoc-thi" />
    </div>
    </div> -->
  </div>
  <div class="save-container flex justify-end gap-5 mt-5">
    <Button
      id="banner-form-close-button"
      @click="() => emit('closeForm')"
      class="button-gray"
      label="Đóng"
      icon="pi pi-times"
    />
    <!-- <Button
      id="banner-form-save-draft-button"
      @click="saveDraft"
      class="button-green"
      label="Lưu nháp"
      icon="pi pi-save"
    /> -->
    <Button
      @click="OpenUpdateBannerForm"
      v-if="props.formType === 'xem'"
      class="button-green"
      id="member-update-form-button"
      label="Cập nhật"
      icon="pi pi-replay"
    />
    <Button
      id="banner-form-save-button"
      v-if="props.formType === 'sua' || props.formType === 'them'"
      @click="onSubmit()"
      class="button-green"
      label="Lưu"
      icon="pi pi-check"
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
