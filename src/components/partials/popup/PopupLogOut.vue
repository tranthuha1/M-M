<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'vue-toastification';
import { useApi } from '@/store/useApi';
import { useUserSession } from '@/store/userSession';
import { LogoutResponse } from '@/models/user/userDetail';

const router = useRouter();
const userSession = useUserSession();
const toast = useToast();
const confirmPrime = useConfirm();

const api = useApi();

const handleLogout = async () => {
  try {
    await api.post<LogoutResponse>('/cms/portal/v1/auth/logout');
  } catch (err) {
    console.error(err);
  }
  userSession.logoutUser();
  router.push({
    name: 'login',
  });
};
const confirm = () => {
  confirmPrime.require({
    message: 'Bạn có muốn đăng xuất khỏi ứng dụng?',
    header: 'Xác nhận',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      handleLogout();
    },
    acceptClass: 'tcctxh-accept-logout p-button-success p-button-xs',
    acceptLabel: 'Đồng ý',
    rejectLabel: 'Quay lại',
    rejectClass: 'tcctxh-reject-logout p-button-secondary p-button-xs',
    reject: () => {
      console.log('close');
    },
  });
};
defineExpose({
  confirm,
});
</script>
<template>
  <ConfirmDialog :draggable="false"></ConfirmDialog>
</template>

<style scoped>
:v-deep .p-button .p-button-success {
  color: #fff;
  background: red !important;
  border: 1px solid #25bb94;
}
</style>
