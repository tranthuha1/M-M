import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOverLayLoadingStore = defineStore(
  'overlayLoading',
  () => {
    const isShowLoading = ref(false);
    const toggleLoading = (value: boolean) => {
      isShowLoading.value = value;
    };
    return {
      isShowLoading,
      toggleLoading,
    };
  },
);
