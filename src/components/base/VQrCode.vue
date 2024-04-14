<script setup lang="ts">
import QRCodeVue3 from 'qrcode-vue3';

const props = defineProps<{
  value: string;
  width: number;
  height: number;
  downloadOptions: object;
}>();
</script>
<template>
  <div>
    <QRCodeVue3
      :width="width"
      :height="height"
      :value="JSON.stringify(value)"
      :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
      :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
      :dotsOptions="{
        type: 'dots',
        color: '#000',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#000' },
            { offset: 1, color: '#000' },
          ],
        },
      }"
      :backgroundOptions="{ color: '#ffffff' }"
      :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
      :cornersDotOptions="{ type: undefined, color: '#000000' }"
      fileExt="png"
      :download="true"
      myclass="my-qur"
      imgclass="img-qr"
      downloadButton="my-button"
      :downloadOptions="downloadOptions"
      buttonName="Tải mã"
    />
  </div>
</template>
<style scoped lang="scss">
::v-deep .my-button {
  font-size: 0;
}

::v-deep .my-button::after {
  content: 'Tải mã';
  font-size: 12px;
  display: inline-block;
  color: #2285c5;
  text-decoration: underline;
}
::v-deep .img-qr {
  min-width: 50px;
  min-height: 50px;
}
</style>
