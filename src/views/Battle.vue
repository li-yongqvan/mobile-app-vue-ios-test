<template>
  <div class="battle-view">
    <div class="user-info header" style="padding:0; margin-bottom: 20px;">
      <h1 class="username" style="font-size: 24px; color: var(--text-main);">实战挑战</h1>
    </div>

    <section class="battle-arena">
      <button class="match-button" @click="startMatch">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>
        进入对战
      </button>
    </section>

    <!-- 排行榜 -->
    <section class="ranking-panel data-card">
      <div class="card-header">
        <span class="card-title">全校猎鹰排行榜</span>
        <div class="card-icon card-icon-gold">🏆</div>
      </div>
      <div class="card-body">
        <ul>
          <li v-for="(user, index) in topUsers" :key="index" class="rank-item">
            <span class="rank-badge">{{ index + 1 }}</span>
            <span class="user-name">{{ user.username || '匿名警员' }}</span>
            <span class="user-score">{{ user.score }}分</span>
          </li>
          <li v-if="topUsers.length === 0" class="empty-state">榜单数据加载中...</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const topUsers = ref([]);

function startMatch() {
  alert("系统提示: 当前时段未开启 1v1 排位赛季，请先在题库与挑战中积累实力！");
}

onMounted(async () => {
  try {
    const res = await api.get('/scores/all');
    // Adapt to both direct array return and {"code": 0, "data": []} format
    if (Array.isArray(res)) {
      topUsers.value = res.slice(0, 10);
    } else if (res && res.data && Array.isArray(res.data)) {
      topUsers.value = res.data.slice(0, 10);
    }
  } catch(err) {
    console.warn("[API] 榜单数据加载可能尚未部署", err.message || err);
  }
});
</script>

<style scoped>
.battle-view { padding: 20px; }
.ranking-panel { margin-top: 20px; }
.rank-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
.rank-badge { width: 24px; height: 24px; border-radius: 50%; background: rgba(245, 158, 11, 0.2); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; }
.user-name { flex: 1; margin-left: 12px; font-weight: 600; color: var(--text-main); }
.user-score { font-family: monospace; color: var(--text-sub); font-size: 14px; }
.empty-state { padding: 20px; text-align: center; color: var(--text-sub); }
</style>
