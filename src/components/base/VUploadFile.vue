<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<script setup lang="ts">
import { ref } from 'vue';
import { useField } from 'vee-validate';

const emit = defineEmits(['uploadFile']);
const props = defineProps<{
  fileSize: string;
  fileType: string;
  file: string;
  disabled?: boolean;
  id?: string;
}>();
const { value: fileSize, errorMessage: fileSizeErr } = useField<string>(props.fileSize);
const { value: fileType, errorMessage: fileTypeErr } = useField<string>(props.fileType);
const { value: file, errorMessage: fileErr } = useField<File>(props.file);
const inputFile = ref();
const fileUrl = ref();
const fileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/jpeg',
  'audio/mpeg',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/x-rar-compressed',
  'video/mp4',
];

const clickInputFile = function () {
  inputFile.value.click();
};
const uploadFile = (event: any) => {
  const fileUpload = event.target.files[0];
  fileSize.value = fileUpload.size;
  fileType.value = '';
  if (
    fileTypes.includes(fileUpload.type)
  ) {
    fileType.value = 'file';
  }
  if (!fileTypes.includes(fileUpload.type) || fileUpload.size > 10485760) {
    file.value = fileUpload;
  } else {
    file.value = fileUpload;
    emit('uploadFile', fileUpload);
  }
};
const customFileName = (name: string) => {
  let str = '';
  if (name?.length > 30) {
    str += name.substr(0, 15);
    str += '...';
    str += name.substr(
      name.length - 8,
      name.length,
    );
    return str;
  }
  return name;
};
const convertUrlName = (url: string) => {
  if (url) {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    return customFileName(fileName);
  }
  return '';
};
// expose ref
defineExpose({
  fileUrl,
});
</script>
<template>
  <div class="w-[100%]"
       :class="(fileSizeErr || fileTypeErr || fileErr) ? 'file-upload-container-err' : 'file-upload-container'">
    <div class="file-upload-button-container">
      <div @keydown="clickInputFile" @click="clickInputFile" class="button-input" v-if="!disabled"
           :id="id+'-component'">
        <input ref="inputFile" class="cursor-pointer input-file" type="file" @change="uploadFile" :id="id+'-field'"/>
        <i class="pi pi-upload"></i>
        <p>Chọn tệp</p>
      </div>
    </div>
    <div class="file-upload-content flex justify-center h-[40px] !min-h-0">
      <div class="flex items-center text-[#000]" v-if="file?.name"><i class="pi pi-file pr-2"></i>{{
          customFileName(file?.name)
        }} ({{ (file?.size / (1024 * 1024)).toFixed(5) }} Mb)
      </div>
      <div v-else class="flex items-center text-[#000]">
        <a :href="fileUrl" target="_blank"><i class="pi pi-file pr-2"></i>{{ convertUrlName(fileUrl) }}</a>
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
  padding: 5px 10px;
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
