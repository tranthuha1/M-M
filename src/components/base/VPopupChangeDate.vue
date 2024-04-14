<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as yup from 'yup';
import moment from 'moment';
import { useToast } from 'vue-toastification';
import { useApi } from '@/store/useApi';
import Button from 'primevue/button';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import CalendarPrime from '@/components/base/CalendarPrime.vue';
import { useForm } from 'vee-validate';

const overlayLoading = useOverLayLoadingStore();
const toast = useToast();
const api = useApi();
const props = defineProps<{
 date: any;
 postId: number;
}>();
const validationSchema = yup.object({
  newDate: yup.mixed().required('Ngày công bố không được để trống').test(
    'time',
    'Vui lòng chọn ngày công bố không lớn hơn ngày công bố tin tức hiện tại',
    (value) => {
      const currentTime = new Date(props.date * 1000);
      return value <= currentTime;
    },
  ),
});
const {
  handleSubmit, values, setFieldValue,
} = useForm({
  validationSchema,
});
const emit = defineEmits(['closeForm', 'getList']);
const maxDate = ref(new Date(props.date * 1000));
const onSubmit = handleSubmit(async () => {
  overlayLoading.toggleLoading(true);
  await api
    .post('/cms/portal/v1/post/update_public_date', { post_id: props.postId, public_date: moment(values.newDate).unix() })
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
      toast.error(
        'Không thể kết nối tới máy chủ do hệ thống đang bận. Vui lòng thử lại!',
        {
          timeout: 3000,
        },
      );
    });
});
onMounted(() => {
  setFieldValue('newDate', new Date(props.date * 1000));
});
</script>
<template>

          <div class="fix-scroll">
      <div class="flex items-center">
        <p>Ngày công bố</p>
        <span class="ml-1" style="color: red"
          >*</span
        >
      </div>
      <CalendarPrime
            class="mt-1"
            :maxDate="maxDate"
            :showTime="true"
            name="newDate"
            showIcon
            placeholder="dd/mm/yyyy hh:mm"
            dateFormat="dd/mm/yy"
          />
          <div
    class="flex justify-end mt-5 flex-row gap-x-3 absolute bottom-5 right-10"
  >
    <Button
      @click="() => emit('closeForm')"
      class="button-gray"
      label="Đóng"
      icon="pi pi-times"
    />
    <Button
     @click="onSubmit()"
      class="button-green"
      label="Lưu"
      icon="pi pi-check"
    />
  </div>
  </div>
</template>
<style scoped lang="scss">

</style>
