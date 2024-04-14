<script setup lang="ts">
import { ref } from 'vue';
import { useSideBar } from '@/store/sidebar';
import { OnClickOutside } from '@vueuse/components';
import { checkPermission } from '@/utils';
import Dialog from 'primevue/dialog';
import { useUserSession, UserData } from '@/store/userSession';
import PopupLogOut from '@/components/partials/popup/PopupLogOut.vue';
import ChangePassword from '../views/ChangePassword.vue';

const sideBar = useSideBar();
const user = useUserSession().user as UserData;
const isInfoOpen = ref<boolean>(false);
const logout = ref();
const visibleModal = ref(false);
function toggleInfo(toggle: boolean) {
  isInfoOpen.value = !toggle;
}

function openChangePass() {
  isInfoOpen.value = false;
  visibleModal.value = true;
}

const confirmLogout = () => {
  isInfoOpen.value = false;
  logout.value.confirm();
};
</script>

<template>
  <div class="container">
    <header class="topbar">
      <nav class="v-navbar top-v-navbar v-navbar-toggleable-sm v-navbar-light">
        <div
          class="v-navbar-header"
          :style="{
            width: sideBar.isShowSideBar ? '240px' : '60px',
          }"
        >
          <router-link to="/" class="v-navbar-brand">
            <img
              v-if="true"
              src="@/assets/images/logo-icon_2.png"
              alt="homepage"
              class="w-[46px] h-[46px] ml-[7px] mt-[20px]"
            />
            <span v-if="sideBar.isShowSideBar">
              <img
                src="@/assets/images/logo_fina_convertedl.png"
                alt="homepage"
                class="h-[35px] ml-3 pr-8 mt-[20px]"
              />
            </span>
          </router-link>
        </div>
        <div class="v-navbar-collapse ml-3 mr-7">
          <div class="flex items-center flex-row gap-x-4">
            <i
              class="text-[20px] cursor-pointer"
              :class="
                sideBar.isShowSideBar ? 'pi pi-arrow-circle-left' : 'pi pi-bars'
              "
              @click="sideBar.toggleSideBar"
            ></i>
          </div>
          <OnClickOutside @trigger="isInfoOpen = false">
          <div class="flex items-center cursor-pointer">
            <div
              id="tcctxh-navbar-avatar-icon"
              class="w-8 h-8 rounded-full border-solid border-2 cursor-pointer border-[#42b983] flex items-center justify-center"
              @keydown="toggleInfo(isInfoOpen)"
              @click="toggleInfo(isInfoOpen)"
            >
              <i class="pi pi-user"></i>
            </div>
            <div
              @keydown="toggleInfo(isInfoOpen)"
              @click="toggleInfo(isInfoOpen)"
              class="flex items-center"
              id="tcctxh-navbar-full-name"
            >
              <span class="px-2 font-medium">{{ user.sub }}</span>
              <i class="pi pi-angle-down"></i>
            </div>
            <div v-if="isInfoOpen" class="info-container">
              <div
                @click="openChangePass()"
                @keydown="openChangePass()"
                class="info-item"
                id="tcctxh-navbar-change-pass-link"
                v-if="checkPermission('phan_quyen_he_thong')"
              >
                <i class="pi pi-lock"></i>
                <span>Đổi mật khẩu</span>
              </div>
              <div
                @click="confirmLogout()"
                @keydown="confirmLogout()"
                class="info-item"
                id="tcctxh-navbar-logout-link"
              >
                <i class="pi pi-sign-out"></i>
                <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        </OnClickOutside>
        </div>
      </nav>
      <PopupLogOut ref="logout" id="tcctxh-navbar-popup-logout"/>
    </header>
  </div>
  <Dialog
  id="post-dialog"
    v-model:visible="visibleModal"
    closable
    :draggable="false"
    modal
    header="ĐỔI MẬT KHẨU"
    :style="{
      width: '30vw',
      height: '60vh',
      backgroundColor: '#fff',
      maxHeight: '100%',
    }"
    :pt="{
      content: { class: 'mb-[5rem]' },
      root: { class: 'bg-[#fff]' },
    }"
  >
<ChangePassword @closeForm="visibleModal = false">
</ChangePassword>
  </Dialog>
</template>

<style lang="scss" scoped>
.info-container {
  position: absolute;
  top: 52px;
  right: 18px;
  z-index: 10;
  background-color: #fff;
  border-radius: 8px;
  width: 200px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);

  .info-item {
    display: flex;
    align-items: center;
    flex-direction: row;
    column-gap: 16px;
    font-size: 14px;
    padding: 12px 16px;

    i {
      color: var(--main-color);
    }

    &:hover {
      background-color: var(--main-color);
      border-radius: 8px;
      color: #fff;

      i {
        color: #fff;
      }
    }
  }
}

.container {
  position: relative;
  z-index: 1;
  max-width: unset;

  .topbar {
    background: var(--body-color);
    padding-right: 16px;

    .v-navbar {
      padding-left: 0;
      display: flex;

      .v-navbar-header {
        height: 59px;
        width: 240px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        background-color: #fff;
        justify-content: start;
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: row;
          column-gap: 6px;
        }
      }
    }

    .v-navbar-collapse {
      display: flex;
      align-items: center;
      padding-left: 16px;
      justify-content: space-between;
      width: 100%;
    }

    a {
      cursor: pointer;
    }
  }
}
#tcctxh-navbar-avatar-icon {
    border-color: var(--main-color);
}
</style>
