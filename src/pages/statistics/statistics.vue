<template>
  <view class="stats-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">数据统计</text>
      <view class="nav-spacer"></view>
    </view>

    <!-- 经期周期统计 -->
    <view class="section-card glass-card">
      <view class="section-header">
        <text class="section-title">📅 经期统计</text>
        <text class="section-period">{{ periodStore.records.length }}条记录</text>
      </view>
      <view class="ring-row">
        <view class="ring-item">
          <ProgressRing :percentage="cycleRegularity" :size="100" :strokeWidth="8" />
          <text class="ring-label">周期规律度</text>
        </view>
        <view class="ring-item">
          <ProgressRing :percentage="periodCompletion" :size="100" :strokeWidth="8" />
          <text class="ring-label">记录完整度</text>
        </view>
      </view>
      <view class="stats-row">
        <view class="stats-item">
          <text class="stats-value">{{ periodStore.cycleLength }}</text>
          <text class="stats-label">平均周期(天)</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ periodStore.periodLength }}</text>
          <text class="stats-label">平均经期(天)</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ periodStore.records.length }}</text>
          <text class="stats-label">总记录数</text>
        </view>
      </view>
    </view>

    <!-- 睡眠统计 -->
    <view class="section-card glass-card">
      <view class="section-header">
        <text class="section-title">🌙 睡眠统计</text>
        <text class="section-period">{{ sleepStore.records.length }}条记录</text>
      </view>
      <!-- 睡眠趋势 -->
      <SleepChart
        title=""
        :data="sleepStore.weekData"
        :maxValue="12"
        :showValue="true"
      />
      <view class="stats-row" style="margin-top: 20px;">
        <view class="stats-item">
          <text class="stats-value">{{ sleepStore.avgSleepHours }}</text>
          <text class="stats-label">平均时长(h)</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ bestSleepDay }}</text>
          <text class="stats-label">最佳日(h)</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ sleepQualityAvg }}</text>
          <text class="stats-label">平均质量</text>
        </view>
      </view>
    </view>

    <!-- 心情统计 -->
    <view class="section-card glass-card" v-if="moodDistribution.length > 0">
      <view class="section-header">
        <text class="section-title">💛 心情分布</text>
        <text class="section-period">{{ moodStore.records.length }}条记录</text>
      </view>
      <view class="mood-bars">
        <view class="mood-bar-item" v-for="item in moodDistribution" :key="item.mood">
          <view class="mood-bar-header">
            <text class="mood-bar-emoji">{{ item.icon }}</text>
            <text class="mood-bar-label">{{ item.mood }}</text>
            <text class="mood-bar-count">{{ item.count }}次</text>
          </view>
          <view class="mood-bar-track">
            <view
              class="mood-bar-fill"
              :style="{ width: (item.count / maxMoodCount * 100) + '%' }"
              :class="getMoodBarColor(item.mood)"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 心情分布（无数据时） -->
    <view class="section-card glass-card" v-else>
      <view class="section-header">
        <text class="section-title">💛 心情分布</text>
      </view>
      <view class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">还没有心情记录</text>
        <text class="empty-sub">开始记录你的每日心情吧</text>
      </view>
    </view>

    <!-- 总览摘要 -->
    <view class="summary-card glass-card">
      <text class="summary-title">📊 本月摘要</text>
      <view class="summary-grid">
        <view class="summary-item">
          <text class="summary-num">{{ totalRecordsThisMonth }}</text>
          <text class="summary-desc">本月记录</text>
        </view>
        <view class="summary-item">
          <text class="summary-num">{{ currentStreak }}</text>
          <text class="summary-desc">连续天数</text>
        </view>
        <view class="summary-item">
          <text class="summary-num">{{ periodStore.daysUntilNextPeriod ?? '--' }}</text>
          <text class="summary-desc">距下次经期(天)</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePeriodStore, useSleepStore, useMoodStore } from '@/store'

const periodStore = usePeriodStore()
const sleepStore = useSleepStore()
const moodStore = useMoodStore()

// 周期规律度（基于记录数量）
const cycleRegularity = computed(() => {
  return Math.min(100, periodStore.records.length * 15 + 40)
})

// 记录完整度
const periodCompletion = computed(() => {
  return Math.min(100, periodStore.records.length * 12 + 20)
})

const bestSleepDay = computed(() => {
  if (sleepStore.records.length === 0) return 0
  const recent = sleepStore.records.slice(-7)
  return Math.round(Math.max(...recent.map(r => r.hours)) * 10) / 10
})

const sleepQualityAvg = computed(() => {
  if (sleepStore.records.length === 0) return 0
  const recent = sleepStore.records.slice(-7)
  const sum = recent.reduce((acc, r) => acc + r.quality, 0)
  return Math.round(sum / recent.length)
})

// 心情分布
const moodDistribution = computed(() => {
  const map: Record<string, { icon: string; mood: string; count: number }> = {}
  moodStore.records.forEach(r => {
    if (!map[r.mood]) {
      map[r.mood] = { icon: r.moodIcon, mood: r.mood, count: 0 }
    }
    map[r.mood].count++
  })
  return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5)
})

const maxMoodCount = computed(() => {
  return Math.max(...moodDistribution.value.map(m => m.count), 1)
})

const getMoodBarColor = (mood: string) => {
  const colors: Record<string, string> = {
    '开心': 'bar-pink',
    '超棒': 'bar-purple',
    '平静': 'bar-blue',
    '疲惫': 'bar-orange',
    '难过': 'bar-gray',
    '生气': 'bar-red',
    '焦虑': 'bar-yellow',
    '兴奋': 'bar-green',
  }
  return colors[mood] || 'bar-purple'
}

// 本月总记录数
const totalRecordsThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const diaryCount = 0 // diary store entries this month
  const moodCount = moodStore.records.filter(r => r.date.startsWith(thisMonth)).length
  const periodCount = periodStore.records.filter(r => r.startDate.startsWith(thisMonth)).length
  const sleepCount = sleepStore.records.filter(r => r.date.startsWith(thisMonth)).length
  return diaryCount + moodCount + periodCount + sleepCount
})

// 连续记录天数
const currentStreak = computed(() => {
  // Simple streak: count consecutive days with any record
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const hasRecord =
      moodStore.records.some(r => r.date === dateStr) ||
      periodStore.records.some(r => r.startDate === dateStr) ||
      sleepStore.records.some(r => r.date === dateStr)
    if (hasRecord) streak++
    else break
  }
  return streak
})

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.stats-page {
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
.nav-spacer { width: 60px; }

/* 卡片 */
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 20px;
  margin: 0 20px 16px;
}
.section-card:first-of-type {
  margin-top: 108px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1F2937;
}
.section-period {
  font-size: 13px;
  color: #9CA3AF;
}

/* 环图 */
.ring-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
}
.ring-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.ring-label {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

/* 数字统计行 */
.stats-row {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid rgba(139,92,246,0.08);
}
.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: #8B5CF6;
}
.stats-label {
  font-size: 12px;
  color: #9CA3AF;
}

/* 心情分布 */
.mood-bars {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mood-bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mood-bar-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mood-bar-emoji {
  font-size: 18px;
}
.mood-bar-label {
  font-size: 14px;
  color: #4B5563;
  flex: 1;
}
.mood-bar-count {
  font-size: 13px;
  color: #9CA3AF;
}
.mood-bar-track {
  height: 8px;
  background: rgba(139,92,246,0.06);
  border-radius: 4px;
  overflow: hidden;
}
.mood-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}
.bar-pink { background: linear-gradient(90deg, #EC4899, #F472B6); }
.bar-purple { background: linear-gradient(90deg, #8B5CF6, #A78BFA); }
.bar-blue { background: linear-gradient(90deg, #3B82F6, #60A5FA); }
.bar-orange { background: linear-gradient(90deg, #F59E0B, #FBBF24); }
.bar-gray { background: linear-gradient(90deg, #6B7280, #9CA3AF); }
.bar-red { background: linear-gradient(90deg, #EF4444, #F87171); }
.bar-yellow { background: linear-gradient(90deg, #EAB308, #FACC15); }
.bar-green { background: linear-gradient(90deg, #10B981, #34D399); }

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  gap: 8px;
}
.empty-icon {
  font-size: 40px;
}
.empty-text {
  font-size: 15px;
  color: #6B7280;
  font-weight: 500;
}
.empty-sub {
  font-size: 13px;
  color: #9CA3AF;
}

/* 摘要 */
.summary-title {
  font-size: 17px;
  font-weight: 600;
  color: #1F2937;
  display: block;
  margin-bottom: 16px;
}
.summary-grid {
  display: flex;
  justify-content: space-around;
}
.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.summary-num {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.summary-desc {
  font-size: 12px;
  color: #9CA3AF;
}
</style>
