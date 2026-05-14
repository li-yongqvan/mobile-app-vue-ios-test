<template>
  <div class="login-page">
    <div class="login-header">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <h1>警务实战系统</h1>
      <p>授权您的战备档案以继续</p>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label>标识代码 (Username)</label>
        <input type="text" v-model="username" required placeholder="请输入账号" />
      </div>
      <div class="form-group">
        <label>安防密码 (Password)</label>
        <input type="password" v-model="password" required placeholder="请输入密码" />
      </div>

      <button type="submit" :disabled="loading" class="primary-btn login-btn">
        {{ loading ? '验证中...' : '接入系统' }}
      </button>
      <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import api from '../api';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

const router = useRouter();
const userStore = useUserStore();

async function handleLogin() {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
      remember_me: false
    });
    
    if (res && res.code === 0) {
      userStore.login(res.data.token, res.data.user);
      router.push('/');
    } else {
      errorMsg.value = res.msg || '认证失败，请检查凭证流';
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = err.message || '鉴权服务器离线或验证异常';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  padding: 40px 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-header {
  text-align: center;
  margin-bottom: 40px;
}
.login-header svg {
  color: var(--primary-blue);
  margin-bottom: 16px;
}
.login-header h1 {
  font-size: 28px;
  color: var(--text-main);
  font-weight: 800;
  margin-bottom: 8px;
}
.login-header p {
  color: var(--text-sub);
  font-size: 14px;
}

.login-form {
  background: var(--card-bg);
  padding: 30px 20px;
  border-radius: var(--radius-huge);
  box-shadow: var(--shadow-medium);
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 13px;
  color: var(--text-sub);
  margin-bottom: 8px;
  font-family: monospace;
}
.form-group input {
  width: 100%;
  padding: 14px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-large);
  color: var(--text-main);
  font-size: 16px;
}
.form-group input:focus {
  outline: none;
  border-color: var(--primary-blue);
}
.login-btn {
  width: 100%;
  padding: 16px;
  margin-top: 10px;
}
.error-msg {
  color: var(--accent-red);
  font-size: 13px;
  text-align: center;
  margin-top: 16px;
}
</style>
