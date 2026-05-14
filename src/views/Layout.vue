<template>
  <div class="layout-container">
    <!-- Network Status Geek Feel -->
    <div class="global-ping-badge">
      <div class="ping-dot"></div>
      12ms
    </div>

    <router-view class="main-content-area"></router-view>

    <!-- ChatBot FAB -->
    <div class="chatbot-fab" @click="showChat">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </div>

    <!-- Bottom Navigation Bar -->
    <nav class="glass-nav">
      <router-link to="/" class="glass-nav-item">
        <div class="glass-icon-wrapper">
          <svg class="glass-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <span class="glass-label">指挥中心</span>
      </router-link>
      <router-link to="/bank" class="glass-nav-item">
        <div class="glass-icon-wrapper">
          <svg class="glass-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        </div>
        <span class="glass-label">战备题库</span>
      </router-link>
      <router-link to="/battle" class="glass-nav-item">
        <div class="glass-icon-wrapper">
          <svg class="glass-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>
        </div>
        <span class="glass-label">实战挑战</span>
      </router-link>
      <router-link to="/profile" class="glass-nav-item">
        <div class="glass-icon-wrapper">
          <svg class="glass-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <span class="glass-label">我的档案</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

function showChat() {
  console.log("Chat clicked - implement modal via state later");
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px; /* Space for FAB and thicker Floating Nav Bar */
}
</style>
