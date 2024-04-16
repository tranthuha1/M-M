export const Permission = [
  {
    key: 'chon_tat_ca',
    label: 'Chọn tất cả',
    children: [
      {
        key: 'ql_ca_nhan',
        label: 'Quản lý cá nhân',
        children: [
          { key: 'phan_quyen_he_thong', label: 'Phân quyền hệ thống' },
        ],
      },
      {
        key: 'ql_nhom_quyen',
        label: 'Quản lý nhóm quyền',
        children: [
          {
            key: 'xem_danh_sach_nhom_quyen',
            label: 'Xem danh sách nhóm quyền',
          },
          {
            key: 'tim_kiem_nhom_quyen',
            label: 'Tìm kiếm nhóm quyền',
          },
          {
            key: 'xem_chi_tiet_thong_tin_nhom_quyen',
            label: 'Xem chi tiết thông tin nhóm quyền',
          },
          {
            key: 'them_nhom_quyen',
            label: 'Thêm nhóm quyền',
          },
          {
            key: 'cap_nhat_thong_tin_nhom_quyen',
            label: 'Cập nhật thông tin nhóm quyền',
          },
          {
            key: 'xoa_nhom_quyen',
            label: 'Xóa nhóm quyền',
          },
        ],
      },
      {
        key: 'ql_nguoi_dung',
        label: 'Quản lý người dùng',
        children: [
          {
            key: 'xem_danh_sach_nguoi_dung',
            label: 'Xem danh sách người dùng',
          },
          {
            key: 'tim_kiem_nguoi_dung',
            label: 'Tìm kiếm người dùng',
          },
          {
            key: 'xem_chi_tiet_thong_tin_nguoi_dung',
            label: 'Xem chi tiết thông tin người dùng',
          },
          {
            key: 'them_nguoi_dung',
            label: 'Thêm người dùng',
          },
          {
            key: 'cap_nhat_thong_tin_nguoi_dung',
            label: 'Cập nhật thông tin người dùng',
          },
          {
            key: 'phan_quyen_nguoi_dung',
            label: 'Phân quyền người dùng',
          },
        ],
      },
      {
        key: 'ql_danh_muc_tin_bai',
        label: 'Quản lý danh mục tin bài',
        children: [
          {
            key: 'xem_danh_sach_danh_muc',
            label: 'Xem danh sách danh mục',
          },
          {
            key: 'tim_kiem_danh_muc',
            label: 'Tìm kiếm danh mục',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_danh_muc',
            label: 'Xem chi tiết thông tin danh mục',
          },
          {
            key: 'them_danh_muc',
            label: 'Thêm danh mục',
          },
          {
            key: 'cap_nhat_thong_tin_danh_muc',
            label: 'Cập nhật thông tin danh mục',
          },
          {
            key: 'xoa_danh_muc',
            label: 'Xóa danh mục',
          },
        ],
      },
      {
        key: 'ql_tin_bai',
        label: 'Quản lý tin bài',
        children: [
          {
            key: 'xem_danh_sach_tin_bai',
            label: 'Xem danh sách tin bài',
          },
          {
            key: 'tim_kiem_tin_bai',
            label: 'Tìm kiếm tin bài',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_tin_bai',
            label: 'Xem chi tiết thông tin 1 tin bài',
          },
          {
            key: 'them_tin_bai',
            label: 'Thêm tin bài',
          },
          {
            key: 'cap_nhat_thong_tin_tin_bai',
            label: 'Cập nhật thông tin tin bài',
          },
          {
            key: 'active_deactive_tin_bai',
            label: 'Active/Deactive tin bài',
          },
          {
            key: 'xoa_tin_bai',
            label: 'Xóa tin bài',
          },
          {
            key: 'duyet_tin_bai',
            label: 'Duyệt tin bài',
          },
        ],
      },
      {
        key: 'ql_su_kien',
        label: 'Quản lý sự kiện',
        children: [
          {
            key: 'xem_danh_sach_su_kien',
            label: 'Xem danh sách sự kiện',
          },
          {
            key: 'tim_kiem_su_kien',
            label: 'Tìm kiếm sự kiện',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_su_kien',
            label: 'Xem chi tiết thông tin 1 sự kiện',
          },
          {
            key: 'them_su_kien',
            label: 'Thêm sự kiện',
          },
          {
            key: 'cap_nhat_thong_tin_su_kien',
            label: 'Cập nhật thông tin sự kiện',
          },
          {
            key: 'active_deactive_su_kien',
            label: 'Active/Deactive sự kiện',
          },
          {
            key: 'xoa_su_kien',
            label: 'Xóa sự kiện',
          },
          {
            key: 'duyet_su_kien',
            label: 'Duyệt sự kiện',
          },
        ],
      },
      {
        key: 'ql_khao_sat',
        label: 'Quản lý khảo sát',
        children: [
          {
            key: 'xem_danh_sach_bai_khao_sat',
            label: 'Xem danh sách bài khảo sát',
          },
          {
            key: 'tim_kiem_bai_khao_sat',
            label: 'Tìm kiếm bài khảo sát',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_bai_khao_sat',
            label: 'Xem chi tiết thông tin 1 bài khảo sát',
          },
          {
            key: 'them_bai_khao_sat',
            label: 'Thêm bài khảo sát',
          },
          {
            key: 'cap_nhat_thong_tin_bai_khao_sat',
            label: 'Cập nhật thông tin bài khảo sát',
          },
          {
            key: 'active_deactive_bai_khao_sat',
            label: 'Active/deactive bài khảo sát',
          },
          {
            key: 'xoa_bai_khao_sat',
            label: 'Xóa bài khảo sát',
          },
        ],
      },
      {
        key: 'ql_thu_muc',
        label: 'Quản lý thư mục',
        children: [
          {
            key: 'xem_danh_sach_thu_muc',
            label: 'Xem danh sách Thư mục',
          },
          {
            key: 'them_thu_muc',
            label: 'Thêm Thư mục',
          },
          {
            key: 'cap_nhat_thu_muc',
            label: 'Cập nhật Thư mục',
          },
          {
            key: 'xoa_thu_muc',
            label: 'Xóa Thư mục',
          },
          {
            key: 'khoa_mo_khoa_thu_muc',
            label: 'Khóa/Mở khóa Thư mục',
          },
          {
            key: 'sap_xep_thu_muc',
            label: 'Sắp xếp thư mục',
          },
        ],
      },
      {
        key: 'ql_thong_tin_huong_dan',
        label: 'Quản lý thông tin hướng dẫn',
        children: [
          {
            key: 'xem_danh_sach_van_ban_thong_tin_huong_dan',
            label: 'Xem danh sách văn bản thông tin hướng dẫn',
          },
          {
            key: 'tim_kiem_thong_tin_huong_dan',
            label: 'Tìm kiếm thông tin hướng dẫn',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_thu_muc_tthd',
            label: 'Xem chi tiết thông tin 1 thư mục TTHD',
          },
          {
            key: 'them_1_van_ban_vao_thu_muc_tthd',
            label: 'Thêm 1 văn bản vào thư mục TTHD',
          },
          {
            key: 'cap_nhat_thong_tin_1_van_ban_tthd',
            label: 'Cập nhật thông tin 1 văn bản TTHD',
          },
          {
            key: 'active_deactive_1_van_ban_tthd',
            label: 'Active/Deactive 1 văn bản TTHD',
          },
          {
            key: 'xoa_van_ban_tthd',
            label: 'Xóa văn bản TTHD',
          },
        ],
      },
      {
        key: 'ql_video',
        label: 'Quản lý video',
        children: [
          {
            key: 'xem_danh_sach_video',
            label: 'Xem danh sách video',
          },
          {
            key: 'tim_kiem_video',
            label: 'Tìm kiếm video',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_video',
            label: 'Xem chi tiết thông tin 1 video',
          },
          {
            key: 'them_video',
            label: 'Thêm video',
          },
          {
            key: 'cap_nhat_thong_tin_video',
            label: 'Cập nhật thông tin video',
          },
          {
            key: 'active_deactive_video',
            label: 'Active/Deactive video',
          },
          {
            key: 'xoa_video',
            label: 'Xóa video',
          },
          {
            key: 'duyet_video',
            label: 'Duyệt video',
          },
        ],
      },
      {
        key: 'ql_thu_vien_anh',
        label: 'Quản lý thư viện ảnh',
        children: [
          {
            key: 'xem_danh_sach_thu_vien_anh',
            label: 'Xem danh sách thư viện ảnh',
          },
          {
            key: 'tim_kiem_album_anh',
            label: 'Tìm kiếm album ảnh',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_album_anh',
            label: 'Xem chi tiết thông tin 1 album ảnh',
          },
          {
            key: 'them_album_anh',
            label: 'Thêm album ảnh',
          },
          {
            key: 'cap_nhat_thong_tin_album_anh',
            label: 'Cập nhật thông tin album ảnh',
          },
          {
            key: 'active_deactive_album_anh',
            label: 'Active/Deactive album ảnh',
          },
          {
            key: 'xoa_album_anh',
            label: 'Xóa album ảnh',
          },
          {
            key: 'duyet_thu_vien_anh',
            label: 'Duyệt thư viện ảnh',
          },
        ],
      },
      {
        key: 'ql_lien_ket',
        label: 'Quản lý liên kết',
        children: [
          {
            key: 'xem_danh_sach_link_lien_ket',
            label: 'Xem danh sách link liên kết',
          },
          {
            key: 'tim_kiem_lien_ket',
            label: 'Tìm kiếm liên kết',
          },
          {
            key: 'xem_chi_tiet_lien_ket',
            label: 'Xem chi tiết 1 liên kết',
          },
          {
            key: 'them_lien_ket',
            label: 'Thêm liên kết',
          },
          {
            key: 'cap_nhat_thong_tin_lien_ket',
            label: 'Cập nhật thông tin liên kết',
          },
          {
            key: 'active_deactive_lien_ket',
            label: 'Active/Deactive liên kết',
          },
          {
            key: 'xoa_lien_ket',
            label: 'Xóa liên kết',
          },
        ],
      },
      {
        key: 'ql_banner',
        label: 'Quản lý banner',
        children: [
          {
            key: 'xem_danh_sach_banner',
            label: 'Xem danh sách banner',
          },
          {
            key: 'tim_kiem_banner',
            label: 'Tìm kiếm banner',
          },
          {
            key: 'xem_chi_tiet_banner',
            label: 'Xem chi tiết 1 banner',
          },
          {
            key: 'them_banner',
            label: 'Thêm banner',
          },
          {
            key: 'cap_nhat_thong_tin_banner',
            label: 'Cập nhật thông tin banner',
          },
          {
            key: 'active_deactive_banner',
            label: 'Active/Deactive banner',
          },
          {
            key: 'xoa_banner',
            label: 'Xóa banner',
          },
        ],
      },
      {
        key: 'ql_nhom_tin_bai',
        label: 'Quản lý nhóm tin bài',
        children: [
          {
            key: 'xem_danh_sach_nhom_tin_bai',
            label: 'Xem danh sách nhóm tin bài',
          },
          {
            key: 'tim_kiem_nhom_tin_bai',
            label: 'Tìm kiếm nhóm tin bài',
          },
          {
            key: 'xem_chi_tiet_nhom_tin_bai',
            label: 'Xem chi tiết 1 nhóm tin bài',
          },
          {
            key: 'them_nhom_tin_bai',
            label: 'Thêm nhóm tin bài',
          },
          {
            key: 'cap_nhat_thong_tin_nhom_tin_bai',
            label: 'Cập nhật nhóm tin bài',
          },
          {
            key: 'active_deactive_nhom_tin_bai',
            label: 'Active/Deactive nhóm tin bài',
          },
          {
            key: 'xoa_nhom_tin_bai',
            label: 'Xóa nhóm tin bài',
          },
        ],
      },
      {
        key: 'ql_diem_den',
        label: 'Quản lý điểm đến',
        children: [
          {
            key: 'xem_danh_sach_diem_den',
            label: 'Xem danh sách điểm đến',
          },
          {
            key: 'tim_kiem_diem_den',
            label: 'Tìm kiếm điểm đến',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_diem_den',
            label: 'Xem chi tiết thông tin 1 điểm đến',
          },
          {
            key: 'them_diem_den',
            label: 'Thêm điểm đến',
          },
          {
            key: 'cap_nhat_thong_tin_diem_den',
            label: 'Cập nhật thông tin điểm đến',
          },
          {
            key: 'active_deactive_diem_den',
            label: 'Active/Deactive điểm đến',
          },
          {
            key: 'xoa_diem_den',
            label: 'Xóa điểm đến',
          },
        ],
      },
      {
        key: 'ql_diem_luu_tru',
        label: 'Quản lý điểm lưu trú',
        children: [
          {
            key: 'xem_danh_sach_diem_luu_tru',
            label: 'Xem danh sách điểm lưu trú',
          },
          {
            key: 'tim_kiem_diem_luu_tru',
            label: 'Tìm kiếm điểm lưu trú',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_diem_luu_tru',
            label: 'Xem chi tiết thông tin 1 điểm lưu trú',
          },
          {
            key: 'them_diem_luu_tru',
            label: 'Thêm điểm lưu trú',
          },
          {
            key: 'cap_nhat_thong_tin_diem_luu_tru',
            label: 'Cập nhật thông tin điểm lưu trú',
          },
          {
            key: 'active_deactive_diem_luu_tru',
            label: 'Active/Deactive điểm lưu trú',
          },
          {
            key: 'xoa_diem_luu_tru',
            label: 'Xóa điểm lưu trú',
          },
          {
            key: 'duyet_diem_luu_tru',
            label: 'Duyệt điểm lưu trú',
          },
        ],
      },
      {
        key: 'ql_nha_hang_am_thuc',
        label: 'Quản lý nhà hàng ẩm thực',
        children: [
          {
            key: 'xem_danh_sach_nha_hang',
            label: 'Xem danh sách nhà hàng',
          },
          {
            key: 'tim_kiem_nha_hang',
            label: 'Tìm kiếm nhà hàng',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_nha_hang',
            label: 'Xem chi tiết thông tin nhà hàng',
          },
          {
            key: 'them_nha_hang',
            label: 'Thêm nhà hàng',
          },
          {
            key: 'cap_nhat_thong_tin_nha_hang',
            label: 'Cập nhật thông tin nhà hàng',
          },
          {
            key: 'active_deactive_nha_hang',
            label: 'Active/Deactive nhà hàng',
          },
          {
            key: 'xoa_nha_hang',
            label: 'Xóa nhà hàng',
          },
          {
            key: 'duyet_nha_hang',
            label: 'Duyệt nhà hàng',
          },
        ],
      },
      {
        key: 'ql_san_pham_ocop',
        label: 'Quản lý sản phẩm OCOP',
        children: [
          {
            key: 'xem_danh_sach_san_pham',
            label: 'Xem danh sách sản phẩm',
          },
          {
            key: 'tim_kiem_san_pham',
            label: 'Tìm kiếm sản phẩm',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_san_pham',
            label: 'Xem chi tiết thông tin 1 sản phẩm',
          },
          {
            key: 'them_san_pham',
            label: 'Thêm sản phẩm',
          },
          {
            key: 'cap_nhat_thong_tin_san_pham',
            label: 'Cập nhật thông tin sản phẩm',
          },
          {
            key: 'active_deactive_san_pham',
            label: 'Active/Deactive sản phẩm',
          },
          {
            key: 'xoa_san_pham',
            label: 'Xóa sản phẩm',
          },
          {
            key: 'duyet_san_pham',
            label: 'Duyệt sản phẩm',
          },
        ],
      },
      {
        key: 'ql_diem_trung_bay_gioi_thieu_san_pham',
        label: 'QL điểm trưng bày, giới thiệu sản phẩm',
        children: [
          {
            key: 'xem_danh_sach_diem_trung_bay_gioi_thieu_san_pham',
            label: 'Xem danh sách điểm trưng bày, giới thiệu sản phẩm',
          },
          {
            key: 'tim_kiem_diem_trung_bay_gioi_thieu_san_pham',
            label: 'Tìm kiếm điểm trưng bày, giới thiệu sản phẩm',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_diem_trung_bay_gioi_thieu_san_pham',
            label:
              'Xem chi tiết thông tin 1 điểm trưng bày, giới thiệu sản phẩm',
          },
          {
            key: 'them_diem_trung_bay_gioi_thieu_san_pham',
            label: 'Thêm điểm trưng bày, giới thiệu sản phẩm',
          },
          {
            key: 'cap_nhat_thong_tin_diem_trung_bay_gioi_thieu_san_pham',
            label: 'Cập nhật thông tin điểm trưng bày, giới thiệu sản phẩm',
          },
          {
            key: 'active_deactive_diem_trung_bay_gioi_thieu_san_pham',
            label: 'Active/Deactive điểm trưng bày, giới thiệu sản phẩm',
          },
          {
            key: 'xoa_diem_trung_bay_gioi_thieu_san_pham',
            label: 'Xóa điểm trưng bày, giới thiệu sản phẩm',
          },
          {
            key: 'duyet_thong_tin_diem_trung_bay_gioi_thieu_san_pham',
            label: 'Duyệt thông tin điểm trưng bày, giới thiệu sản phẩm',
          },
        ],
      },
      {
        key: 'ql_dich_vu_du_lich_cong_dong_diem_den_nnnt',
        label: 'Quản lý dịch vụ du lịch cộng đồng, điểm đến NNNT',
        children: [
          {
            key: 'xem_danh_sach_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label: 'Xem danh sách dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
          {
            key: 'tim_kiem_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label: 'Tìm kiếm dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label:
              'Xem chi tiết thông tin 1 dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
          {
            key: 'them_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label: 'Thêm dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
          {
            key: 'cap_nhat_thong_tin_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label:
              'Cập nhật thông tin dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
          {
            key: 'active_deactive_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label: 'Active/Deactive dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
          {
            key: 'xoa_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label: 'Xóa dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
          {
            key: 'duyet_thong_tin_dich_vu_du_lich_cong_dong_diem_den_nnnt',
            label: 'Duyệt thông tin dịch vụ du lịch cộng đồng, điểm đến NNNT',
          },
        ],
      },
      {
        key: 'ql_mo_hinh_du_lich_nnnt',
        label: 'Quản lý mô hình du lịch NNNT',
        children: [
          {
            key: 'xem_danh_sach_mo_hinh_du_lich_nnnt',
            label: 'Xem danh sách mô hình du lịch NNNT',
          },
          {
            key: 'tim_kiem_diem_mo_hinh_du_lich_nnnt',
            label: 'Tìm kiếm điểm mô hình du lịch NNNT',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_mo_hinh_du_lich_nnnt',
            label: 'Xem chi tiết thông tin 1 mô hình du lịch NNNT',
          },
          {
            key: 'them_mo_hinh_du_lich_nnnt',
            label: 'Thêm mô hình du lịch NNNT',
          },
          {
            key: 'cap_nhat_thong_tin_mo_hinh_du_lich_nnnt',
            label: 'Cập nhật thông tin mô hình du lịch NNNT',
          },
          {
            key: 'active_deactive_mo_hinh_du_lich_nnnt',
            label: 'Active/Deactive mô hình du lịch NNNT',
          },
          {
            key: 'xoa_mo_hinh_du_lich_nnnt',
            label: 'Xóa mô hình du lịch NNNT',
          },
          {
            key: 'duyet_thong_tin_mo_hinh_du_lich_nnnt',
            label: 'Duyệt thông tin mô hình du lịch NNNT',
          },
        ],
      },
      {
        key: 'ql_lang_nghe_nghe_truyen_thong',
        label: 'Quản lý làng nghề, nghề truyền thống',
        children: [
          {
            key: 'xem_danh_sach_lang_nghe_nghe_truyen_thong',
            label: 'Xem danh sách nghề, nghề truyền thống',
          },
          {
            key: 'tim_kiem_lang_nghe_nghe_truyen_thong',
            label: 'Tìm kiếm nghề, nghề truyền thống',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_lang_nghe_nghe_truyen_thong',
            label: 'Xem chi tiết thông tin 1 nghề, nghề truyền thống',
          },
          {
            key: 'them_lang_nghe_nghe_truyen_thong',
            label: 'Thêm nghề, nghề truyền thống',
          },
          {
            key: 'cap_nhat_thong_tin_lang_nghe_nghe_truyen_thong',
            label: 'Cập nhật thông tin nghề, nghề truyền thống',
          },
          {
            key: 'active_deactive_lang_nghe_nghe_truyen_thong',
            label: 'Active/Deactive nghề, nghề truyền thống',
          },
          {
            key: 'xoa_lang_nghe_nghe_truyen_thong',
            label: 'Xóa nghề, nghề truyền thống',
          },
          {
            key: 'duyet_thong_tin_lang_nghe_nghe_truyen_thong',
            label: 'Duyệt thông tin nghề, nghề truyền thống',
          },
        ],
      },
      {
        key: 'ql_doanh_nghiep_cung_cap_tour',
        label: 'Quản lý doanh nghiệp cung cấp tour',
        children: [
          {
            key: 'xem_danh_sach_doanh_nghiep_cung_cap_tour',
            label: 'Xem danh sách doanh nghiệp cung cấp tour',
          },
          {
            key: 'tim_kiem_doanh_nghiep_cung_cap_tour',
            label: 'Tìm kiếm doanh nghiệp cung cấp tour',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_doanh_nghiep_cung_cap_tour',
            label: 'Xem chi tiết thông tin 1 doanh nghiệp cung cấp tour',
          },
          {
            key: 'them_doanh_nghiep_cung_cap_tour',
            label: 'Thêm doanh nghiệp cung cấp tour',
          },
          {
            key: 'cap_nhat_thong_tin_doanh_nghiep_cung_cap_tour',
            label: 'Cập nhật thông tin doanh nghiệp cung cấp tour',
          },
          {
            key: 'active_deactive_doanh_nghiep_cung_cap_tour',
            label: 'Active/Deactive doanh nghiệp cung cấp tour',
          },
          {
            key: 'xoa_doanh_nghiep_cung_cap_tour',
            label: 'Xóa doanh nghiệp cung cấp tour',
          },
        ],
      },
      {
        key: 'ql_chuong_trinh_du_lich_nnnt',
        label: 'Quản lý chương trình du lịch NNNT (tour)',
        children: [
          {
            key: 'xem_danh_sach_chuong_trinh_du_lich_nnnt_tour',
            label: 'Xem danh sách chương trình du lịch NNNT tour',
          },
          {
            key: 'tim_kiem_diem_chuong_trinh_du_lich_nnnt_tour',
            label: 'Tìm kiếm điểm chương trình du lịch NNNT tour',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_chuong_trinh_du_lich_nnnt_tour',
            label: 'Xem chi tiết thông tin 1 chương trình du lịch NNNT tour',
          },
          {
            key: 'them_chuong_trinh_du_lich_nnnt_tour',
            label: 'Thêm chương trình du lịch NNNT tour',
          },
          {
            key: 'cap_nhat_thong_tin_chuong_trinh_du_lich_nnnt_tour',
            label: 'Cập nhật thông tin chương trình du lịch NNNT tour',
          },
          {
            key: 'active_deactive_chuong_trinh_du_lich_nnnt_tour',
            label: 'Active/Deactive chương trình du lịch NNNT tour',
          },
          {
            key: 'xoa_chuong_trinh_du_lich_nnnt_tour',
            label: 'Xóa chương trình du lịch NNNT tour',
          },
          {
            key: 'duyet_thong_tin_chuong_trinh_du_lich_nnnt_tour',
            label: 'Duyệt thông tin chương trình du lịch NNNT tour',
          },
        ],
      },
      {
        key: 'ql_mau_phieu_dieu_tra',
        label: 'Quản lý mẫu phiếu điều tra',
        children: [
          {
            key: 'xem_danh_sach_mau_phieu_dieu_tra',
            label: 'Xem danh sách mẫu phiếu điều tra',
          },
          {
            key: 'tim_kiem_mau_phieu_dieu_tra',
            label: 'Tìm kiếm mẫu phiếu điều tra',
          },
          {
            key: 'xem_chi_tiet_thong_tin_1_mau_phieu_dieu_tra',
            label: 'Xem chi tiết thông tin 1 mẫu phiếu điều tra',
          },
          {
            key: 'them_mau_phieu_dieu_tra',
            label: 'Thêm mẫu phiếu điều tra',
          },
          {
            key: 'cap_nhat_thong_tin_mau_phieu_dieu_tra',
            label: 'Cập nhật thông tin mẫu phiếu điều tra',
          },
          {
            key: 'active_deactive_mau_phieu_dieu_tra',
            label: 'Active/Deactive mẫu phiếu điều tra',
          },
          {
            key: 'xoa_mau_phieu_dieu_tra',
            label: 'Xóa mẫu phiếu điều tra',
          },
        ],
      },
      {
        key: 'ql_ket_qua_phieu_dieu_tra_cap_huyen',
        label: 'Quản lý kết quả phiếu điều tra cấp huyện',
        children: [
          {
            key: 'xem_danh_sach_ket_qua_phieu_dieu_tra_cap_huyen',
            label: 'Xem danh sách kết quả phiếu điều tra cấp huyện',
          },
          {
            key: 'tim_kiem_ket_qua_phieu_dieu_tra_cap_huyen',
            label: 'Tìm kiếm kết quả phiếu điều tra cấp huyện',
          },
          {
            key: 'xem_chi_tiet_ket_qua_phieu_dieu_tra_cap_huyen',
            label: 'Xem chi tiết kết quả phiếu điều tra cấp huyện',
          },
          {
            key: 'them_1_ban_ghi_ket_qua_phieu_dieu_tra_cap_huyen',
            label: 'Thêm 1 bản ghi kết quả phiếu điều tra cấp huyện',
          },
          {
            key: 'cap_nhat_thong_tin_1_ban_ghi_ket_qua_phieu_dieu_tra_cap_huyen',
            label:
              'Cập nhật thông tin 1 bản ghi kết quả phiếu điều tra cấp huyện',
          },
          {
            key: 'xoa_ban_ghi_phieu_dieu_tra_cap_huyen',
            label: 'Xóa bản ghi phiếu điều tra cấp huyện',
          },
          {
            key: 'thong_ke_ket_qua_phieu_dieu_tra_cap_huyen',
            label: 'Thống kê kết quả phiếu điều tra cấp huyện',
          },
        ],
      },
      {
        key: 'ql_ket_qua_phieu_dieu_tra_cap_xa',
        label: 'Quản lý kết quả phiếu điều tra cấp xã',
        children: [
          {
            key: 'xem_danh_sach_ket_qua_phieu_dieu_tra_cap_xa',
            label: 'Xem danh sách kết quả phiếu điều tra cấp xã',
          },
          {
            key: 'tim_kiem_ket_qua_phieu_dieu_tra_cap_xa',
            label: 'Tìm kiếm kết quả phiếu điều tra cấp xã',
          },
          {
            key: 'xem_chi_tiet_ket_qua_phieu_dieu_tra_cap_xa',
            label: 'Xem chi tiết kết quả phiếu điều tra cấp xã',
          },
          {
            key: 'them_1_ban_ghi_ket_qua_phieu_dieu_tra_cap_xa',
            label: 'Thêm 1 bản ghi kết quả phiếu điều tra cấp xã',
          },
          {
            key: 'cap_nhat_thong_tin_1_ban_ghi_ket_qua_phieu_dieu_tra_cap_xa',
            label: 'Cập nhật thông tin 1 bản ghi kết quả phiếu điều tra cấp xã',
          },
          {
            key: 'xoa_ban_ghi_phieu_dieu_tra_cap_xa',
            label: 'Xóa bản ghi phiếu điều tra cấp xã',
          },
          {
            key: 'thong_ke_ket_qua_phieu_dieu_tra_cap_xa',
            label: 'Thống kê kết quả phiếu điều tra cấp xã',
          },
        ],
      },
      {
        key: 'ql_ket_qua_phieu_dieu_tra_ho_nong_dan',
        label: 'Quản lý kết quả phiếu điều tra hộ nông dân',
        children: [
          {
            key: 'xem_danh_sach_ket_qua_phieu_dieu_tra_ho_nong_dan',
            label: 'Xem danh sách kết quả phiếu điều tra hộ nông dân',
          },
          {
            key: 'tim_kiem_ket_qua_phieu_dieu_tra_ho_nong_dan',
            label: 'Tìm kiếm kết quả phiếu điều tra hộ nông dân',
          },
          {
            key: 'xem_chi_tiet_ket_qua_phieu_dieu_tra_ho_nong_dan',
            label: 'Xem chi tiết kết quả phiếu điều tra hộ nông dân',
          },
          {
            key: 'them_1_ban_ghi_ket_qua_phieu_dieu_tra_ho_nong_dan',
            label: 'Thêm 1 bản ghi kết quả phiếu điều tra hộ nông dân',
          },
          {
            key: 'cap_nhat_thong_tin_1_ban_ghi_ket_qua_phieu_dieu_tra_ho_nong_dan',
            label:
              'Cập nhật thông tin 1 bản ghi kết quả phiếu điều tra hộ nông dân',
          },
          {
            key: 'xoa_ban_ghi_phieu_dieu_tra_ho_nong_dan',
            label: 'Xóa bản ghi phiếu điều tra hộ nông dân',
          },
          {
            key: 'thong_ke_ket_qua_phieu_dieu_tra_ho_nong_dan',
            label: 'Thống kê kết quả phiếu điều tra hộ nông dân',
          },
        ],
      },
      {
        key: 'ql_ket_qua_phieu_dieu_tra_ho_kinh_doanh',
        label: 'Quản lý kết quả phiếu điều tra hộ kinh doanh',
        children: [
          {
            key: 'xem_danh_sach_ket_qua_phieu_dieu_tra_ho_kinh_doanh',
            label: 'Xem danh sách kết quả phiếu điều tra hộ kinh doanh',
          },
          {
            key: 'tim_kiem_ket_qua_phieu_dieu_tra_ho_kinh_doanh',
            label: 'Tìm kiếm kết quả phiếu điều tra hộ kinh doanh',
          },
          {
            key: 'xem_chi_tiet_ket_qua_phieu_dieu_tra_ho_kinh_doanh',
            label: 'Xem chi tiết kết quả phiếu điều tra hộ kinh doanh',
          },
          {
            key: 'them_1_ban_ghi_ket_qua_phieu_dieu_tra_ho_kinh_doanh',
            label: 'Thêm 1 bản ghi kết quả phiếu điều tra hộ kinh doanh',
          },
          {
            key: 'cap_nhat_thong_tin_1_ban_ghi_ket_qua_phieu_dieu_tra_ho_kinh_doanh',
            label:
              'Cập nhật thông tin 1 bản ghi kết quả phiếu điều tra hộ kinh doanh',
          },
          {
            key: 'xoa_ban_ghi_phieu_dieu_tra_ho_kinh_doanh',
            label: 'Xóa bản ghi phiếu điều tra hộ kinh doanh',
          },
          {
            key: 'thong_ke_ket_qua_phieu_dieu_tra_ho_kinh_doanh',
            label: 'Thống kê kết quả phiếu điều tra hộ kinh doanh',
          },
        ],
      },
      {
        key: 'ql_ket_qua_phieu_dieu_tra_khach_du_lich',
        label: 'Quản lý kết quả phiếu điều tra khách du lịch',
        children: [
          {
            key: 'xem_danh_sach_ket_qua_phieu_dieu_tra_khach_du_lich',
            label: 'Xem danh sách kết quả phiếu điều tra khách du lịch',
          },
          {
            key: 'tim_kiem_ket_qua_phieu_dieu_tra_khach_du_lich',
            label: 'Tìm kiếm kết quả phiếu điều tra khách du lịch',
          },
          {
            key: 'xem_chi_tiet_ket_qua_phieu_dieu_tra_khach_du_lich',
            label: 'Xem chi tiết kết quả phiếu điều tra khách du lịch',
          },
          {
            key: 'them_1_ban_ghi_ket_qua_phieu_dieu_tra_khach_du_lich',
            label: 'Thêm 1 bản ghi kết quả phiếu điều tra khách du lịch',
          },
          {
            key: 'cap_nhat_thong_tin_1_ban_ghi_ket_qua_phieu_dieu_tra_khach_du_lich',
            label:
              'Cập nhật thông tin 1 bản ghi kết quả phiếu điều tra khách du lịch',
          },
          {
            key: 'xoa_ban_ghi_phieu_dieu_tra_khach_du_lich',
            label: 'Xóa bản ghi phiếu điều tra khách du lịch',
          },
          {
            key: 'thong_ke_ket_qua_phieu_dieu_tra_khach_du_lich',
            label: 'Thống kê kết quả phiếu điều tra khách du lịch',
          },
        ],
      },
      {
        key: 'bao_cao',
        label: 'Báo cáo',
        children: [
          {
            key: 'thong_ke_luot_xem',
            label: 'Thống kê lượt xem',
          },
          {
            key: 'bao_cao_phat_trien_noi_dung',
            label: 'Báo cáo phát triển nội dung',
          },
        ],
      },
    ],
  },
];
