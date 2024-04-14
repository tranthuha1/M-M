<template>
  <div
  :class="sideBar.isShowSideBar ? 'home' : 'full-home'"
  @scroll="() => treeSelect.toggleScroll()"
  >
    <div class="main-layout">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSideBar } from '@/store/sidebar';
import { useTreeSelect } from '@/store/treeSelect';

onMounted(() => {
  const bodyElement = document.body;
  bodyElement.classList.add('fix-scroll');
});
const sideBar = useSideBar();
const treeSelect = useTreeSelect();
</script>

<style lang="scss" scoped>
.main-layout {
  background-color: #fff;
  padding: 15px 10px 15px 10px;
  border-radius: 15px;
}

.home {
  margin-left: 240px;
  padding-right: 25px;
  padding-left: 25px;
  padding-top: 15px;
  padding-bottom: 90px;
  height: 100vh;
  background-color: var(--body-color);
  overflow: auto;
}
.full-home {
  padding-top: 15px;
  padding-left: 25px;
  padding-bottom: 90px;
  margin-left: 60px;
  padding-right: 25px;
  height: 100vh;
  background-color: var(--body-color);
  overflow: auto;
}
</style>
