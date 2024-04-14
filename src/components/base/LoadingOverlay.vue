<script setup lang="ts">
import { useOverLayLoadingStore } from '@/store/overlayLoading';

const overlayLoading = useOverLayLoadingStore();
</script>
<template>
  <div class="overlay" v-if="overlayLoading.isShowLoading" id="vivas-loading">
    <div class="overlay__inner">
      <div class="overlay__content">
        <span class="spinner"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: #22222270;
  z-index: 9999;
}

.overlay__inner {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

.overlay__content {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  width: 48px;
  height: 48px;
  display: inline-block;
  border-width: 2px;
  border-color: #e2d8d8(255, 255, 255, 0.05);
  border-top-color: #11ad2b;
  animation: spin 0.8s infinite linear;
  border-radius: 100%;
  border-style: solid;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
