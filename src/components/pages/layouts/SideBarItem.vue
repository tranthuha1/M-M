<template>
  <li
    v-for="(i, index) in item.items"
    :key="index + i"
    @click.stop="toggleDropdown(i, index)"
    @keydown="toggleDropdown(i, index)"
    :id="i.id"
  >
    <a
      href="#"
      tabindex="0"
      class="nav-item"
      :class="{'nav-child-item':$props.navChild}"
    >
      <div class="flex items-center gap-x-3 justify-start">
        <div :class="
            getCurrentPath.startsWith(i.to?.match(/\/[^/]+/)[0]) ? 'item-slected' : ''
          ">
        <i
          class="text-2xl min-w-[30px]"
          :class="i.icon"
        ></i>
      </div>
        <span
          v-if="sideBar.isShowSideBar"
          class="layout-menuitem-text text-[15px]"
          :class="getCurrentPath.startsWith(i.to?.match(/\/[^/]+/)[0]) ? 'item-slected' : ''"
        >{{ i.label }}</span
        >
      </div>
      <i
        v-if="i.items && sideBar.isShowSideBar"
        class="pi pi-angle-left"
        :class="{
          'pi-angle-left-active': isOpen[index],
        }"
      ></i>
    </a>
    <Transition>
      <div
        v-if="isOpen[index] && sideBar.isShowSideBar"
        class="dropdown-container"
        :style="{ display: 'block' }"
      >
        <ul>
          <template v-for="(item, index) in i.items" :key="item + index">
            <SideBarItem :item="item" :navChild="true"></SideBarItem>
          </template>
        </ul>
      </div>
    </Transition>
  </li>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSideBar } from '@/store/sidebar';

const sideBar = useSideBar();
const router = useRouter();
const getCurrentPath = computed(() => router.currentRoute.value.path);
defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  navChild: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref({}) as any;
const toggleDropdown = (i: any, index: number) => {
  if (i.items) {
    isOpen.value[index] = !isOpen.value[index];
    if (!sideBar.isShowSideBar) {
      sideBar.toggleSideBar();
    }
  }
  if (i.to) {
    router.push({
      path: i.to,
    });
  }
};
</script>
<style lang="scss" scoped>
.nav-item {
  display: flex;
  align-items: center;
  padding-top: 12px !important;
  padding-bottom: 12px !important;

  li {
    list-style-type: none;
  }
}
.nav-child-item {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

/* Style the sidenav links and the dropdown button */
.sidenav a,
.dropdown-btn {
  padding: 6px 8px 6px 10px;
  text-decoration: none;
  font-size: 16px;
  color: #54667a;
  display: flex;
  align-items: center;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
  justify-content: space-between;
}

.item-slected i {
  color: var(--main-color) !important;
}
.item-slected svg {
  color: var(--main-color) !important;
}
.item-slected {
  color: var(--main-color) !important;
}

/* On mouse-over */
.sidenav a:hover,
.dropdown-btn:hover {
  color: var(--main-color);
}

/* Main content */
.main {
  margin-left: 200px;
  /* Same as the width of the sidenav */
  font-size: 20px;
  /* Increased text to enable scrolling */
  padding: 0 10px;
}

.nav-item {
  &:hover .pi-sidebar {
    color: var(--main-color);
  }
}

/* Add an active class to the active dropdown button */
.active {
  background-color: var(--main-color);
  color: white;
}

.dropdown-container {
  display: none;
  background-color: #fff;
  padding-left: 32px;
}

/* Optional: Style the caret down icon */
.pi-angle-left {
  transition: transform 0.4s ease;
}

/* Some media queries for responsiveness */
@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }

  .sidenav a {
    font-size: 18px;
  }
}
</style>
