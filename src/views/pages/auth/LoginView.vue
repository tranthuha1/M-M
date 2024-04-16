<script lang="ts" setup>
import Button from 'primevue/button';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import jwt_decode from 'jwt-decode';
import { useUserSession } from '@/store/userSession';
import { LoginResponse } from '@/models/user/userDetail';
import { useOverLayLoadingStore } from '@/store/overlayLoading';
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/store/useApi';

const toast = useToast();
const router = useRouter();
const overlayLoading = useOverLayLoadingStore();
const userSession = useUserSession();
const api = useApi();

const isShowPass = ref(false);
const isLoading = overlayLoading.isShowLoading;

const schema = yup.object({
  account: yup.string().required('Tên tài khoản không được để trống.').trim(),
  password: yup.string().required('Mật khẩu không được để trống.').trim(),
});
const onSubmit = async (values: any) => {
  if (!isLoading) {
    overlayLoading.toggleLoading(true);
    const data = {
      username: values.account,
      password: values.password,
    };
    try {
      const { data: loginResponse } = await api.post<LoginResponse>(
        '/cms/portal/v1/auth/login',
        data,
      );
      overlayLoading.toggleLoading(false);
      if (loginResponse.code === 0) {
        const decode = jwt_decode(loginResponse.data.token) as any;
        userSession.setToken(loginResponse.data.token);
        userSession.setUser(decode);
        userSession.setPermission(loginResponse.data.permissions);
        await router.replace({
          name: 'home',
        });
      } else {
        toast.error(loginResponse.message);
      }
    } catch (error: any) {
      overlayLoading.toggleLoading(false);
      if (error.response?.status === 401) {
        toast.error(
          'Tên đăng nhập hoặc mật khẩu chưa đúng. Vui lòng thử lại.',
          {
            timeout: 3000,
          },
        );
      } else {
        toast.error(
          'Không thể kết nối tới máy chủ do hệ thống đang bận. Vui lòng thử lại!',
          {
            timeout: 3000,
          },
        );
      }
    }
  }
};
const handleKeyDown = () => {
  console.log('show pass');
};
</script>
<template>
  <div id="wrapper">
    <Toast />
    <div class="login-register">
      <div class="card-block">
        <Form @submit="onSubmit" :validation-schema="schema" id="form-login">
          <div class="mb-10 flex justify-center">
            <img src="@/assets/images/logo_login.png" alt="" class="w-[70%]" />
          </div>
          <div class="mb-4 text-left">
            <div class="form-group field-login pr-4">
              <i class="pi pi-user"></i>
              <Field
                id="tcctxh-login-field-name"
                name="account"
                class="form-input"
                placeholder="Tên tài khoản"
              />
            </div>
            <ErrorMessage
              class="text-[12px] text-red-600 pl-4 mt-4"
              name="account"
            />
          </div>
          <div class="mb-4 text-left">
            <div class="form-group field-login">
              <i class="pi pi-lock"></i>
              <Field
                id="tcctxh-login-field-password"
                name="password"
                :type="isShowPass ? 'text' : 'password'"
                class="form-input"
                placeholder="Mật khẩu"
                maxlength="20"
              />
              <i
                id="tcctxh-icon-show-password"
                :class="isShowPass ? 'pi pi-eye' : ' pi pi-eye-slash'"
                class="cursor-pointer"
                @click="() => (isShowPass = !isShowPass)"
                @keydown="handleKeyDown"
              ></i>
            </div>
            <ErrorMessage
              class="text-[12px] text-red-600 pl-4 mt-4"
              name="password"
            />
          </div>
          <div class="mt-[35px]">
            <Button
              id="tcctxh-login-button-login"
              type="submit"
              label="ĐĂNG NHẬP"
              severity="success"
              rounded
              raised
              class="w-full h-[40px] font-normal"
            />
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped>
#wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(../../../assets/images/bg_login.jpg) no-repeat;
  background-size: cover;
}

.login-register {
  background-color: #fff;
  border-radius: 32px;
  margin-bottom: 48px;
}

.card-block {
  padding: 32px;
}

#form-login {
  max-width: 400px;
  flex-grow: 1;
  padding: 30px 30px 40px 30px;
  background-color: #fff;
}

.form-group {
  border-bottom: 1px solid #fff;
  margin-top: 15px;
  display: flex;
  background: #ececf4;
  border-radius: 60px;
  align-items: center;
  margin-bottom: 8px;
}

.form-group i {
  color: #000;
  font-size: 14px;
  padding: 0 16px;
}

.form-input {
  background: transparent;
  border: 0;
  outline: 0;
  color: #96a0aa;
  font-size: 14px;
  flex-grow: 1;
  height: 38px;
}

.form-input::placeholder {
  color: #96a0aa;
}

#eye i {
  padding-right: 0;
  cursor: pointer;
}

.form-submit {
  background: transparent;
  border: 1px solid #f5f5f5;
  color: #fff;
  width: 100%;
  text-transform: uppercase;
  padding: 6px 10px;
  transition: 0.25s ease-in-out;
  margin-top: 30px;
}

.form-submit:hover {
  border: 1px solid #54a0ff;
}
</style>
