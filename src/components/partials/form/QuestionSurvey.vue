<script setup lang="ts">
import {
  ref, onMounted, nextTick,
} from 'vue';
import * as yup from 'yup';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import { useToast } from 'vue-toastification';
import { cloneDeep } from 'lodash';
import { useApi } from '@/store/useApi';

export interface ParamsUploadImage {
  file: File;
  type: number;
}
const props = withDefaults(
  defineProps<{
    surveyFormType: string;
    disabled?: boolean;
    id?: string;

  }>(),
  {
    disabled: false,
  },
);
const typeQuestionSurvey = ref([
  { name: 'Trắc nghiệm', code: 1, icon: 'pi pi-check-circle' },
  { name: 'Nhiều lựa chọn', code: 2, icon: 'pi pi-clone' },
  { name: 'Trả lời', code: 3, icon: 'pi pi-align-left' },
]);
const typeQuestionShortSurvey = ref([
  { name: 'Trắc nghiệm', code: 1, icon: 'pi pi-check-circle' },
  { name: 'Nhiều lựa chọn', code: 2, icon: 'pi pi-clone' },
]);
const inputImageFile = ref();
const indexOfSurvey = ref();
const iShowLoadingImage = ref(false);
const clickInputFile = function (index: number) {
  inputImageFile.value.click();
  indexOfSurvey.value = index;
};
const api = useApi();
const toast = useToast();
const isActiveSurvey = ref([]) as any;
const answerRef = ref();
const questionRef = ref();
const surveySchema = yup.array().of(
  yup.object().shape({
    title: yup.string().required('Câu hỏi không được để trống').trim(),
  }),
);
const listSurvey = ref([
  {
    title: '',
    type: {
      name: 'Trắc nghiệm',
      code: 1,
      icon: 'pi pi-check-circle',
    },
    options: ['Tùy chọn 1'],
    required: false,
    image: '',
  },
]);
const uploadImage = async (event: any, index: any) => {
  const fileUpload = event.target.files[0];
  if (!(fileUpload.type === 'image/png' || fileUpload.type === 'image/jpeg')) {
    toast.error('Ảnh tải lên phải có định dạng jpg, png', {
      timeout: 5000,
    });
  } else if (fileUpload.size > 10485760) {
    toast.error('Ảnh tải lên có dung lượng không vượt quá 10MB', {
      timeout: 5000,
    });
  } else {
    iShowLoadingImage.value = true;
    const params = ref<ParamsUploadImage>({
      file: fileUpload,
      type: 1,
    });
    try {
      const res = await api.post(
        '/cms/portal/v1/upload/image_upload',
        { ...params.value },
        { headers: { 'content-type': 'multipart/form-data', AppId: process.env.VUE_APP_BASE_APP_ID } },
      );
      iShowLoadingImage.value = false;
      listSurvey.value[index].image = res.data.data.url_path;
    } catch (err: any) {
      listSurvey.value[index].image = '';
      iShowLoadingImage.value = false;
    }
  }
  // eslint-disable-next-line no-param-reassign
  event.target.value = '';
};
const removeImage = (index: number) => {
  listSurvey.value[index].image = '';
};
const errorSurvey = ref([]) as any;
const validateSurvey = async (index: number) => {
  try {
    await surveySchema.validateAt(`[${index}].title`, listSurvey.value);
    errorSurvey.value[index] = '';
  } catch (err: any) {
    // eslint-disable-next-line prefer-destructuring
    errorSurvey.value[index] = err.errors[0];
  }
};
const checkValidate = () => {
  listSurvey.value.map((item, index) => validateSurvey(index));
};
const setActive = (index: number) => {
  isActiveSurvey.value = [];
  isActiveSurvey.value[index] = true;
  // if (!isActiveSurvey.value[index]) {
  //   isActiveSurvey.value[index] = false;
  //   nextTick(() => {
  //     questionRef.value[index].$el.focus();
  //   });
  // }
};
const addSurvey = (index: number) => {
  listSurvey.value.splice(index + 1, 0, {
    title: '',
    type: {
      name: 'Trắc nghiệm',
      code: 1,
      icon: 'pi pi-check-circle',
    },
    options: ['Tùy chọn 1'],
    required: false,
    image: '',
  });
  errorSurvey.value.splice(index + 1, 0, '');
  setActive(index + 1);
};
const copySurvey = (index: number) => {
  const surveyToCopy = cloneDeep(listSurvey.value[index]);
  listSurvey.value.splice(index + 1, 0, surveyToCopy);
  errorSurvey.value.splice(index + 1, 0, '');
  setActive(index + 1);
};
const deleteSurvey = (index: number) => {
  if (listSurvey.value.length > 1) {
    listSurvey.value.splice(index, 1);
    errorSurvey.value.splice(index, 1);
    setActive(index - 1);
  }
};
const checkEmptyAnswer = (index: number, indexAnswer: number) => {
  listSurvey.value[index].options.forEach((item: any, index1: number) => {
    if (item.trim() === '') {
      listSurvey.value[index].options[index1] = `Tùy chọn ${index1 + 1}`;
    }
  });
  const newArr = [...listSurvey.value[index].options];
  newArr.splice(indexAnswer, 1);
  const uniqueArr = [...new Set(newArr)];
  const exists = uniqueArr.some((item) => item === listSurvey.value[index].options[indexAnswer]);
  if (exists) {
    listSurvey.value[index].options[indexAnswer] = `Tùy chọn ${indexAnswer + 1}`;
  }
};
const changeTypeQuestion = (type: any, index: number) => {
  if (type.code === 3) {
    listSurvey.value[index].options = [];
    listSurvey.value[index].options[0] = 'Câu trả lời';
  } else if (listSurvey.value[index].options[0] === 'Câu trả lời' && (type.code === 1 || type.code === 2)) {
    listSurvey.value[index].options[0] = 'Tùy chọn 1';
  }
};
const addAnswer = (index: number) => {
  const nextIndex = listSurvey.value[index].options.length + 1;
  listSurvey.value[index].options.push(`Tùy chọn ${nextIndex}`);
};
const removeAnswer = (index: number, indexAnswer: number) => {
  if (listSurvey.value[index].options.length > 1) {
    listSurvey.value[index].options.splice(indexAnswer, 1);
  }
};
onMounted(() => {
  setActive(0);
  // nextTick(() => {
  //   questionRef.value[0].$el.focus();
  // });
});
// watch(
//   () => listSurvey,
//   (value) => {
//     console.log(value);
//   },
//   {
//     deep: true,
//   },
// );
const onKeyDown = () => {
  console.log();
};
defineExpose({
  listSurvey,
  checkValidate,
  errorSurvey,
});
</script>
<template>
  <div
    v-for="(item, index) in listSurvey"
    :key="index"
    class="flex justify-between"
    :class="disabled ? 'disable' : ''"
  >
    <el-tooltip
      content="Thêm câu hỏi"
      placement="top"
      v-if="isActiveSurvey[index] && surveyFormType === 'survey'"
    >
      <i
        :id="id + '-add-survey-button-' + index"
        class="pi pi-plus-circle cursor-pointer h-2"
        @click="addSurvey(index)"
        @keydown="onKeyDown"
      ></i>
    </el-tooltip>
    <div v-if="!isActiveSurvey[index] && surveyFormType === 'survey'"></div>
    <div
      :class="{
        'border-l-2 !border-[#000] border-solid': isActiveSurvey[index],
      }"
      :style="
        surveyFormType === 'survey' ? { width: '98%' } : { width: '100%' }
      "
      class="item-container mb-3"
      @click="setActive(index)"
      @keydown="onKeyDown"
    >
      <div class="flex w-full items-center justify-between">
        <div class="w-[60%]">
          <InputText
           :id="id + '-question-field-' + index"
            ref="questionRef"
            placeholder="Câu hỏi"
            :maxlength="surveyFormType === 'shortSurvey' ? 120 : ''"
            v-model="item.title"
            :class="{
              'p-invalid': errorSurvey[index],
            }"
            @input="validateSurvey(index)"
            type="text"
          />
        </div>
        <div
          v-if="surveyFormType === 'survey'"
          :id="id + '-upload-image' + index"
          @click="clickInputFile(index)"
          @keydown="clickInputFile(index)"
        >
          <i
            class="pi pi-image cursor-pointer"
            v-if="isActiveSurvey[index]"
          ></i>
        </div>
        <div class="w-[35%]" v-if="isActiveSurvey[index]">
          <Dropdown
          :id="id + '-question-type-field-' + index"
            v-model="item.type"
            :options="surveyFormType === 'survey' ? typeQuestionSurvey : typeQuestionShortSurvey"
            optionLabel="name"
            @change="changeTypeQuestion(item.type, index)"
            placeholder="Chọn loại câu hỏi"
            class="w-full md:w-14rem"
          >
            <template #option="slotProps">
              <div class="flex items-center flex-row gap-x-4">
                <i class="cursor-pointer" :class="slotProps.option?.icon"></i
                >{{ slotProps.option.name }}
              </div>
            </template>
            <template #value="slotProps">
              <div class="flex items-center" v-if="slotProps.value?.name">
                <i
                  class="cursor-pointer mr-3"
                  :class="slotProps.value?.icon"
                ></i>
                <div>{{ slotProps.value?.name }}</div>
              </div>
              <div v-else>{{ slotProps.placeholder }}</div>
            </template>
          </Dropdown>
        </div>
      </div>
      <small v-if="errorSurvey[index]" class="p-error" :id="id + 'question-text-error' + index">{{
        errorSurvey[index] || '&nbsp;'
      }}</small>
      <div class="flex justify-center">
        <img
        :id="id + 'question-loading-image-' + index"
          v-if="iShowLoadingImage"
          class="pt-4 image-loading"
          src="@/assets/images/loading-gif-png-5.gif"
          alt="Red dot"
        />
      </div>
      <div v-if="item.image" class="file-upload-content flex justify-center">
        <div class="image-container">
          <div
            @click="removeImage(index)"
            @keydown="removeImage(index)"
            class="image-close-button"
            :id="id + 'delete-image-button-' + index"

          >
            <i class="text-[11px] pi pi-times"></i>
          </div>
          <img
          :id="id + 'question-image' + index"
           class="pt-4" :src="item.image" alt="Red dot" />
        </div>
      </div>
      <div>
        <div
          class="flex items-center my-3 input_answer"
          v-for="(answer, indexAnswer) in item.options"
          :key="indexAnswer"
        >
          <RadioButton v-if="item.type.code !== 3" class="cursor-default" />
          <InputText
            :id="id + 'question-' + index + '-answer-field-' + indexAnswer"
            :maxlength="surveyFormType === 'shortSurvey' ? 30 : ''"
            :disabled="item.type.code === 3"
            ref="answerRef"
            class="ml-2"
            v-model="item.options[indexAnswer]"
            @blur="checkEmptyAnswer(index, indexAnswer)"
          ></InputText>
          <div v-if="isActiveSurvey[index]">
            <i
              v-if="
                item.type.code !== 3 && item.options.length !== 1 && !disabled
              "
              class="pi pi-times cursor-pointer"
            :id="id + 'question-' + index + '-delete-answer-' + indexAnswer"
              @click="removeAnswer(index, indexAnswer)"
              @keydown="onKeyDown"
            ></i>
          </div>
        </div>
        <div
          @click="addAnswer(index)"
          @keydown="onKeyDown"
          :id="id + 'add-answer-' + index"
          v-if="isActiveSurvey[index]"
        >
        <i
        class="pi pi-plus-circle cursor-pointer h-2"
        v-if="
              ((item.type.code !== 3 && surveyFormType === 'survey') ||
                (item.options.length <= 3 &&
                  surveyFormType === 'shortSurvey')) &&
              !disabled
            "
      ></i>
          <label
            v-if="
              ((item.type.code !== 3 && surveyFormType === 'survey') ||
                (item.options.length <= 3 &&
                  surveyFormType === 'shortSurvey')) &&
              !disabled
            "
            class="ml-2 text-sm pl-2 cursor-pointer"
            >Thêm tùy chọn</label
          >
        </div>
      </div>
      <div
        v-if="isActiveSurvey[index] && surveyFormType === 'survey'"
        class="flex items-center justify-end border-t border-[#ccc] border-solid pt-3 mt-8"
      >
        <div class="flex">
          <i
          :id="id + 'copy-survey-' + index"
            class="pi pi-copy text-base cursor-pointer mr-8"
            @click.stop="copySurvey(index)"
            @keydown="onKeyDown"
          ></i>
          <i
            v-if="listSurvey.length !== 1"
            :id="id + 'delete-survey-' + index"
            class="pi pi-trash cursor-pointer text-base mr-8"
            @click.stop="deleteSurvey(index)"
            @keydown="onKeyDown"
          ></i>
        </div>
        <div
          class="flex w-[30%] items-center border-l border-[#ccc] border-solid"
        >
          <p
          :id="id + 'require-survey-' + index + '-label'"
           class="mr-3 ml-6">Bắt buộc</p>
          <InputSwitch
          :id="id + 'require-survey-' + index + '-field'"
           v-model="item.required" />
        </div>
      </div>
    </div>
  </div>
  <input
  :id="id + 'input-upload-image'"
    ref="inputImageFile"
    class="cursor-pointer input-file"
    type="file"
    @change="(event) => uploadImage(event, indexOfSurvey)"
  />
</template>
<style lang="scss" scoped>
.item-container {
  background-color: #f7f7f7;
  border-radius: 10px;
  border: 1px solid #e3e2ea;
  padding: 15px;
}
.input_answer {
  ::v-deep .p-inputtext {
    border: none;
    background-color: #f7f7f7;
    border-radius: 0 !important;
    transition: none;
    height: 42px;
    border-bottom: 1px solid #ced4da !important;
    &:focus {
      border-bottom: 1px solid var(--main-color) !important;
    }
  }
}
.input-file {
  display: none;
}
.file-upload-content {
  width: 100%;
  min-height: 100px;
}
.image-container {
  margin-top: 10px;
  position: relative;
  min-height: 100px;
  max-width: 30%;
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
  top: 5px;
  left: -10px;
}
.image-loading {
  width: 10%;
  height: auto;
}
.disable {
  pointer-events: none;
}
</style>
