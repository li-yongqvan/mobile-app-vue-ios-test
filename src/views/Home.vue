<template>
  <div class="home-view">
    <!-- 头部导航区 -->
    <header class="header">
      <div class="user-info">
        <div class="avatar">{{ userInitial }}</div>
        <div class="greeting">
          <span class="welcome">欢迎回来</span>
          <h1 class="username">{{ username }} · 今日备考</h1>
        </div>
      </div>
      <div class="status-badge" :class="{ offline: !isOnline }">
        <div class="status-dot"></div>
        {{ isOnline ? '系统在线' : '离线模式' }}
      </div>
    </header>

    <!-- 核心滚动区 -->
    <main class="main-content">
      
      <!-- 总积分与段位横幅 Banner -->
      <section class="highlight-banner">
        <div class="banner-item">
          <div class="icon-circle icon-gold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
          </div>
          <div class="banner-data">
            <span class="label">总积分</span>
            <h2 class="value">{{ score }}</h2>
          </div>
        </div>
        <div class="banner-divider"></div>
        <div class="banner-item">
          <div class="icon-circle icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <div class="banner-data">
            <span class="label">对战段位</span>
            <h2 class="value">猎鹰 V</h2>
          </div>
        </div>
      </section>

      <!-- 核心数据 2x2网格 -->
      <section class="data-grid">
        <div class="data-card">
          <div class="card-header">
            <span class="card-title">今日训练时长</span>
            <div class="card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
          </div>
          <div class="card-body">
            <div class="big-data">01:24<span class="unit">:00</span></div>
            <div class="tag tag-success">↑ 23分钟+</div>
          </div>
        </div>

        <div class="data-card fixed-height">
          <div class="card-header">
            <span class="card-title">实战待办</span>
            <div class="card-icon card-icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></div>
          </div>
          <div class="card-body layout-column-center">
            <div class="big-data">{{ dailyPending }}</div><span class="unit-text">项</span>
          </div>
        </div>
      </section>

      <!-- 训练模块 -->
      <div class="section-title">
        <h2>训练模块</h2>
        <p>选择今日训练内容</p>
      </div>

      <section class="module-grid">
        <div class="module-card" @click="startDailyTask">
          <div class="module-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
          <h3 class="module-name">每日挑战</h3>
          <p class="module-desc">预设 {{ dailyTotal }} 道实战题目，深度培养战斗自觉。</p>
          <div class="module-tag">今日待完成</div>
        </div>

        <div class="module-card" @click="startAiAnalysis">
          <div class="module-icon icon-purple"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 22 5-5"></path><path d="M12 18 c 3.31 0 6 -2.69 6 -6 s -2.69 -6 -6 -6 s -6 2.69 -6 6 s 2.69 6 6 6 z"></path></svg></div>
          <h3 class="module-name">智能分析</h3>
          <p class="module-desc">基于大模型的弱点深度研判档案。</p>
          <div class="module-tag tag-purple">AI 智能</div>
        </div>
      </section>
      
      <!-- 悬浮主按钮 -->
      <div class="floating-action-area" style="position: relative; margin-top: 300px; padding: 20px;">
        <button class="primary-btn" style="width: 100%;" @click="startDailyTask">开始今日任务 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';
import api from '../api';

const userStore = useUserStore();
const router = useRouter();
const isOnline = ref(true);

function startDailyTask() {
  router.push('/quiz');
}

function startAiAnalysis() {
  alert("系统提示: 正在连接警示大模型，生成私人研判报告...");
}
// Data from Store
const username = computed(() => userStore.userInfo?.username || '猎鹰特警');
const userInitial = computed(() => username.value.charAt(0).toUpperCase());
const score = computed(() => userStore.userInfo?.score || 0);

// Daily Challenge Config
const dailyTotal = ref(10);
const dailyAnswered = ref(0);
const dailyPending = computed(() => Math.max(0, dailyTotal.value - dailyAnswered.value));

onMounted(async () => {
  // 1. 获取最新个人信息
  try {
    const meRes = await api.get('/auth/me');
    if (meRes && meRes.code === 0) {
      userStore.updateUserInfo(meRes.data);
    } else if (meRes && meRes.data) {
      // If it returns raw format or just username
      userStore.updateUserInfo(meRes.data);
    }
  } catch (err) {
    console.warn("[API] 个人信息数据拉取异常", err.message || err);
  }

  // 2. 获取今日挑战配置 (带有容错兜底)
  try {
    const configRes = await api.get('/daily_new/config');
    if (configRes && configRes.code === 0) {
      dailyTotal.value = configRes.data.question_count || 10;
      dailyAnswered.value = configRes.data.answered_count || 0;
    } else if (configRes && configRes.question_count) {
      dailyTotal.value = configRes.question_count;
      dailyAnswered.value = configRes.answered_count || 0;
    }
  } catch (err) {
    console.warn("[API] 每日挑战功能可能尚未上线，启用兜底数据", err.message || err);
    dailyTotal.value = 10;
    dailyAnswered.value = 0;
  }
});
</script>

<style scoped>
.home-view {
  padding: 20px;
}
/* Remaining global styles are auto-imported via style.css */
</style>
