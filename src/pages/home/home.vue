<template>
  <view class="home-page">
    <!-- 顶部问候区 -->
    <view class="header">
      <view class="greeting">
        <text class="hi-text">Hi,</text>
        <text class="question-text">今天感觉怎么样？</text>
      </view>
      <view class="header-right">
        <view class="notification-icon">
          🔔
          <view class="red-dot"></view>
        </view>
        <view class="avatar">👩</view>
      </view>
    </view>

    <!-- 经期状态卡片 -->
    <view class="period-card">
      <view class="period-left">
        <text class="period-day">经期第 3 天</text>
        <text class="period-end">预计结束：还有2天</text>
        <button class="record-btn" @click="goToRecord">记录经期</button>
      </view>
      <view class="period-right">
        <view class="progress-ring">
          <view class="ring-bg"></view>
          <view class="ring-progress"></view>
          <view class="ring-text">72%</view>
        </view>
      </view>
    </view>

    <!-- 功能图标栏 -->
    <view class="function-bar">
      <view class="function-item" @click="goToRecord">
        <view class="func-icon pink">📅</view>
        <text class="func-text">记录经期</text>
      </view>
      <view class="function-item" @click="goToPredict">
        <view class="func-icon purple">🧠</view>
        <text class="func-text">AI 预测</text>
      </view>
      <view class="function-item" @click="goToSleep">
        <view class="func-icon purple">🌙</view>
        <text class="func-text">睡眠分析</text>
      </view>
      <view class="function-item" @click="goToReport">
        <view class="func-icon red">📄</view>
        <text class="func-text">健康报告</text>
      </view>
    </view>

    <!-- AI今日建议卡片 -->
    <view class="ai-card glass-card">
      <view class="card-header">
        <text class="card-title">AI 今日建议</text>
        <text class="card-arrow">›</text>
      </view>
      <view class="suggestions">
        <view class="suggest-item">
          <view class="suggest-icon blue">💧</view>
          <text class="suggest-text">建议早睡，保持充足睡眠</text>
        </view>
        <view class="suggest-item">
          <view class="suggest-icon orange">💧</view>
          <text class="suggest-text">建议多喝水，保持身体水分</text>
        </view>
        <view class="suggest-item">
          <view class="suggest-icon yellow">☀️</view>
          <text class="suggest-text">建议避免剧烈运动，注意休息</text>
        </view>
      </view>
    </view>

    <!-- 最近记录卡片 -->
    <view class="recent-card glass-card" @click="goToCalendar">
      <view class="card-header">
        <text class="card-title">最近记录</text>
        <text class="card-arrow">›</text>
      </view>
      <view class="recent-list">
        <view class="recent-item">
          <view class="recent-heart">❤️</view>
          <text class="recent-text">5月20日 · 经期第3天 · 流量中等</text>
        </view>
        <view class="recent-item">
          <view class="recent-heart">💤</view>
          <text class="recent-text">昨晚睡眠7小时48分 · 评分89</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const goToRecord = () => uni.navigateTo({ url: '/pages/record/record' })
const goToPredict = () => uni.navigateTo({ url: '/pages/ai-predict/ai-predict' })
const goToSleep = () => uni.navigateTo({ url: '/pages/sleep/sleep' })
const goToReport = () => uni.navigateTo({ url: '/pages/report/report' })
const goToCalendar = () => uni.navigateTo({ url: '/pages/calendar/calendar' })
</script>

<style lang="scss" scoped>
.home-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  padding: 60px 20px 40px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.greeting {
  display: flex;
  flex-direction: column;
}
.hi-text {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
}
.question-text {
  font-size: 18px;
  color: #1F2937;
  margin-top: 4px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.notification-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.red-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
}
.avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.period-card {
  background: linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(236,72,153,0.18) 100%);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  backdrop-filter: blur(20px);
}
.period-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.period-day {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
}
.period-end {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 12px;
}
.record-btn {
  width: 120px;
  height: 40px;
  background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border: none;
  margin: 0;
  padding: 0;
  line-height: 40px;
}
.record-btn::after {
  border: none;
}
.period-right {
  position: relative;
}
.progress-ring {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(#8B5CF6 0%, #3B82F6 72%, rgba(255,255,255,0.3) 72%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring-bg {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
}
.ring-text {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 24px;
  font-weight: 700;
}
.function-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.func-icon {
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(139,92,246,0.1);
}
.func-icon.pink { background: rgba(236,72,153,0.1); }
.func-icon.purple { background: rgba(139,92,246,0.1); }
.func-icon.red { background: rgba(239,68,68,0.1); }
.func-text {
  font-size: 14px;
  color: #1F2937;
  font-weight: 500;
}
.glass-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 8px 32px rgba(139,92,246,0.08);
  padding: 20px;
  margin-bottom: 20px;
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
.suggestions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.suggest-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.suggest-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.suggest-icon.blue { background: rgba(59,130,246,0.1); }
.suggest-icon.orange { background: rgba(249,115,22,0.1); }
.suggest-icon.yellow { background: rgba(234,179,8,0.1); }
.suggest-text {
  font-size: 15px;
  color: #4B5563;
}
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(139,92,246,0.05);
  border-radius: 12px;
}
.recent-heart {
  font-size: 20px;
}
.recent-text {
  font-size: 14px;
  color: #4B5563;
}
</style>
