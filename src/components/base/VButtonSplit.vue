<script setup lang="ts">
import Button from 'primevue/button';
import { OnClickOutside } from '@vueuse/components';
import { useButtonSpilitStore } from '@/store/splitButton';

const dropDown = useButtonSpilitStore();
const props = defineProps<{
  id?: string;
}>();
</script>
<template>
  <OnClickOutside @trigger="dropDown.showDropDown = false">
    <div class="button-container">
      <Button @click="dropDown.showItems" class="button-green" label="Thêm mới" iconPos="right" :id="id">
        <icon>
          <i
            class=" pr-2 pi pi-plus"
          ></i>
          <span class="text-button">Thêm mới</span>
          <i v-if="!dropDown.showDropDown"
             class="pl-4 pi pi-angle-down"
          ></i>
          <i v-if="dropDown.showDropDown"
             class="pl-4 pi pi-angle-down"
          ></i>
        </icon>
      </Button>
      <div v-if="dropDown.showDropDown" class="drop-down-button">
        <slot></slot>
      </div>
    </div>
  </OnClickOutside>
</template>
<style scoped>
.button-container {
  position: relative;
}

.drop-down-button {
  width: 150px;
  height: auto;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  position: absolute;
  z-index: 1;
  right: 0;
}

.text-button {
  font-size: 14px;
}
</style>
