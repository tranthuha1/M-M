import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTreeSelect = defineStore('treeSelect', () => {
  const isScroll = ref(true);
  const toggleScroll = () => {
    isScroll.value = !isScroll.value;
  };

  return {
    isScroll,
    toggleScroll,
  } as const;
});
