<template>
  <button
    :id="id"
    :class="
      buttonType === 'primary'
        ? 'button-primary'
        : buttonType === 'invalid'
        ? 'button-invalid'
        : 'button-normal'
    "
  >
    <div>{{ buttonName }}</div>
  </button>
</template>
<script setup lang="ts">
const props = defineProps({
  buttonName: String,
  buttonType: String,
  id: String,
});
</script>
<style scoped>
.button-primary {
  border-radius: 30px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  padding: 8px 20px;
  min-width: 90px;
}
.button-normal {
  border-radius: 30px;
  background-color: #fff;
  color: #292b2c;
  font-size: 14px;
  padding: 8px 20px;
  min-width: 90px;
  border-color: #000;
}
.button-invalid {
  border-radius: 30px;
  background-color: #64748b;
  color: #fff;
  font-size: 14px;
  padding: 8px 20px;
  min-width: 90px;
}
</style>
