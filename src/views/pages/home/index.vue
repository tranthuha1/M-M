<script lang="ts" setup>
import { gsap } from 'gsap';
import { ref, onMounted, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import MenuPC from './component/menu-pc.vue';

const navbar = ref();
const container = ref();
const isUpperTop = ref(true);
onMounted(() => {
  //   gsap.from(navbar.value, {
  //     y: -100,
  //     duration: 2,
  //     opacity: 0,
  //   });
});
const menu = ref(['Quartz', 'Porcelain', 'Natural Stone', 'Kitchen Cabinets', 'Closets', 'Our Story']);
const isMenuSelected = ref(false);
const selectedMenu = ref([false, false, false, false, false]);
const handleScroll = useDebounceFn(() => {
  if (container.value.scrollTop === 0) {
    isUpperTop.value = true;
    gsap.to(navbar.value, {
      height: '130px',
      duration: 0.3,
      backgroundColor: 'transparent',
    });
  } else {
    isUpperTop.value = false;
    gsap.to(navbar.value, {
      height: '86px',
      duration: 0.3,
      backgroundColor: 'rgb(255, 255, 255)',
    });
  }
}, 17);
const selectMenu = (idx: number) => {
  if (selectedMenu.value[idx] === true) {
    selectedMenu.value[idx] = false;
  } else selectedMenu.value[idx] = true;
  selectedMenu.value.forEach((item, index) => {
    if (idx !== index) {
      selectedMenu.value[index] = false;
    }
  });
  if (selectedMenu.value.some((element: any) => element === true)) {
    isMenuSelected.value = true;
    gsap.to(navbar.value, {
      duration: 0.3,
      backgroundColor: 'rgb(255, 255, 255)',
    });
  } else if (isUpperTop.value) {
    isMenuSelected.value = false;
    gsap.to(navbar.value, {
      duration: 0.3,
      backgroundColor: 'transparent',
    });
  }
};
const test = () => {
  console.log(isUpperTop.value);
};
</script>
<template>
  <!-- <button @click="test">test</button> -->
  <div ref="container" class="h-[100vh] w-full overflow-auto" @scroll="handleScroll">
    <div ref="navbar" class="md:justify-normal items-center justify-center h-[130px] top-0 flex px-[50px] w-[100%]"
      :class="{
    'absolute': isUpperTop,
    'sticky': !isUpperTop
  }">
      <img v-if="isUpperTop && !isMenuSelected" class="w-[160px]" src="@/assets/images/logo-light.png" alt="" />
      <img v-else class="w-[160px]" src="@/assets/images/logo-dark.png" alt="" />
      <div class="cursor-pointer hidden md:flex ml-[10%] justify-between w-[70%]">
        <div :class="{
    'text-[#fff]': isUpperTop && !selectedMenu[idx] && !isMenuSelected,
    'font-bold': selectedMenu[idx],
  }" @click="selectMenu(idx)" @keydown="selectMenu(idx)" v-for="(item, idx) in menu" :key="idx">{{ item }}
          <i class="pi pi-angle-up" :class="{
    'pi-angle-left-active': selectedMenu[idx],
    'pi-angle-up-active': !selectedMenu[idx],
  }"></i>
        </div>
      </div>
    </div>
    <div class="md:hidden bg-red-500 w-[100%] h-[64px] absolute bottom-0">
    </div>
    <MenuPC v-if="isMenuSelected"></MenuPC>
    <img v-else class="w-[100%]" src="@/assets/images/background-main.jpg" alt="" />
    <div class="h-[1000px]"></div>
  </div>
</template>
<style></style>
