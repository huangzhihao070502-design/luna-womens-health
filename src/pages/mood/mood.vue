<template>
  <view class="mood-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">心情记录</text>
      <view class="nav-spacer"></view>
    </view>

    <!-- 日期显示 -->
    <view class="date-header">
      <text class="date-text">{{ todayLabel }}</text>
      <text class="date-sub">记录此刻的心情吧</text>
    </view>

    <!-- 心情选择区 -->
    <view class="mood-selector glass-card">
      <text class="section-label">今天的心情</text>
      <view class="mood-grid">
        <view
          v-for="mood in moodOptions"
          :key="mood.value"
          class="mood-item"
          :class="{ selected: selectedMood === mood.value }"
          @click="selectedMood = mood.value"
        >
          <text class="mood-emoji">{{ mood.icon }}</text>
          <text class="mood-name">{{ mood.label }}</text>
        </view>
      </view>
    </view>

    <!-- 影响因素 -->
    <view class="factors-card glass-card">
      <text class="section-label">影响因素（可多选）</text>
      <view class="factors-grid">
        <view
          v-for="factor in factors"
          :key="factor.value"
          class="factor-item"
          :class="{ active: selectedFactors.includes(factor.value) }"
          @click="toggleFactor(factor.value)"
        >
          <text class="factor-icon">{{ factor.icon }}</text>
          <text class="factor-name">{{ factor.label }}</text>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="note-card glass-card">
      <text class="section-label">备注</text>
      <textarea
        v-model="note"
        class="note-input"
        placeholder="记录更多细节..."
        placeholder-class="note-placeholder"
        :maxlength="200"
      />
      <text class="note-count">{{ note.length }}/200</text>
    </view>

    <!-- 保存按钮 -->
    <view class="save-area">
      <button class="save-btn" @click="handleSave" :disabled="!selectedMood">
        保存记录
      </button>
    </view>

    <!-- 历史记录 -->
    <view class="history-card glass-card" v-if="moodStore.records.length > 0">
      <text class="section-label">最近记录</text>
      <view class="history-list">
        <view class="history-item" v-for="record in recentRecords" :key="record.id">
          <view class="history-left">
            <text class="history-emoji">{{ record.moodIcon }}</text>
            <view class="history-info">
              <text class="history-mood">{{ record.mood }}</text>
              <text class="history-date">{{ record.date }}</text>
            </view>
          </view>
          <text class="history-note" v-if="record.note">{{ record.note }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMoodStore } from '@/store'
import { formatDate } from '@/utils'

const moodStore = useMoodStore()

const moodOptions = [
  { value: 'amazing', label: '超棒', icon: '🤩' },
  { value: 'happy', label: '开心', icon: '😊' },
  { value: 'calm', label: '平静', icon: '😌' },
  { value: 'tired', label: '疲惫', icon: '😫' },
  { value: 'sad', label: '难过', icon: '😢' },
  { value: 'angry', label: '生气', icon: '😤' },
  { value: 'anxious', label: '焦虑', icon: '😰' },
  { value: 'excited', label: '兴奋', icon: '🤗' },
]

const factors = [
  { value: 'sleep', label: '睡眠', icon: '😴' },
  { value: 'work', label: '工作', icon: '💼' },
  { value: 'exercise', label: '运动', icon: '🏃' },
  { value: 'diet', label: '饮食', icon: '🍽️' },
  { value: 'social', label: '社交', icon: '👥' },
  { value: 'weather', label: '天气', icon: '🌤️' },
  { value: 'period', label: '经期', icon: '📅' },
  { value: 'health', label: '健康', icon: '💊' },
]

const selectedMood = ref('')
const selectedFactors = ref<string[]>([])
const note = ref('')

const todayLabel = computed(() => {
  const d = new Date()
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${days[d.getDay()]}`
})

const recentRecords = computed(() => {
  return moodStore.records.slice(0, 5)
})

const toggleFactor = (value: string) => {
  const idx = selectedFactors.value.indexOf(value)
  if (idx === -1) {
    selectedFactors.value.push(value)
  } else {
    selectedFactors.value.splice(idx, 1)
  }
}

const handleSave = () => {
  if (!selectedMood.value) {
    uni.showToast({ title: '请选择心情', icon: 'none' })
    return
  }

  const mood = moodOptions.find(m => m.value === selectedMood.value)!

  moodStore.addRecord({
    date: formatDate(),
    mood: mood.label,
    moodIcon: mood.icon,
    note: note.value,
    factors: [...selectedFactors.value]
  })

  uni.showToast({ title: '心情已记录 💫', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 800)
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.mood-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  padding-bottom: 40px;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88px;
  padding-top: 44px;
  background: rgba(248,247,252,0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  z-index: 99;
}
.nav-back {
  font-size: 32px;
  font-weight: 300;
  color: #1F2937;
  width: 60px;
}
.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}
.nav-spacer {
  width: 60px;
}

.date-header {
  padding-top: 120px;
  padding-left: 24px;
  padding-bottom: 8px;
  margin-bottom: 16px;
}
.date-text {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  display: block;
  margin-bottom: 4px;
}
.date-sub {
  font-size: 14px;
  color: #9CA3AF;
}

/* 共用卡片 */
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 20px;
  margin: 0 20px 16px;
}
.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  display: block;
  margin-bottom: 16px;
}

/* 心情选择 */
.mood-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: 16px;
  background: #F9FAFB;
  width: calc(25% - 9px);
  transition: all 0.2s;
  border: 2px solid transparent;

  &.selected {
    background: rgba(139,92,246,0.08);
    border-color: #8B5CF6;
    transform: scale(1.05);
  }
}
.mood-emoji {
  font-size: 36px;
}
.mood-name {
  font-size: 13px;
  color: #4B5563;
  font-weight: 500;
}

/* 因素选择 */
.factors-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.factor-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 20px;
  background: #F9FAFB;
  border: 1.5px solid transparent;
  transition: all 0.2s;

  &.active {
    background: rgba(139,92,246,0.08);
    border-color: #8B5CF6;
  }
}
.factor-icon {
  font-size: 16px;
}
.factor-name {
  font-size: 14px;
  color: #4B5563;
}

/* 备注 */
.note-input {
  width: 100%;
  min-height: 80px;
  background: #F9FAFB;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  color: #1F2937;
  box-sizing: border-box;
}
.note-placeholder {
  color: #D1D5DB;
}
.note-count {
  font-size: 12px;
  color: #9CA3AF;
  text-align: right;
  display: block;
  margin-top: 8px;
}

/* 保存按钮 */
.save-area {
  padding: 8px 20px 24px;
}
.save-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  border-radius: 26px;
  color: white;
  font-size: 17px;
  font-weight: 600;
  border: none;
  line-height: 52px;
  box-shadow: 0 8px 24px rgba(139,92,246,0.3);
}
.save-btn::after {
  border: none;
}
.save-btn[disabled] {
  opacity: 0.5;
  box-shadow: none;
}

/* 历史记录 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(139,92,246,0.04);
  border-radius: 12px;
}
.history-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.history-emoji {
  font-size: 28px;
}
.history-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.history-mood {
  font-size: 15px;
  font-weight: 500;
  color: #1F2937;
}
.history-date {
  font-size: 12px;
  color: #9CA3AF;
}
.history-note {
  font-size: 13px;
  color: #6B7280;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
