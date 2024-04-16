import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStorage } from '@vueuse/core';

export interface UserData {
  alg: string;
  exp: number;
  iat: number;
  sub: string;
}

export const useUserSession = defineStore('userSession', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  const token = useStorage('token', '');
  const user = useStorage('user', {});
  const permissions = useStorage('permissions', new Array<string>());
  const loading = ref(true);

  const isLoggedIn = computed(
    () => token.value !== undefined && token.value !== '',
  );

  function setUser(userInfo: UserData) {
    user.value = userInfo;
  }

  function setToken(newToken: string) {
    token.value = newToken;
  }

  function setPermission(newPermission: Array<string>) {
    permissions.value = newPermission;
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading;
  }

  async function logoutUser() {
    token.value = '';
    user.value = '';
    permissions.value = [];
  }

  return {
    user,
    token,
    permissions,
    isLoggedIn,
    loading,
    logoutUser,
    setUser,
    setToken,
    setLoading,
    setPermission,
  } as const;
});
