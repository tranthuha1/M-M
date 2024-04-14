import { ref } from 'vue';
import { useApi } from '@/store/useApi';

const api = useApi();
export function useCategory() {
  const listCategory = ref();
  const getListCategory = async (type: number) => {
    try {
      const res = await api.get(
        `/cms/portal/v1/category/list_all_category?group=${type}`,
      );
      listCategory.value = res.data.data.categories.map((item: any) => ({
        name: item.name,
        id: item.id,
      }));
    } catch (err: any) {
      console.error(err);
    }
  };
  return {
    getListCategory,
    listCategory,
  };
}
