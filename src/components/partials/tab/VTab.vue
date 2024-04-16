<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useRouter } from 'vue-router';

export interface ItemsTab {
  label: string;
  route: string;
}
const props = defineProps<{
  items: ItemsTab[];
}>();
const router = useRouter();

const active = ref(0);
const getCurrentPath = computed(() => router.currentRoute.value.path);
const tabActive = props.items.findIndex(
  (item) => item.route === getCurrentPath.value,
);
if (tabActive !== -1) {
  active.value = tabActive;
}
watch(getCurrentPath, (value) => {
  active.value = props.items.findIndex((item) => item.route === value);
});
</script>
<template>
  <div class="card">
    <TabView v-model:activeIndex="active">
      <TabPanel v-for="(item, index) in items" :key="index">
        <template #header>
          <router-link :to="item.route" class="p-4">
            <span>{{ item.label }}</span>
          </router-link>
        </template>
      </TabPanel>
    </TabView>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
