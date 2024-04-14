<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useApi } from '@/store/useApi';
import { useToast } from 'vue-toastification';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import { useField } from 'vee-validate';

export interface ParamsUploadImage {
  file: File;
  type: number;
}
const emit = defineEmits(['uploadFile', 'validate']);
const toast = useToast();
const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const props = withDefaults(defineProps<{
  sizeToValidate?: number;
  disabled?: boolean;
  isHasImage: string;
  numberOfImage: number;
  type?: number;
  id?: string;
}>(), {
  type: 1,
  disabled: false,
  sizeToValidate: 5242880,
});
const imagePreviewUrl = ref<string[]>([]);
const imagePreviewPath = ref<string[]>([]);
const { value: isHasImage, errorMessage: isHasImageErr } = useField<string>(
  props.isHasImage,
);
const removeImage = (index: number) => {
  imagePreviewUrl.value.splice(index, 1);
  if (imagePreviewUrl.value.length === 0) {
    isHasImage.value = '';
  }
  imagePreviewPath.value.splice(index, 1);
};
const inputFile = ref();
const uploadImage = async (event: any) => {
  const fileUpload = event.target.files[0];
  if (!(fileUpload.type === 'image/png' || fileUpload.type === 'image/jpeg')) {
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
    toast.error('File không đúng định dạng, vui lòng chọn lại', {
      timeout: 5000,
    });
  } else if (fileUpload.size > 5242880) {
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
    toast.error('File vượt quá 5 MB, vui lòng chọn lại', {
      timeout: 5000,
    });
  } else {
    try {
      overlayLoading.toggleLoading(true);
      const params = ref<ParamsUploadImage>({
        file: fileUpload,
        type: props.type,
      });
      const res = await api.post(
        '/cms/portal/v1/upload/image_upload',
        { ...params.value },
        { headers: { 'content-type': 'multipart/form-data', AppId: process.env.VUE_APP_BASE_APP_ID } },
      );
      overlayLoading.toggleLoading(false);
      isHasImage.value = 'true';
      imagePreviewUrl.value.push(res.data.data.url_path);
      imagePreviewPath.value.push(res.data.data.path);
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    } catch (err: any) {
      overlayLoading.toggleLoading(false);
    }
  }
};
const clickInputFile = function () {
  inputFile.value.click();
};
defineExpose({
  imagePreviewUrl,
  imagePreviewPath,
});
</script>
<template>
  <div
    class="w-[100%] mb-1"
    :class="
      isHasImageErr
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
        :id="id+'-component'"
        v-show="!(imagePreviewUrl.length === numberOfImage)"
      >
        <input
          ref="inputFile"
          class="cursor-pointer input-file"
          type="file"
          @change="uploadImage"
          :id="id+'-field'"
        />
        <i class="pi pi-upload"></i>
        <p>Chọn ảnh</p>
      </div>
    </div>
    <div class="flex ">
      <div class="file-upload-content flex gap-5 justify-center">
        <div v-for="(item, index) in imagePreviewUrl"
      :key="index" class="w-[30%]" >
      <div class="image-container" v-if="imagePreviewUrl[index]">
        <div v-if="!disabled" class="image-close-button"  @click="removeImage(index)"
            @keydown="removeImage(index)">
        <i class="text-[11px] pi pi-times"></i>
        </div>
        <img
        class="w-[100%]"
          :src="item"
          alt="Red dot"
        />
    </div>
</div>
<i
  v-if="imagePreviewUrl.length === 0"
  class="pi pi-cloud-upload p-5 text-6xl text-400 border-400 text-[#BDBDBD]"
></i>
    </div>
    </div>
  </div>
  <small v-if="isHasImageErr" class="p-error" :id="id+'-text-error'">{{
      isHasImageErr || '&nbsp;'
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
.file-upload-container-err {
  border-radius: 10px;
  border: 1px solid #ef4444;
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

.file-upload-content {
  width: 100%;
  min-height: 100px;
}
.image-container {
 margin: 15px 5px 10px 5px;
  position: relative;
  min-height: 100px;
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
.image-loading {
  width: 10%;
  height: auto;
}

</style>
