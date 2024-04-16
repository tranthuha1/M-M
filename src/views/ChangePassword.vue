<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import Button from 'primevue/button';
import * as yup from 'yup';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
import { useUserSession } from '@/store/userSession';
import { useApi } from '@/store/useApi';

const api = useApi();
const overlayLoading = useOverLayLoadingStore();
const emit = defineEmits(['closeForm']);
let errMessage: string;
const toast = useToast();
const router = useRouter();
const userSession = useUserSession();
let isOldPasswordTrue = false;
const validationSchema = yup.object({
  oldPassword: yup
    .string()
    .required('Mật khẩu cũ không được để trống')
    .test(
      'is-all-space',
      'Mật khẩu cũ không được để trống',
      (value) => !/^\s*$/.test(value || ''),
    )
    .min(8, 'Mật khẩu ít nhất 8 ký tự')
    .matches(/^\S*$/, 'Mật khẩu không chứa ký tự khoảng trống')
    .test('password-incorrect', 'Mật khẩu sai', function (value) {
      const isPasswordIncorrect = isOldPasswordTrue;
      return !isPasswordIncorrect || this.createError({ message: errMessage });
    }),
  password: yup
    .string()
    .required('Mật khẩu mới không được để trống')
    .test(
      'is-all-space',
      'Mật khẩu cũ không được để trống',
      (value) => !/^\s*$/.test(value || ''),
    )
    .min(8, 'Mật khẩu ít nhất 8 ký tự')
    .matches(/^\S*$/, 'Mật khẩu không chứa ký tự khoảng trống')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]+$/,
      'Mật khẩu chưa đủ mạnh',
    )
    .notOneOf(
      [yup.ref('oldPassword')],
      'Mật khẩu mới không được trùng mật khẩu cũ',
    ),
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu không được để trống')
    .oneOf(
      [yup.ref('password')],
      'Mật khẩu mới và xác nhận mật khẩu mới phải trùng nhau',
    ),
});
const handleLogout = async () => {
  try {
    // await api.post<any>('/admin/auth/logout');
    userSession.logoutUser();
    router.push({
      name: 'login',
    });
  } catch (err) {
    console.error(err);
  }
};
const { handleSubmit } = useForm({
  validationSchema,
});
const checkValidate = handleSubmit((values) => {
  console.log(values);
});
const { value: oldPassword, errorMessage: oldPasswordErr } = useField<string>('oldPassword');
const { value: password, errorMessage: passwordErr } = useField<string>('password');
const { value: confirmPassword, errorMessage: confirmPasswordErr } = useField<string>('confirmPassword');
const handleInput = function () {
  isOldPasswordTrue = false;
  if (oldPassword.value?.length > 20) {
    oldPassword.value = oldPassword.value.slice(0, 20);
  }
  if (password.value?.length > 20) {
    password.value = password.value.slice(0, 20);
  }
  if (confirmPassword.value?.length > 20) {
    confirmPassword.value = confirmPassword.value.slice(0, 20);
  }
};
const onSubmit = handleSubmit(async (values) => {
  overlayLoading.toggleLoading(true);
  await api
    .put('/cms/portal/v1/auth/change_password', values)
    .then((response) => {
      if (response.data.code === 0) {
        overlayLoading.toggleLoading(false);
        toast.success(response.data.message, {
          timeout: 3000,
        });
        handleLogout();
        emit('closeForm');
      } else if (response.data.code === 400007) {
        isOldPasswordTrue = true;
        errMessage = response.data.message;
        checkValidate();
        overlayLoading.toggleLoading(false);
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
});
</script>

<template>
  <form @submit="onSubmit" id="tcctxh-change-password-form">
    <div class="flex flex-col" id="changePassword-old-password-group">
      <div id="changePassword-old-password-label">Mật khẩu cũ</div>
      <Password
        inputId="changePassword-old-password-field"
        @input="handleInput"
        class="pt-2"
        v-model="oldPassword"
        toggleMask
        :feedback="false"
        :class="{ 'p-invalid': oldPasswordErr }"
        placeholder="Nhập mật khẩu hiện tại"
      />
      <small class="p-error pt-1 pl-2" id="changePassword-old-password-error">{{
        oldPasswordErr || '&nbsp;'
      }}</small>
    </div>
    <div class="flex flex-col" id="changePassword-password-group">
      <div id="changePassword-password-label">Mật khẩu mới</div>
      <Password
        inputId="changePassword-password-field"
        @input="handleInput"
        class="pt-2"
        v-model="password"
        :class="{ 'p-invalid': passwordErr }"
        toggleMask
        :feedback="false"
        placeholder="Nhập mật khẩu mới "
      />
      <small class="p-error pt-1 pl-2" id="changePassword-password-error">{{
        passwordErr || '&nbsp;'
      }}</small>
    </div>

    <div class="flex flex-col" id="changePassword-confirmPassword-group">
      <div id="changePassword-confirmPassword-label">Xác nhận mật khẩu</div>
      <Password
        inputId="changePassword-confirmPassword-field"
        @input="handleInput"
        class="pt-2"
        v-model="confirmPassword"
        :class="{
          'p-invalid': confirmPasswordErr,
        }"
        toggleMask
        :feedback="false"
        placeholder="Nhập lại mật khẩu "
      />
      <small
        class="p-error pt-1 pl-2"
        id="changePassword-confirmPassword-error"
        >{{ confirmPasswordErr || '&nbsp;' }}</small
      >
    </div>

    <div
      class="flex justify-end mt-5 flex-row gap-x-3 absolute bottom-5 right-10"
    >
      <Button
        @click="() => emit('closeForm')"
        class="button-gray"
        label="Đóng"
        id="change-password-close-form-button"
        icon="pi pi-times"
      />
      <Button
        type="submit"
        id="change-password-save-form-button"
        class="button-green"
        label="Lưu "
        icon="pi pi-check"
      />
    </div>
  </form>
</template>
<style scoped>
.popup {
  width: 428px;
  background-color: #fff;
  padding: 20px 45px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
