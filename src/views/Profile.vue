<template>
  <div class="profile-view">
    <div class="user-info header" style="padding:0; margin-bottom: 30px;">
      <h1 class="username" style="font-size: 24px; color: var(--text-main);">我的档案</h1>
    </div>

    <div class="profile-card">
      <div class="avatar-large">{{ userInitial }}</div>
      <h2>{{ username }}</h2>
      <p class="role">警务实战人员</p>
    </div>

    <div class="settings-list">
      <button class="menu-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const username = computed(() => userStore.userInfo?.username || '未知名');
const userInitial = computed(() => username.value.charAt(0).toUpperCase());

function handleLogout() {
  userStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.profile-view { padding: 20px; text-align: center; }
.profile-card { background: var(--card-bg); border-radius: var(--radius-huge); padding: 40px 20px; box-shadow: var(--shadow-medium); margin-bottom: 30px; }
.avatar-large { width: 80px; height: 80px; border-radius: 50%; background: var(--primary-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(59,130,246,0.3); }
h2 { color: var(--text-main); font-size: 20px; margin-bottom: 4px; }
.role { color: var(--text-sub); font-size: 14px; }
.menu-btn { width: 100%; padding: 16px; background: rgba(239, 68, 68, 0.1); color: var(--accent-red); border: none; border-radius: var(--radius-large); font-weight: 700; cursor: pointer; }
</style>
