export default {};
export const STATUS_LUU_NHAP = 1;
export const STATUS_CHO_DUYET = 2;
export const STATUS_DA_HOAT_DONG = 3;
export const STATUS_HUY = 4;
export const STATUS_BI_GO = 5;

export const TYPE_POST_NEWS = 1;
export const TYPE_POST_SHORT_POLL_VOTE = 2;
export const TYPE_POST_LONG_POLL_VOTE = 3;

export function getStatusName(value : any) {
  switch (value) {
    case STATUS_LUU_NHAP:
      return 'Lưu nháp';
    case STATUS_CHO_DUYET:
      return 'Chờ duyệt';
    case STATUS_DA_HOAT_DONG:
      return 'Công bố';
    case STATUS_HUY:
      return 'Từ chối';
    case STATUS_BI_GO:
      return 'Gỡ bài';
    default:
      return '';
  }
}

export class constantsBV {

}
