<template>
  <view class="sleep-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">睡眠分析</text>
      <view class="nav-actions">
        <text class="nav-icon" @click="showAddModal = true">+</text>
      </view>
    </view>

    <!-- 睡眠概览卡片 -->
    <view class="summary-card glass-card">
      <view class="summary-header">
        <text class="summary-title">睡眠概览</text>
        <text class="summary-date">最近7天</text>
      </view>
      <view class="summary-stats">
        <view class="stat-item">
          <text class="stat-value">{{ sleepStore.avgSleepHours }}</text>
          <text class="stat-unit">小时</text>
          <text class="stat-label">平均睡眠</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ avgQuality }}</text>
          <text class="stat-unit">分</text>
          <text class="stat-label">平均质量</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ bestDay }}</text>
          <text class="stat-unit">h</text>
          <text class="stat-label">最佳睡眠</text>
        </view>
      </view>
    </view>

    <!-- 睡眠趋势图 -->
    <view class="chart-section">
      <SleepChart
        title="睡眠趋势（最近7天）"
        :data="sleepStore.weekData"
        :maxValue="12"
        :showValue="true"
        @select="onSelectBar"
      />
    </view>

    <!-- 最近记录 -->
    <view class="records-card glass-card">
      <view class="card-header">
        <text class="card-title">最近记录</text>
        <text class="card-arrow">›</text>
      </view>
      <view class="records-list">
        <view class="record-item" v-for="(record, index) in recentRecords" :key="index">
          <view class="record-left">
            <text class="record-date">{{ formatDateLabel(record.date) }}</text>
            <text class="record-time">{{ record.bedTime }} - {{ record.wakeTime }}</text>
          </view>
          <view class="record-right">
            <text class="record-hours">{{ record.hours.toFixed(1) }}h</text>
            <view class="record-quality" :class="getQualityClass(record.quality)">
              <text>{{ record.quality }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 助眠小贴士 -->
    <view class="tips-card glass-card">
      <view class="card-header">
        <text class="card-title">💡 助眠小贴士</text>
      </view>
      <view class="tips-list">
        <view class="tip-item">
          <text class="tip-icon">🌡️</text>
          <text class="tip-text">保持卧室温度在 18-22°C 之间</text>
        </view>
        <view class="tip-item">
          <text class="tip-icon">📱</text>
          <text class="tip-text">睡前 1 小时避免使用电子设备</text>
        </view>
        <view class="tip-item">
          <text class="tip-icon">☕</text>
          <text class="tip-text">下午 2 点后避免摄入咖啡因</text>
        </view>
        <view class="tip-item">
          <text class="tip-icon">🧘</text>
          <text class="tip-text">睡前做 10 分钟冥想或深呼吸</text>
        </view>
      </view>
    </view>

    <!-- 添加记录弹窗 -->
    <view class="modal-mask" v-if="showAddModal" @click="showAddModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">添加睡眠记录</text>

        <view class="form-group">
          <text class="form-label">入睡时间</text>
          <picker mode="time" :value="formBedTime" @change="onBedTimeChange">
            <view class="picker-view">{{ formBedTime }}</view>
          </picker>
        </view>

        <view class="form-group">
          <text class="form-label">起床时间</text>
          <picker mode="time" :value="formWakeTime" @change="onWakeTimeChange">
            <view class="picker-view">{{ formWakeTime }}</view>
          </picker>
        </view>

        <view class="form-group">
          <text class="form-label">睡眠质量 ({{ formQuality }}分)</text>
          <view class="quality-slider">
            <view
              v-for="i in 10"
              :key="i"
              class="quality-star"
              :class="{ active: i * 10 <= formQuality }"
              @click="formQuality = i * 10"
            >★</view>
          </view>
        </view>

        <view class="modal-buttons">
          <button class="modal-btn cancel" @click="showAddModal = false">取消</button>
          <button class="modal-btn confirm" @click="saveRecord">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSleepStore } from '@/store'
import { formatDate } from '@/utils'

const sleepStore = useSleepStore()
const showAddModal = ref(false)
const formBedTime = ref('23:00')
const formWakeTime = ref('07:00')
const formQuality = ref(80)

const recentRecords = computed(() => {
  return [...sleepStore.records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7)
})

const avgQuality = computed(() => {
  if (sleepStore.records.length === 0) return 0
  const recent = sleepStore.records.slice(-7)
  const sum = recent.reduce((acc, r) => acc + r.quality, 0)
  return Math.round(sum / recent.length)
})

const bestDay = computed(() => {
  if (sleepStore.records.length === 0) return 0
  const recent = sleepStore.records.slice(-7)
  const best = Math.max(...recent.map(r => r.hours))
  return Math.round(best * 10) / 10
})

const formatDateLabel = (dateStr: string) => {
  const today = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return `周${days[date.getDay()]}`
}

const getQualityClass = (quality: number) => {
  if (quality >= 85) return 'quality-good'
  if (quality >= 70) return 'quality-ok'
  return 'quality-poor'
}

const onSelectBar = (item: any, index: number) => {
  console.log('Selected:', item)
}

const onBedTimeChange = (e: any) => {
  formBedTime.value = e.detail.value
}

const onWakeTimeChange = (e: any) => {
  formWakeTime.value = e.detail.value
}

const saveRecord = () => {
  const bedParts = formBedTime.value.split(':')
  const wakeParts = formWakeTime.value.split(':')
  const bedH = parseInt(bedParts[0])
  const bedM = parseInt(bedParts[1])
  const wakeH = parseInt(wakeParts[0])
  const wakeM = parseInt(wakeParts[1])

  let hours = wakeH - bedH + (wakeM - bedM) / 60
  if (hours < 0) hours += 24

  sleepStore.addRecord({
    date: formatDate(),
    hours: Math.round(hours * 10) / 10,
    quality: formQuality.value,
    bedTime: formBedTime.value,
    wakeTime: formWakeTime.value
  })

  showAddModal.value = false
  uni.showToast({ title: '记录已保存', icon: 'success' })
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.sleep-page {
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
  display: flex;
  gap: 20px;
  width: 60px;
  justify-content: flex-end;
}
.nav-icon {
  font-size: 28px;
  color: #8B5CF6;
  font-weight: 300;
}

/* 概要卡片 */
.summary-card {
  margin: 108px 20px 0;
  padding: 24px;
}
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}
.summary-date {
  font-size: 13px;
  color: #9CA3AF;
}
.summary-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #8B5CF6;
}
.stat-unit {
  font-size: 13px;
  color: #6B7280;
}
.stat-label {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
}
.stat-divider {
  width: 1px;
  height: 48px;
  background: rgba(139,92,246,0.15);
}

/* 图表面板 */
.chart-section {
  margin: 20px;
}

/* 共用卡片 */
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 24px;
  margin: 0 20px 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}
.card-arrow {
  font-size: 24px;
  color: #9CA3AF;
}

/* 记录列表 */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(139,92,246,0.04);
  border-radius: 12px;
}
.record-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.record-date {
  font-size: 15px;
  color: #1F2937;
  font-weight: 500;
}
.record-time {
  font-size: 13px;
  color: #9CA3AF;
}
.record-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.record-hours {
  font-size: 18px;
  font-weight: 700;
  color: #8B5CF6;
}
.record-quality {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}
.quality-good {
  background: rgba(16,185,129,0.1);
  color: #10B981;
}
.quality-ok {
  background: rgba(245,158,11,0.1);
  color: #F59E0B;
}
.quality-poor {
  background: rgba(239,68,68,0.1);
  color: #EF4444;
}

/* 小贴士 */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.tip-icon {
  font-size: 20px;
}
.tip-text {
  font-size: 14px;
  color: #4B5563;
  line-height: 1.5;
}

/* 弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  width: 100%;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 32px 24px 48px;
}
.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 24px;
  display: block;
  text-align: center;
}
.form-group {
  margin-bottom: 20px;
}
.form-label {
  font-size: 15px;
  color: #4B5563;
  margin-bottom: 8px;
  display: block;
}
.picker-view {
  padding: 14px 16px;
  background: #F3F4F6;
  border-radius: 12px;
  font-size: 16px;
  color: #1F2937;
}
.quality-slider {
  display: flex;
  gap: 6px;
}
.quality-star {
  font-size: 28px;
  color: #E5E7EB;
  transition: color 0.2s;
}
.quality-star.active {
  color: #F59E0B;
}
.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}
.modal-btn {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  line-height: 48px;
}
.modal-btn::after {
  border: none;
}
.modal-btn.cancel {
  background: #F3F4F6;
  color: #6B7280;
}
.modal-btn.confirm {
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  color: white;
}
</style>
