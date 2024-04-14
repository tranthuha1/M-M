import HomeView from '@/views/HomeView.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import QuanLyBanner from '@/views/pages/app/quan-ly-hien-thi/quan-ly-banner-trang-chu/index.vue';
import QuanLyTinBai from '@/views/pages/app/quan-ly-tin-bai/index.vue';
import QuanLyNhomTinBaiTrangChu from '@/views/pages/app/quan-ly-hien-thi/quan-ly-nhom-tin-bai-trang-chu/index.vue';
import QuanLyLienKet from '@/views/pages/app/quan-ly-hien-thi/quan-ly-lien-ket/index.vue';
import QuanLyVideo from '@/views/pages/app/quan-ly-video/index.vue';
import BaoCaoLuotView from '@/views/pages/app/bao-cao/luot-view/index.vue';
import BaoCaoPhatTrienNoiDung from '@/views/pages/app/bao-cao/phat-trien-noi-dung/index.vue';

export default {
  path: '/admin',
  component: DashboardLayout,
  redirect: '/admin/quan-ly-tin-bai',
  children: [
    {
      path: '/admin/quan-ly-banner-trang-chu',
      name: 'QuanLyBanner',
      component: QuanLyBanner,
      meta: {
        requiresAuth: true,
        title: 'Quản lý banner',
        permission: 'xem_danh_sach_banner',
      },
    },
    {
      path: '/admin/quan-ly-tin-bai',
      name: 'QuanLyTinBai',
      component: QuanLyTinBai,
      meta: {
        requiresAuth: true,
        title: 'Quản lý tin bài',
        permission: 'xem_danh_sach_tin_bai',
      },
    },
    {
      path: '/admin/quan-ly-nhom-tin-bai-trang-chu',
      name: 'QuanLyNhomTinBaiTrangChu',
      component: QuanLyNhomTinBaiTrangChu,
      meta: {
        requiresAuth: true,
        title: '/Quản lý nhóm tin bài trang chủ',
        permission: 'xem_danh_sach_nhom_tin_bai',
      },
    },
    {
      path: '/admin/quan-ly-lien-ket',
      name: 'QuanLyLienKet',
      component: QuanLyLienKet,
      meta: {
        requiresAuth: true,
        title: 'Quản lý liên kết',
        permission: 'xem_danh_sach_link_lien_ket',
      },
    },
    {
      path: '/admin/quan-ly-video',
      name: 'QuanLyVideo',
      component: QuanLyVideo,
      meta: {
        requiresAuth: true,
        title: 'Quản lý video',
        permission: 'xem_danh_sach_video',
      },
    },
    {
      path: '/admin/luot-view',
      name: 'BaoCaoLuotView',
      component: BaoCaoLuotView,
      meta: {
        requiresAuth: true,
        title: 'Lượt view',
        permission: 'thong_ke_luot_xem',
      },
    },
    {
      path: '/admin/bao-cao-phat-trien-noi-dung',
      name: 'BaoCaoPhatTrienNoiDung',
      component: BaoCaoPhatTrienNoiDung,
      meta: {
        requiresAuth: true,
        title: 'Báo cáo phát triển nội dung',
        permission: 'bao_cao_phat_trien_noi_dung',
      },
    },
  ],
};
