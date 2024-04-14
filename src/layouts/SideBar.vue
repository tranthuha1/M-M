<template>
  <div
    class="sidenav"
    :style="{
      width: sideBar.isShowSideBar ? '240px' : '60px',
    }"
  >
    <div class="scroll-sidebar" style="width: auto; height: 100%">
      <div class="overflow-auto h-full">
        <ul>
          <template v-for="(item, i) in model" :key="item + i">
            <SideBarItem
              :item="item"
            ></SideBarItem>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useSideBar } from '@/store/sidebar';
import SideBarItem from '@/components/pages/layouts/SideBarItem.vue';

const sideBar = useSideBar();

const model = ref([
  {
    items: [
      {
        label: 'Quản lý tin bài',
        icon: 'pi-sidebar  fa-regular fa-newspaper',
        to: '/admin/quan-ly-tin-bai',
        permission: ['xem_danh_sach_tin_bai'],
        id: 'menu-quan-ly-tin-bai',
      },
    ],
  },
  {
    items: [
      {
        label: 'Quản lý video',
        icon: 'pi-sidebar fa-solid fa-video',
        to: '/admin/quan-ly-video',
        permission: ['xem_danh_sach_video'],
        id: 'menu-quan-ly-video',
      },
    ],
  },
  {
    items: [
      {
        label: 'QL hiển thị trang chủ',
        icon: 'pi-sidebar fa-regular fa-eye',
        id: 'menu-quan-ly-hien-thi',
        permission: ['xem_danh_sach_nhom_tin_bai', 'xem_danh_sach_link_lien_ket', 'xem_danh_sach_banner'],
        items: [
          {
            icon: 'pi-sidebar pi pi-sitemap',
            items: [
              {
                label: 'QL liên kết',
                permission: ['xem_danh_sach_link_lien_ket'],
                to: '/admin/quan-ly-lien-ket',
                id: 'menu-lien-ket',
              },
              {
                label: 'QL banner trang chủ',
                permission: ['xem_danh_sach_banner'],
                to: '/admin/quan-ly-banner-trang-chu',
                id: 'menu-banner',
              },
              {
                label: 'QL nhóm tin bài',
                permission: ['xem_danh_sach_nhom_tin_bai'],
                to: '/admin/quan-ly-nhom-tin-bai-trang-chu',
                id: 'menu-nhom-tin-bai',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    items: [
      {
        label: 'Báo cáo',
        permission: ['thong_ke_luot_xem', 'bao_cao_phat_trien_noi_dung'],
        icon: 'pi-sidebar  fa-solid fa-flag',
        id: 'menu-bao-cao',
        items: [
          {
            icon: 'pi-sidebar pi pi-key',
            items: [
              {
                label: 'Lượt view',
                permission: ['thong_ke_luot_xem'],
                to: '/admin/luot-view',
              },
              {
                label: 'Báo cáo phát triển nội dung',
                permission: ['bao_cao_phat_trien_noi_dung'],
                to: '/admin/bao-cao-phat-trien-noi-dung',
              },
            ],
          },
        ],
      },
    ],
  },
]) as any;
</script>
<style lang="scss" scoped>
.sidenav {
  background-color: white;
  overflow-x: hidden;
  padding-top: 20px;
  position: absolute;
  width: 240px;
  height: 100%;
  top: 0px;
  padding-top: 70px;

  .scroll-sidebar {
    position: relative;
    overflow-y: hidden;
    width: auto;
    height: 100%;
    padding-bottom: 60px;
    padding-top: 15px;
  }
}
</style>
