<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { useApi } from '@/store/useApi';

const emit = defineEmits(['uploadFile']);
const props = withDefaults(defineProps<{
  fileSize: string;
  fileType: string;
  file: string;
  imgSize: string;
  isSave?: boolean;
  sizeValid?: number;
  imageUrl?: string;
  disabled?: boolean;
  id?: string;
}>(), {
  disabled: false,
});

export interface ParamsUploadImage {
  file: File;
  type: number;
}

const { value: fileSize, errorMessage: fileSizeErr } = useField<string>(props.fileSize);
const { value: fileType, errorMessage: fileTypeErr } = useField<string>(props.fileType);
const { value: file, errorMessage: fileErr } = useField<File>(props.file);
const imagePreviewUrl = ref();
const inputFile = ref();
const api = useApi();
const toast = useToast();

const uploadImage = async (event: any) => {
  const fileUpload = event.target.files[0];
  fileSize.value = fileUpload.size;
  fileType.value = '';
  if (!props.isSave) {
    if (
      fileUpload.type === 'image/jpeg'
      || fileUpload.type === 'image/png' || fileUpload.type === 'image/jpg'
    ) {
      fileType.value = 'img';
    }
    let fs = 0;
    if (props.sizeValid) {
      fs = props.sizeValid;
    }
    if (!(fileUpload.type === 'image/jpeg'
      || fileUpload.type === 'image/png' || fileUpload.type === 'image/jpg') || fileUpload.size > fs) {
      file.value = fileUpload;
      imagePreviewUrl.value = '';
    } else {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imagePreviewUrl.value = URL.createObjectURL(fileUpload);
      };
      reader.readAsArrayBuffer(fileUpload);
    }
  } else {
    const type = fileUpload.name.split('.').pop().toString().toLowerCase();
    console.log(type);
    if (!(type === 'jpg' || type === 'jpeg' || type === 'png')) {
      toast.error('Ảnh tải lên không đúng định dạng!');
      imagePreviewUrl.value = '';

      return;
    }
    if (fileUpload.size > props.imgSize) {
      toast.error('Ảnh tải lên có dung lượng không vượt quá 1MB!');
      imagePreviewUrl.value = '';
    } else {
      file.value = fileUpload;
      emit('uploadFile', fileUpload);
      const params = ref<ParamsUploadImage>({
        file: fileUpload,
        type: 1,
      });
      console.log('post ', fileUpload);
      try {
        const res = await api.post(
          '/cms/portal/v1/upload/image_upload',
          { ...params.value },
          { headers: { 'content-type': 'multipart/form-data', AppId: process.env.VUE_APP_BASE_APP_ID } },
        );
        imagePreviewUrl.value = res.data.data.url_path;
      } catch (err: any) {
        toast.error('Ảnh tải lên có dung lượng không vượt quá 1MB!');
        imagePreviewUrl.value = '';
        console.error(err.status());
      }
    }
  }
};
watch(() => props.imageUrl, (first, second) => {
  imagePreviewUrl.value = props.imageUrl;
});
const clickInputFile = function () {
  inputFile.value.click();
};
// expose ref
defineExpose({
  imagePreviewUrl,
});
onMounted(async () => {
  if (props.imageUrl) {
    imagePreviewUrl.value = props.imageUrl;
  }
});

</script>
<template>
  <div class="w-[100%] "
       :class="(fileSizeErr || fileTypeErr || fileErr) ? 'file-upload-container-err' : 'file-upload-container'">
    <div class="file-upload-button-container">
      <div
        v-if="!disabled"
        @keydown="clickInputFile" @click="clickInputFile" class="button-input" :id="id+'-component'">
        <input ref="inputFile" class="cursor-pointer input-file" type="file" @change="uploadImage" :id="id+'-field'"/>
        <i class="pi pi-upload"></i>
        <p>Chọn ảnh</p>
      </div>
    </div>
    <div>
      <div class="file-upload-content flex justify-center">
        <img class="p-5" :class="`w-[${imgSize}]`" v-if="imagePreviewUrl " :src="imagePreviewUrl" alt="Red dot"/>
        <i v-if="!imagePreviewUrl" class="pi pi-cloud-upload p-5 text-6xl text-400 border-400 text-[#BDBDBD]"></i>
      </div>
    </div>
  </div>
  <small v-if="fileSizeErr" class="p-error" :id="id+'-text-error'">{{ fileSizeErr || '&nbsp;' }}</small>
  <small v-else-if="fileTypeErr" class="p-error" :id="id+'-text-error'">{{ fileTypeErr || '&nbsp;' }}</small>
  <small v-else-if="fileErr" class="p-error" :id="id+'-text-error'">{{ fileErr || '&nbsp;' }}</small>
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

.file-upload-button-container {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #e3e2ea;
  background-color: #f7f7f7;
  padding: 15px;
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
