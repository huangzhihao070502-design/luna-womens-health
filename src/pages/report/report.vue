<template>
  <view class="report-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">健康报告</text>
      <view class="nav-actions">
        <text class="nav-icon">📤</text>
      </view>
    </view>

    <!-- 报告头部 -->
    <view class="report-header">
      <view class="report-glow"></view>
      <view class="report-header-content">
        <text class="report-label">Luna 健康报告</text>
        <text class="report-date">{{ reportDate }}</text>
        <view class="health-score">
          <text class="score-value">{{ healthScore }}</text>
          <text class="score-unit">分</text>
        </view>
        <text class="score-label">综合健康评分</text>
        <view class="score-bar">
          <view class="score-fill" :style="{ width: healthScore + '%' }"></view>
        </view>
      </view>
    </view>

    <!-- 经期健康 -->
    <view class="section-card glass-card">
      <view class="section-header">
        <view class="section-icon pink">📅</view>
        <text class="section-title">经期健康</text>
        <text class="section-status good">良好</text>
      </view>
      <view class="section-stats">
        <view class="mini-stat">
          <text class="mini-value">{{ periodStore.cycleLength }}</text>
          <text class="mini-label">周期天数</text>
        </view>
        <view class="mini-stat">
          <text class="mini-value">{{ periodStore.periodLength }}</text>
          <text class="mini-label">经期天数</text>
        </view>
        <view class="mini-stat">
          <text class="mini-value">{{ periodStore.records.length }}</text>
          <text class="mini-label">记录次数</text>
        </view>
      </view>
      <view class="section-tip">
        <text class="tip-dot"></text>
        <text class="tip-msg">周期规律，经期长度在正常范围内</text>
      </view>
    </view>

    <!-- 睡眠健康 -->
    <view class="section-card glass-card">
      <view class="section-header">
        <view class="section-icon purple">🌙</view>
        <text class="section-title">睡眠健康</text>
        <text class="section-status" :class="sleepStatusClass">{{ sleepStatusText }}</text>
      </view>
      <view class="section-stats">
        <view class="mini-stat">
          <text class="mini-value">{{ sleepStore.avgSleepHours }}</text>
          <text class="mini-label">平均时长(h)</text>
        </view>
        <view class="mini-stat">
          <text class="mini-value">{{ sleepStore.records.length }}</text>
          <text class="mini-label">记录天数</text>
        </view>
        <view class="mini-stat">
          <text class="mini-value">{{ avgSleepQuality }}</text>
          <text class="mini-label">平均质量</text>
        </view>
      </view>
      <view class="section-tip">
        <text class="tip-dot" :class="sleepStatusClass"></text>
        <text class="tip-msg">{{ sleepAdvice }}</text>
      </view>
    </view>

    <!-- 心情分析 -->
    <view class="section-card glass-card">
      <view class="section-header">
        <view class="section-icon orange">💛</view>
        <text class="section-title">心情分析</text>
        <text class="section-status good">稳定</text>
      </view>
      <view class="mood-preview">
        <view class="mood-items">
          <view class="mood-item" v-for="(mood, index) in topMoods" :key="index">
            <text class="mood-emoji">{{ mood.icon }}</text>
            <text class="mood-label">{{ mood.label }}</text>
            <text class="mood-count">{{ mood.count }}次</text>
          </view>
        </view>
      </view>
      <view class="section-tip">
        <text class="tip-dot"></text>
        <text class="tip-msg">近期情绪状态稳定，建议保持运动习惯</text>
      </view>
    </view>

    <!-- AI 综合建议 -->
    <view class="ai-advice-card glass-card">
      <view class="card-header">
        <text class="card-title">🤖 AI 综合建议</text>
      </view>
      <view class="advice-list">
        <view class="advice-item">
          <text class="advice-num">01</text>
          <text class="advice-text">您的周期比较规律，建议继续保持记录，AI会为您提供更精准的预测。</text>
        </view>
        <view class="advice-item">
          <text class="advice-num">02</text>
          <text class="advice-text">近期睡眠时长略低于推荐值(7-9小时)，建议提前30分钟入睡。</text>
        </view>
        <view class="advice-item">
          <text class="advice-num">03</text>
          <text class="advice-text">经期前后注意补充铁质和维生素B群，适当减少咖啡因摄入。</text>
        </view>
        <view class="advice-item">
          <text class="advice-num">04</text>
          <text class="advice-text">建议每周进行3-4次中等强度运动，有助于缓解经期不适。</text>
        </view>
      </view>
    </view>

    <!-- 导出按钮 -->
    <view class="export-area">
      <button class="export-btn" @click="handleExport">
        <text>📄 导出完整报告</text>
      </button>
      <text class="export-hint">支持 PDF 格式导出</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePeriodStore, useSleepStore, useMoodStore } from '@/store'

const periodStore = usePeriodStore()
const sleepStore = useSleepStore()
const moodStore = useMoodStore()

const reportDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const healthScore = computed(() => {
  let score = 85
  if (sleepStore.avgSleepHours < 7) score -= 10
  if (sleepStore.avgSleepHours >= 7 && sleepStore.avgSleepHours <= 9) score += 5
  if (periodStore.records.length < 3) score -= 5
  return Math.min(100, Math.max(60, score))
})

const avgSleepQuality = computed(() => {
  if (sleepStore.records.length === 0) return 0
  const sum = sleepStore.records.slice(-7).reduce((acc, r) => acc + r.quality, 0)
  return Math.round(sum / Math.min(sleepStore.records.length, 7))
})

const sleepStatusText = computed(() => {
  const h = sleepStore.avgSleepHours
  if (h >= 7 && h <= 9) return '良好'
  if (h >= 6) return '一般'
  return '需改善'
})

const sleepStatusClass = computed(() => {
  const h = sleepStore.avgSleepHours
  if (h >= 7 && h <= 9) return 'good'
  if (h >= 6) return 'warn'
  return 'poor'
})

const sleepAdvice = computed(() => {
  const h = sleepStore.avgSleepHours
  if (h >= 7 && h <= 9) return '睡眠时长充足，质量良好，请继续保持'
  if (h >= 6) return '睡眠时长偏少，建议目标7-9小时'
  return '睡眠严重不足，请优先改善睡眠习惯'
})

const topMoods = computed(() => {
  const moodMap: Record<string, { icon: string; count: number; label: string }> = {}
  moodStore.records.forEach(r => {
    if (!moodMap[r.mood]) {
      moodMap[r.mood] = { icon: r.moodIcon, count: 0, label: r.mood }
    }
    moodMap[r.mood].count++
  })
  return Object.values(moodMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
})

const handleExport = () => {
  uni.showToast({ title: '报告导出功能开发中', icon: 'none' })
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.report-page {
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
.nav-actions {
  width: 60px;
  text-align: right;
  font-size: 20px;
}

/* 报告头部 */
.report-header {
  margin: 108px 20px 20px;
  padding: 32px 24px;
  background: linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(236,72,153,0.9) 100%);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}
.report-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  border-radius: 50%;
}
.report-header-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.report-label {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}
.report-date {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 8px;
}
.health-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.score-value {
  font-size: 56px;
  font-weight: 700;
  color: white;
  line-height: 1;
}
.score-unit {
  font-size: 18px;
  color: rgba(255,255,255,0.8);
}
.score-label {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
}
.score-bar {
  width: 200px;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}
.score-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.6s ease;
}

/* 分项卡片 */
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 24px;
  margin: 0 20px 20px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.section-icon.pink { background: rgba(236,72,153,0.1); }
.section-icon.purple { background: rgba(139,92,246,0.1); }
.section-icon.orange { background: rgba(245,158,11,0.1); }
.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1F2937;
  flex: 1;
}
.section-status {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}
.section-status.good {
  background: rgba(16,185,129,0.1);
  color: #10B981;
}
.section-status.warn {
  background: rgba(245,158,11,0.1);
  color: #F59E0B;
}
.section-status.poor {
  background: rgba(239,68,68,0.1);
  color: #EF4444;
}
.section-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}
.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.mini-value {
  font-size: 28px;
  font-weight: 700;
  color: #8B5CF6;
}
.mini-label {
  font-size: 12px;
  color: #9CA3AF;
}
.section-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(139,92,246,0.04);
  border-radius: 10px;
}
.tip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  flex-shrink: 0;
}
.tip-dot.warn { background: #F59E0B; }
.tip-dot.poor { background: #EF4444; }
.tip-dot.good { background: #10B981; }
.tip-msg {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

/* 心情预览 */
.mood-items {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}
.mood-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: rgba(139,92,246,0.04);
  border-radius: 14px;
}
.mood-emoji {
  font-size: 28px;
}
.mood-label {
  font-size: 13px;
  color: #4B5563;
}
.mood-count {
  font-size: 12px;
  color: #9CA3AF;
}

/* AI建议 */
.ai-advice-card .card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.ai-advice-card .card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}
.advice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.advice-item {
  display: flex;
  gap: 12px;
}
.advice-num {
  font-size: 14px;
  font-weight: 700;
  color: #8B5CF6;
  flex-shrink: 0;
  padding-top: 1px;
}
.advice-text {
  font-size: 14px;
  color: #4B5563;
  line-height: 1.6;
}

/* 导出 */
.export-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
}
.export-btn {
  width: 260px;
  height: 48px;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  border-radius: 24px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  line-height: 48px;
}
.export-btn::after {
  border: none;
}
.export-hint {
  font-size: 12px;
  color: #9CA3AF;
}
</style>
