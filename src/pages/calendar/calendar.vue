<template>
  <view class="calendar-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <view class="month-select">
        <text class="nav-title">2024年5月</text>
      </view>
      <view class="nav-actions">
        <text class="nav-icon">‹</text>
        <text class="nav-icon">›</text>
      </view>
    </view>

    <!-- 日历区域 -->
    <view class="calendar-area glass-card">
      <!-- 星期表头 -->
      <view class="week-header">
        <text class="week-day" v-for="day in weekDays" :key="day">{{ day }}</text>
      </view>
      <!-- 日期 -->
      <view class="days-grid">
        <!-- 上月日期 -->
        <view class="day-item other-month" v-for="i in 4" :key="'prev'+i">{{ i }}</view>
        <!-- 当月日期 -->
        <view
          v-for="day in mayDays"
          :key="day.date"
          class="day-item"
          :class="getDayClass(day)"
        >
          {{ day.date }}
          <view v-if="day.marker" class="day-marker" :class="day.marker"></view>
        </view>
      </view>

      <!-- 图例 -->
      <view class="legend">
        <view class="legend-item">
          <view class="legend-dot period"></view>
          <text class="legend-text">经期</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot ovulation"></view>
          <text class="legend-text">排卵期</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot fertile"></view>
          <text class="legend-text">易孕期</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot predict"></view>
          <text class="legend-text">预测经期</text>
        </view>
      </view>
    </view>

    <!-- 当日详情卡片 -->
    <view class="day-detail glass-card">
      <view class="detail-header">
        <text class="detail-title">5月20日 · 经期第3天</text>
        <text class="detail-arrow">›</text>
      </view>
      <view class="detail-stats">
        <view class="stat-item">
          <text class="stat-icon">💧</text>
          <text class="stat-label">流量</text>
          <text class="stat-value">中等</text>
        </view>
        <view class="divider-v"></view>
        <view class="stat-item">
          <text class="stat-icon">😣</text>
          <text class="stat-label">痛经</text>
          <text class="stat-value">轻度</text>
        </view>
        <view class="divider-v"></view>
        <view class="stat-item">
          <text class="stat-icon">😌</text>
          <text class="stat-label">情绪</text>
          <text class="stat-value">平静</text>
        </view>
      </view>
      <view class="view-record">
        <text class="view-text">查看记录</text>
        <text class="view-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
// 5月日期数据
const mayDays = Array.from({length: 31}, (_, i) => {
  const date = i + 1
  let marker = ''
  // 模拟标记数据，和设计图一致
  if (date === 7) marker = 'period-start'
  if ([8,9,16,17].includes(date)) marker = 'period'
  if ([13,18].includes(date)) marker = 'predict'
  if (date === 14) marker = 'selected'
  if (date === 24) marker = 'ovulation'
  if (date === 11) marker = 'fertile'
  return { date, marker }
})
const getDayClass = (day: any) => {
  return {
    'day-selected': day.marker === 'selected',
    'day-period': day.marker === 'period' || day.marker === 'period-start',
    'day-predict': day.marker === 'predict',
    'day-ovulation': day.marker === 'ovulation',
  }
}
const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.calendar-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  padding: 100px 20px 40px;
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
}
.month-select {
  flex: 1;
  text-align: center;
}
.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}
.nav-actions {
  display: flex;
  gap: 16px;
}
.nav-icon {
  font-size: 24px;
  color: #1F2937;
}
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 20px;
  margin-bottom: 20px;
}
.calendar-area {
  padding: 24px 20px;
}
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 16px;
}
.week-day {
  text-align: center;
  font-size: 14px;
  color: #6B7280;
  padding: 8px 0;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 24px;
}
.day-item {
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #1F2937;
  position: relative;
  border-radius: 20px;
}
.day-item.other-month {
  color: #D1D5DB;
}
.day-period {
  background: #EC4899;
  color: white;
}
.day-predict {
  border: 2px solid #F9A8D4;
  color: #EC4899;
}
.day-selected {
  background: #8B5CF6;
  color: white;
}
.day-ovulation {
  border: 2px solid #93C5FD;
  color: #3B82F6;
}
.day-marker {
  position: absolute;
  bottom: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.day-marker.period-start { background: #3B82F6; }
.day-marker.fertile { background: #93C5FD; }
.legend {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.legend-dot.period { background: #EC4899; }
.legend-dot.ovulation { background: #3B82F6; border: 2px solid #93C5FD; width: 8px; height: 8px; }
.legend-dot.fertile { background: #93C5FD; }
.legend-dot.predict { background: transparent; border: 2px solid #F9A8D4; width: 8px; height: 8px; }
.legend-text {
  font-size: 12px;
  color: #6B7280;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}
.detail-arrow {
  font-size: 24px;
  color: #9CA3AF;
}
.detail-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0;
  background: rgba(139,92,246,0.05);
  border-radius: 16px;
  margin-bottom: 16px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-icon {
  font-size: 24px;
}
.stat-label {
  font-size: 12px;
  color: #6B7280;
}
.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
}
.divider-v {
  width: 1px;
  height: 40px;
  background: rgba(0,0,0,0.08);
}
.view-record {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.view-text {
  font-size: 15px;
  color: #8B5CF6;
}
.view-arrow {
  font-size: 20px;
  color: #8B5CF6;
}
</style>
