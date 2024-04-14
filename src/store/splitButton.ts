import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useButtonSpilitStore = defineStore('buttonspit', () => {
  const showDropDown = ref(false);
  const showItems = function () {
    showDropDown.value = !showDropDown.value;
  };
  return { showDropDown, showItems };
});
