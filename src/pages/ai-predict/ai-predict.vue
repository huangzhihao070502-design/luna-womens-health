<template>
  <view class="predict-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">AI智能预测</text>
      <view class="nav-actions">
        <text class="nav-icon">💬</text>
        <text class="nav-icon">🔔</text>
      </view>
    </view>

    <!-- 预测球体 -->
    <view class="predict-sphere-container">
      <view class="sphere-glow"></view>
      <view class="predict-sphere">
        <view class="sphere-content">
          <text class="sphere-label">下次经期预计</text>
          <text class="sphere-date">6月15日</text>
          <text class="sphere-days">还有26天</text>
        </view>
      </view>
      <!-- 装饰星点 -->
      <view class="sparkles">
        <text class="sparkle" v-for="i in 20" :key="i" :style="getSparkleStyle(i)">✦</text>
      </view>
    </view>

    <!-- 准确率 -->
    <view class="accuracy-section">
      <view class="accuracy-header">
        <text class="accuracy-label">预测准确率</text>
        <text class="accuracy-value">96%</text>
      </view>
      <view class="accuracy-bar">
        <view class="accuracy-fill" style="width: 96%"></view>
      </view>
    </view>

    <!-- 未来预测列表 -->
    <view class="future-card glass-card">
      <view class="card-header">
        <text class="card-title">未来6个月预测</text>
        <text class="card-arrow">›</text>
      </view>
      <view class="predict-list">
        <view class="predict-item" v-for="(item, index) in predictList" :key="index">
          <view class="item-left">
            <view class="item-dot" :class="item.type"></view>
            <text class="item-date">{{ item.date }}</text>
          </view>
          <view class="item-right">
            <text class="item-type" :class="item.type">{{ item.label }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const predictList = [
  { date: '6月15日 - 6月20日', type: 'period', label: '预测经期' },
  { date: '7月13日 - 7月18日', type: 'period', label: '预测经期' },
  { date: '8月10日 - 8月15日', type: 'period', label: '预测经期' },
]
const goBack = () => uni.navigateBack()
const getSparkleStyle = (i: number) => {
  return {
    left: Math.random() * 200 - 100 + 150 + 'px',
    top: Math.random() * 200 - 100 + 150 + 'px',
    fontSize: Math.random() * 12 + 8 + 'px',
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: Math.random() * 2 + 's'
  }
}
</script>

<style lang="scss" scoped>
.predict-page {
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
  font-size: 20px;
}
.predict-sphere-container {
  padding-top: 140px;
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 40px;
}
.sphere-glow {
  position: absolute;
  top: 100px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.1) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
}
.predict-sphere {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(168,85,247,0.8) 0%, rgba(59,130,246,0.8) 100%);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 80px rgba(139,92,246,0.4), inset 0 0 40px rgba(255,255,255,0.2);
  position: relative;
}
.sphere-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
}
.sphere-label {
  font-size: 16px;
  opacity: 0.9;
}
.sphere-date {
  font-size: 36px;
  font-weight: 700;
}
.sphere-days {
  font-size: 14px;
  opacity: 0.8;
}
.sparkles {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  pointer-events: none;
}
.sparkle {
  position: absolute;
  color: white;
  animation: sparkle 2s ease-in-out infinite;
}
@keyframes sparkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
.accuracy-section {
  padding: 0 24px;
  margin-bottom: 32px;
}
.accuracy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.accuracy-label {
  font-size: 16px;
  color: #1F2937;
}
.accuracy-value {
  font-size: 20px;
  font-weight: 700;
  color: #8B5CF6;
}
.accuracy-bar {
  width: 100%;
  height: 8px;
  background: rgba(139,92,246,0.1);
  border-radius: 4px;
  overflow: hidden;
}
.accuracy-fill {
  height: 100%;
  background: linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%);
  border-radius: 4px;
}
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 24px;
  margin: 0 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
.predict-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.predict-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.item-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.item-dot.period {
  background: #EC4899;
}
.item-dot.ovulation {
  background: #3B82F6;
}
.item-date {
  font-size: 16px;
  color: #1F2937;
}
.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.item-type {
  font-size: 14px;
  font-weight: 500;
}
.item-type.period {
  color: #EC4899;
}
.item-type.ovulation {
  color: #8B5CF6;
}
.item-arrow {
  font-size: 20px;
  color: #9CA3AF;
}
</style>
