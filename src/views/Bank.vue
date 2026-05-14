<template>
  <div class="bank-view">
    <div class="user-info header" style="padding:0; margin-bottom: 20px;">
      <h1 class="username" style="font-size: 24px; color: var(--text-main);">战备题库</h1>
    </div>

    <section class="dual-card-container">
      <!-- 个人错题 -->
      <div class="dual-card" @click="goWrongBank">
        <div class="dual-card-icon" style="background-color: rgba(239, 68, 68, 0.15); color: #EF4444;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h2 class="dual-card-title">个人错题研判</h2>
        <p class="dual-card-desc">专注于您的错误记录，针对性补强薄弱知识点，扫清盲区。</p>
        <button class="dual-btn dual-btn-red">进入错题库 <span class="badge">{{ wrongCount }}题</span></button>
      </div>

      <!-- 公共题库 -->
      <div class="dual-card" @click="goPublicBank">
        <div class="dual-card-icon" style="background-color: rgba(59, 130, 246, 0.15); color: #3B82F6;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
        </div>
        <h2 class="dual-card-title">全国公共题库</h2>
        <p class="dual-card-desc">收录全国真题 5 万+，多维度筛选，配合联考大纲精准练习。</p>
        <button class="dual-btn dual-btn-blue">进入公共题库</button>
      </div>
    </section>

    <!-- 知识掌握情况分析面板 -->
    <section class="mastery-dashboard">
      <div class="mastery-header">掌握情况分析</div>
      <h2 class="mastery-title">知识掌握情况研判</h2>
      <div class="mastery-desc">根据近期答题记录，您需要提升。建议优先进入错题。</div>
      <div class="mastery-stats">
        <div class="stat-group">
          <span class="stat-label">待强化</span>
          <div class="stat-value gold">{{ wrongCount }}<span class="stat-unit">题</span></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const wrongCount = ref(0);

onMounted(async () => {
  try {
    const listRes = await api.get('/wrong/list');
    if (listRes.data && listRes.data.length !== undefined) {
      wrongCount.value = listRes.data.length;
    }
  } catch (err) {
    console.error("加载错题数据失败", err);
  }
});

function goWrongBank() {
  alert("错题档案库初始化中...即将进入错题特训模式！");
  // Temporarily pushing to quiz, this should be modified when the Wrong component is built
  router.push('/quiz');
}

function goPublicBank() {
  router.push('/quiz');
}
</script>

<style scoped>
.bank-view { padding: 20px; }
.badge { background: rgba(0,0,0,0.2); padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px; }
</style>
