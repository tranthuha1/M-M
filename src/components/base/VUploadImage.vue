<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useField } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { useApi } from '@/store/useApi';
import { useOverLayLoadingStore } from '@/store/overlayLoading';

export interface ParamsUploadImage {
  file: File;
  type: number;
}

const emit = defineEmits(['uploadFile', 'validate']);
const overlayLoading = useOverLayLoadingStore();
const props = withDefaults(
  defineProps<{
    fileSize: string;
    fileType: string;
    file: string;
    imgSize?: string;
    sizeToValidate?: number;
    disabled?: boolean;
    isSave?: boolean;
    id?: string;
    showIconRemove?: boolean;
    type?: number;
    isToast?: boolean;
    be?: string;
    typeBe?: number;
  }>(),
  {
    showIconRemove: false,
    isToast: false,
    type: 1,
    disabled: false,
    sizeToValidate: 10485760,
    be: 'cms',
  },
);
const { value: fileSize, errorMessage: fileSizeErr } = useField<string>(
  props.fileSize,
);
const { value: fileType, errorMessage: fileTypeErr } = useField<string>(
  props.fileType,
);
const { value: file, errorMessage: fileErr } = useField<File>(props.file);
const api = useApi();
const toast = useToast();

const inputFile = ref();
const fileName = ref();
const imagePreviewUrl = ref();
const imagePreviewPath = ref();

const getFileExtension = (filename: string) => filename.split('.').pop();
const uploadImage = async (event: any) => {
  emit('validate');
  const fileUpload = event.target.files[0];
  fileSize.value = fileUpload?.size;
  fileType.value = '';
  if (fileUpload.type === 'image/png' || fileUpload.type === 'image/jpeg') {
    if (getFileExtension(fileUpload?.name) !== 'jfif') {
      fileType.value = 'img';
    }
  } else if (props.isToast) {
    toast.error('File không đúng định dạng, vui lòng chọn lại', {
      timeout: 5000,
    });
  }
  if (
    !(
      (fileUpload?.type === 'image/png' || fileUpload?.type === 'image/jpeg')
      && getFileExtension(fileUpload?.name) !== 'jfif'
    )
    || fileUpload.size > props.sizeToValidate
  ) {
    if (props.isToast && fileUpload.size > props.sizeToValidate) {
      toast.error(
        `File vượt quá ${
          props.sizeToValidate / 1024 / 1024
        } MB, vui lòng chọn lại`,
        {
          timeout: 5000,
        },
      );
    }
    imagePreviewUrl.value = '';
    fileName.value = '';
  } else {
    fileName.value = fileUpload.name;
    file.value = fileUpload;
    emit('uploadFile', fileUpload);
    if (!props.isSave) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imagePreviewUrl.value = URL.createObjectURL(fileUpload);
      };
      reader.readAsArrayBuffer(fileUpload);
    } else {
      try {
        overlayLoading.toggleLoading(true);
        if (props.be === 'cms') {
          const params = ref<ParamsUploadImage>({
            file: fileUpload,
            type: props.type,
          });
          const res = await api.post(
            '/cms/portal/v1/upload/image_upload',
            { ...params.value },
            {
              headers: {
                'content-type': 'multipart/form-data',
                AppId: process.env.VUE_APP_BASE_APP_ID,
              },
            },
          );
          overlayLoading.toggleLoading(false);
          imagePreviewUrl.value = res.data.data.url_path;
          imagePreviewPath.value = res.data.data.path;
        } else {
          const res = await api.post(
            `/be/api/upload?type=${props.typeBe}`,
            { file: fileUpload },
            { headers: { 'content-type': 'multipart/form-data' } },
          );
          overlayLoading.toggleLoading(false);
          if (res.status === 200 && res.data.code === 0) {
            imagePreviewUrl.value = res.data.data.fullPath;
            imagePreviewPath.value = res.data.data.path;
          } else {
            imagePreviewUrl.value = '';
            imagePreviewPath.value = '';
            inputFile.value = null;
          }
        }
      } catch (err: any) {
        console.log(err);
        overlayLoading.toggleLoading(false);
        imagePreviewUrl.value = '';
        console.log(err);
      }
    }
  }
  // eslint-disable-next-line no-param-reassign
  event.target.value = '';
};
const clickInputFile = function () {
  inputFile.value.click();
};
const removeImage = () => {
  imagePreviewUrl.value = '';
  imagePreviewPath.value = '';
};
// expose ref
defineExpose({
  imagePreviewUrl,
  imagePreviewPath,
});
</script>
<template>
  <div
    class="w-[100%] mb-1"
    :class="
      (fileSizeErr || fileTypeErr || fileErr) && (!isToast || fileErr)
        ? 'file-upload-container-err'
        : 'file-upload-container'
    "
  >
    <div class="file-upload-button-container">
      <div
        @keydown="clickInputFile"
        @click="clickInputFile"
        class="button-input"
        v-if="!disabled"
        :id="id + '-component'"
      >
        <input
          ref="inputFile"
          class="cursor-pointer input-file"
          type="file"
          @change="uploadImage"
          :id="id + '-field'"
        />
        <i class="pi pi-upload"></i>
        <p>Chọn ảnh</p>
      </div>
      <!-- <div>{{ customFileName(fileName) }}</div> -->
    </div>
    <div>
      <div class="file-upload-content flex justify-center">
        <div class="pt-5 flex justify-center">
          <div
            :class="`w-[${imgSize}]`"
            class="image-container"
            v-if="imagePreviewUrl"
          >
            <div
              v-if="showIconRemove && !disabled"
              class="image-close-button"
              @click="removeImage()"
              @keydown="removeImage()"
            >
              <i class="text-[11px] pi pi-times"></i>
            </div>
            <img
              class="pb-5"
              v-if="imagePreviewUrl"
              :src="imagePreviewUrl"
              alt="Red dot"
            />
          </div>
        </div>
        <i
          v-if="!imagePreviewUrl"
          class="pi pi-cloud-upload p-5 text-6xl text-400 border-400 text-[#BDBDBD]"
        ></i>
      </div>
    </div>
  </div>
  <small
    v-if="fileSizeErr && !isToast"
    class="p-error"
    :id="id + '-text-error'"
    >{{ fileSizeErr || '&nbsp;' }}</small
  >
  <small
    v-else-if="fileTypeErr && !isToast"
    class="p-error"
    :id="id + '-text-error'"
    >{{ fileTypeErr || '&nbsp;' }}</small
  >
  <small v-else-if="fileErr" class="p-error" :id="id + '-text-error'">{{
    fileErr || '&nbsp;'
  }}</small>
</template>
<style lang="scss" scoped>
.input-file {
  display: none;
}

.button-input {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 35px;
  width: fit-content;
  color: #fff;
  background-color: var(--main-color);
  border-radius: 30px;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
}

.file-upload-container {
  border-radius: 10px;
  border: 1px solid #e3e2ea;
}
.image-container {
  margin-top: 10px;
  position: relative;
  min-height: 100px;
  max-width: 30%;
}
.file-upload-button-container {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #e3e2ea;
  background-color: #f7f7f7;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.image-close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 20px;
  width: 20px;
  background-color: #ced4da;
  cursor: pointer;
  position: absolute;
  top: -10px;
  left: -10px;
}
.file-upload-container-err {
  border-radius: 10px;
  border: 1px solid #ef4444;
}

.file-upload-content {
  width: 100%;
  min-height: 100px;
}
</style>
