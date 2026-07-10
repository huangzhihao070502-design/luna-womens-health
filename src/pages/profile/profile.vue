<template>
  <view class="profile-page">
    <!-- 顶部渐变背景 -->
    <view class="header-bg"></view>

    <!-- 用户信息卡片 -->
    <view class="user-section">
      <view class="user-card glass-card">
        <view class="avatar-wrapper">
          <view class="avatar">
            <text class="avatar-emoji">{{ userStore.userInfo.avatar || '🌙' }}</text>
          </view>
          <view class="avatar-ring"></view>
        </view>
        <view class="user-info">
          <text class="username">{{ userStore.userInfo.nickname || 'Luna用户' }}</text>
          <text class="user-desc">{{ isGuest ? '游客模式' : '已加入 Luna ' + daysJoined + ' 天' }}</text>
        </view>
        <view class="edit-btn" @click="goToSettings">
          <text class="edit-icon">⚙️</text>
        </view>
      </view>
    </view>

    <!-- 数据统计卡片 -->
    <view class="stats-section">
      <view class="stats-card glass-card">
        <view class="stat-item">
          <text class="stat-value">{{ diaryCount }}</text>
          <text class="stat-label">日记</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ moodCount }}</text>
          <text class="stat-label">心情</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ recordDays }}</text>
          <text class="stat-label">记录天数</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group glass-card">
        <view class="menu-item" @click="goToStatistics">
          <view class="menu-left">
            <view class="menu-icon purple">📊</view>
            <text class="menu-text">数据统计</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-divider"></view>
        <view class="menu-item" @click="goToReport">
          <view class="menu-left">
            <view class="menu-icon pink">📄</view>
            <text class="menu-text">健康报告</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-divider"></view>
        <view class="menu-item" @click="goToMood">
          <view class="menu-left">
            <view class="menu-icon blue">😊</view>
            <text class="menu-text">心情日历</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <view class="menu-group glass-card">
        <view class="menu-item" @click="goToSettings">
          <view class="menu-left">
            <view class="menu-icon gray">⚙️</view>
            <text class="menu-text">设置</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-divider"></view>
        <view class="menu-item" @click="goToAbout">
          <view class="menu-left">
            <view class="menu-icon gray">💜</view>
            <text class="menu-text">关于 Luna</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <!-- 退出登录 -->
      <view v-if="!isGuest" class="menu-group glass-card">
        <view class="menu-item logout" @click="handleLogout">
          <text class="logout-text">退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore, useDiaryStore, useMoodStore, usePeriodStore } from '@/store'

const userStore = useUserStore()
const diaryStore = useDiaryStore()
const moodStore = useMoodStore()
const periodStore = usePeriodStore()

const isGuest = computed(() => userStore.userInfo.isGuest)
const diaryCount = computed(() => diaryStore.entries.length)
const moodCount = computed(() => moodStore.records.length)
const recordDays = computed(() => {
  const dates = new Set<string>()
  diaryStore.entries.forEach(e => dates.add(e.date))
  moodStore.records.forEach(r => dates.add(r.date))
  periodStore.records.forEach(r => dates.add(r.startDate))
  return dates.size
})

const daysJoined = computed(() => {
  if (!userStore.userInfo.createdAt) return 1
  const created = new Date(userStore.userInfo.createdAt)
  const now = new Date()
  return Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) + 1)
})

const goToSettings = () => uni.navigateTo({ url: '/pages/settings/settings' })
const goToAbout = () => uni.navigateTo({ url: '/pages/about/about' })
const goToStatistics = () => uni.navigateTo({ url: '/pages/statistics/statistics' })
const goToMood = () => uni.navigateTo({ url: '/pages/mood/mood' })
const goToReport = () => uni.navigateTo({ url: '/pages/report/report' })

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  padding-bottom: 100px;
  position: relative;
}
.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240px;
  background: linear-gradient(180deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 50%, transparent 100%);
}
.user-section {
  position: relative;
  padding: 80px 20px 0;
}
.user-card {
  display: flex;
  align-items: center;
  padding: 24px;
  gap: 16px;
}
.avatar-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
}
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(139,92,246,0.3);
  position: relative;
  z-index: 1;
}
.avatar-emoji {
  font-size: 36px;
}
.avatar-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid rgba(139,92,246,0.2);
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.username {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
}
.user-desc {
  font-size: 13px;
  color: #9CA3AF;
}
.edit-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(139,92,246,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-icon {
  font-size: 18px;
}
.stats-section {
  padding: 20px;
}
.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-value {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stat-label {
  font-size: 12px;
  color: #9CA3AF;
}
.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(0,0,0,0.06);
}
.menu-section {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.glass-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  transition: background 0.2s ease;

  &:active {
    background: rgba(139,92,246,0.05);
  }
}
.menu-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.menu-icon.purple { background: rgba(139,92,246,0.12); }
.menu-icon.pink { background: rgba(236,72,153,0.12); }
.menu-icon.blue { background: rgba(59,130,246,0.12); }
.menu-icon.gray { background: rgba(107,114,128,0.1); }
.menu-text {
  font-size: 15px;
  color: #1F2937;
  font-weight: 500;
}
.menu-arrow {
  font-size: 22px;
  color: #D1D5DB;
  font-weight: 300;
}
.menu-divider {
  height: 1px;
  background: rgba(0,0,0,0.04);
  margin: 0 20px;
}
.logout {
  justify-content: center;
}
.logout-text {
  font-size: 15px;
  color: #EF4444;
  font-weight: 500;
}
</style>
