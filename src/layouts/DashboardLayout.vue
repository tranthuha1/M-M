<template>
  <NavBar></NavBar>
  <Sidebar></Sidebar>
  <MainLayout></MainLayout>
  <LoadingOverlay />
</template>

<script setup lang="ts">
import LoadingOverlay from '@/components/base/LoadingOverlay.vue';
import Sidebar from './SideBar.vue';
import NavBar from './NavBar.vue';
import MainLayout from './MainLayout.vue';

</script>
<style scoped lang="scss">
</style>
