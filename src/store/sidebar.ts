import { defineStore } from 'pinia';
import { ref } from 'vue';

export type UserData = Record<string, any> | null;

export const useSideBar = defineStore('sidebar', () => {
  const changeWidth = ref(true);
  const isShowSideBar = ref(true);
  const toggleSideBar = () => {
    isShowSideBar.value = !isShowSideBar.value;
    changeWidth.value = !changeWidth.value;
  };

  return {
    isShowSideBar,
    toggleSideBar,
    changeWidth,
  } as const;
});
