<template>
  <div class="quiz-page">
    <!-- Header: Progress & Exit -->
    <header class="quiz-header">
      <button class="exit-btn" @click="handleExit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
      <div class="progress-container">
        <div class="progress-text">正在分析第 {{ currentIndex + 1 }} / {{ totalQuestions }} 题</div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: progressWidth + '%' }"></div>
        </div>
      </div>
      <div class="timer-badge">{{ formattedTime }}</div>
    </header>

    <main class="quiz-content" v-if="currentQuestion">
      <!-- Question Card -->
      <transition name="slide">
        <div :key="currentQuestion.id" class="question-card">
          <div class="question-type">{{ currentQuestion.category || '公安基础' }}</div>
          <h2 class="question-title">{{ currentQuestion.content }}</h2>
          
          <!-- Options List -->
          <div class="options-list">
            <div 
              v-for="opt in parsedOptions" 
              :key="opt.key"
              class="option-item"
              :class="getOptionClass(opt.key)"
              @click="handleSelect(opt.key)"
            >
              <div class="option-key">{{ opt.key }}</div>
              <div class="option-text">{{ opt.text }}</div>
              <div class="option-status-icon" v-if="selectedKey === opt.key || (showResult && opt.key === currentQuestion.answer)">
                 <svg v-if="isCorrectSelection(opt.key)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 <svg v-else-if="selectedKey === opt.key && !isCorrect" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Feedback / Analysis Panel (Only shows on error) -->
      <transition name="fade">
        <div class="analysis-panel" v-if="showAnalysis">
          <div class="analysis-header">
            <div class="status-tag error">研判失误</div>
            <div class="correct-answer">正确答案：<span>{{ currentQuestion.answer || currentQuestion.correct_answer }}</span></div>
          </div>
          <div class="analysis-body">
            <h3>战术解析</h3>
            <p>{{ currentQuestion.analysis || '系统暂无详细解析，请参考相关法律条文进行深度研判。' }}</p>
          </div>
          <button class="primary-btn next-btn" @click="nextQuestion">继续下一题 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
        </div>
      </transition>
    </main>

    <!-- Initial Loading State -->
    <div class="quiz-loading" v-else-if="loading">
      <div class="loader"></div>
      <p>正在从总署调取绝密卷宗...</p>
    </div>

    <!-- Completion State -->
    <div class="quiz-finished" v-else-if="finished">
      <div class="finish-card">
        <div class="finish-icon">🏆</div>
        <h2>演训圆满完成</h2>
        <p>您已完成本次 10 题专项研判</p>
        <div class="finish-stats">
          <div class="stat">
            <span class="label">正确率</span>
            <span class="value">{{ accuracy }}%</span>
          </div>
        </div>
        <button class="primary-btn finish-btn" @click="handleExit">返回指挥中心</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();

// State
const loading = ref(true);
const finished = ref(false);
const questionList = ref([]);
const currentIndex = ref(0);
const selectedKey = ref(null);
const showResult = ref(false);
const showAnalysis = ref(false);
const isCorrect = ref(false);
const scoreCount = ref(0);

// Timer
const timerSeconds = ref(0);
let timerInterval = null;

// Lifecycle
onMounted(() => {
  fetchQuestions();
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

// Computed
const currentQuestion = computed(() => questionList.value[currentIndex.value]);
const totalQuestions = computed(() => questionList.value.length || 10);
const progressWidth = computed(() => ((currentIndex.value + 1) / totalQuestions.value) * 100);
const accuracy = computed(() => Math.round((scoreCount.value / totalQuestions.value) * 100));

const formattedTime = computed(() => {
  const m = Math.floor(timerSeconds.value / 60).toString().padStart(2, '0');
  const s = (timerSeconds.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

const parsedOptions = computed(() => {
  if (!currentQuestion.value) return [];
  const q = currentQuestion.value;
  return [
    { key: 'A', text: q.option_a || q.options?.A },
    { key: 'B', text: q.option_b || q.options?.B },
    { key: 'C', text: q.option_c || q.options?.C },
    { key: 'D', text: q.option_d || q.options?.D }
  ].filter(o => o.text); // Only show non-empty options
});

// Methods
async function fetchQuestions() {
  try {
    loading.value = true;
    const res = await api.get('/questions?limit=10');
    // Note: The API might return the list directly or wrapped in data
    if (Array.isArray(res)) {
      questionList.value = res;
    } else if (res.data && Array.isArray(res.data)) {
      questionList.value = res.data;
    }
  } catch (err) {
    console.error("加载卷宗失败:", err);
  } finally {
    loading.value = false;
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timerSeconds.value++;
  }, 1000);
}

async function handleSelect(key) {
  if (showResult.value) return; // Prevent double clicking
  
  selectedKey.value = key;
  showResult.value = true;
  
  try {
    const res = await api.post('/answers', {
      question_id: currentQuestion.value.id,
      user_answer: key
    });
    
    // Logic from Option 2:
    // If correct -> flash green and move to next in 0.5s
    // If wrong -> flash red and show analysis, wait for user
    
    // In our simplified API response handling, we check against currentQuestion.answer
    isCorrect.value = (key === (currentQuestion.value.answer || currentQuestion.value.correct_answer));
    
    if (isCorrect.value) {
      scoreCount.value++;
      setTimeout(() => {
        nextQuestion();
      }, 600);
    } else {
      showAnalysis.value = true;
    }
  } catch (err) {
    console.error("提交判研失败:", err);
    // Fallback logic if API fails for some reason
  }
}

function nextQuestion() {
  if (currentIndex.value + 1 < totalQuestions.value) {
    currentIndex.value++;
    // Reset state for next card
    selectedKey.value = null;
    showResult.value = false;
    showAnalysis.value = false;
    isCorrect.value = false;
  } else {
    finished.value = true;
  }
}

function handleExit() {
  router.push('/bank');
}

function getOptionClass(key) {
  if (!showResult.value) {
    return selectedKey.value === key ? 'selected' : '';
  }
  
  // After selection
  const ans = currentQuestion.value.answer || currentQuestion.value.correct_answer;
  if (key === ans) return 'correct';
  if (selectedKey.value === key && !isCorrect.value) return 'wrong';
  return 'disabled';
}

function isCorrectSelection(key) {
  const ans = currentQuestion.value.answer || currentQuestion.value.correct_answer;
  return showResult.value && key === ans;
}
</script>

<style scoped>
.quiz-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 0 20px 40px;
  display: flex;
  flex-direction: column;
}

.quiz-header {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 15px;
}

.exit-btn {
  background: none;
  border: none;
  color: var(--text-sub);
  padding: 8px;
}

.progress-container {
  flex: 1;
}

.progress-text {
  font-size: 11px;
  color: var(--text-sub);
  margin-bottom: 4px;
  font-family: monospace;
}

.progress-bar-bg {
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary-blue);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.timer-badge {
  background: rgba(255,255,255,0.05);
  padding: 4px 10px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  color: var(--text-main);
}

.quiz-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
}

.question-card {
  background: var(--card-bg);
  border-radius: var(--radius-huge);
  padding: 30px 24px;
  box-shadow: var(--shadow-large);
  margin-bottom: 24px;
}

.question-type {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-blue);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
}

.question-title {
  font-size: 20px;
  line-height: 1.5;
  color: var(--text-main);
  margin-bottom: 30px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: var(--radius-large);
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.option-key {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 15px;
  color: var(--text-sub);
}

.option-text {
  flex: 1;
  font-size: 16px;
  color: var(--text-main);
}

/* Option States */
.option-item.selected {
  border-color: var(--primary-blue);
  background-color: rgba(59, 130, 246, 0.05);
}

.option-item.correct {
  border-color: var(--accent-green);
  background-color: rgba(16, 185, 129, 0.1);
}
.option-item.correct .option-key {
  background: var(--accent-green);
  color: #fff;
}
.option-item.correct .option-status-icon {
  color: var(--accent-green);
}

.option-item.wrong {
  border-color: var(--accent-red);
  background-color: rgba(239, 68, 68, 0.1);
}
.option-item.wrong .option-key {
  background: var(--accent-red);
  color: #fff;
}
.option-item.wrong .option-status-icon {
  color: var(--accent-red);
}

.option-item.disabled {
  opacity: 0.6;
}

/* Analysis Panel */
.analysis-panel {
  background: rgba(239, 68, 68, 0.05);
  border-radius: var(--radius-huge);
  padding: 24px;
  border-left: 4px solid var(--accent-red);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-tag.error {
  color: var(--accent-red);
  font-weight: 800;
  font-size: 14px;
}

.correct-answer span {
  font-weight: 800;
  color: var(--accent-green);
  font-size: 18px;
}

.analysis-body h3 {
  font-size: 12px;
  color: var(--text-sub);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.analysis-body p {
  color: var(--text-main);
  line-height: 1.6;
  font-size: 15px;
  margin-bottom: 24px;
}

.next-btn {
  width: 100%;
}

/* States */
.quiz-loading, .quiz-finished {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loader {
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.finish-card {
  background: var(--card-bg);
  padding: 40px 30px;
  border-radius: var(--radius-huge);
  width: 100%;
  box-shadow: var(--shadow-large);
}

.finish-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.finish-stats {
  margin: 30px 0;
  padding: 20px;
  background: rgba(255,255,255,0.03);
  border-radius: var(--radius-large);
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat .label {
  font-size: 12px;
  color: var(--text-sub);
}

.stat .value {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent-gold);
}

/* Transitions */
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter-from {
  opacity: 0;
}
</style>
