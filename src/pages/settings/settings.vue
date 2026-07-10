<template>
  <view class="settings-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">设置</text>
      <view class="nav-spacer"></view>
    </view>

    <!-- 账号信息 -->
    <view class="section-card glass-card">
      <text class="section-label">账号</text>
      <view class="setting-item" @click="handleEditProfile">
        <text class="setting-icon">👤</text>
        <text class="setting-text">个人信息</text>
        <text class="setting-value">{{ userStore.userInfo.nickname || '未设置' }}</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="handleBindPhone">
        <text class="setting-icon">📱</text>
        <text class="setting-text">手机号</text>
        <text class="setting-value">{{ maskedPhone }}</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="handleChangePassword">
        <text class="setting-icon">🔒</text>
        <text class="setting-text">修改密码</text>
        <text class="setting-arrow">›</text>
      </view>
    </view>

    <!-- 经期设置 -->
    <view class="section-card glass-card">
      <text class="section-label">经期设置</text>
      <view class="setting-item">
        <text class="setting-icon">📅</text>
        <text class="setting-text">周期长度</text>
        <view class="setting-control">
          <text class="control-btn" @click="adjustCycle(-1)">−</text>
          <text class="control-value">{{ periodStore.cycleLength }}天</text>
          <text class="control-btn" @click="adjustCycle(1)">+</text>
        </view>
      </view>
      <view class="setting-item">
        <text class="setting-icon">🩸</text>
        <text class="setting-text">经期长度</text>
        <view class="setting-control">
          <text class="control-btn" @click="adjustPeriod(-1)">−</text>
          <text class="control-value">{{ periodStore.periodLength }}天</text>
          <text class="control-btn" @click="adjustPeriod(1)">+</text>
        </view>
      </view>
    </view>

    <!-- 通知设置 -->
    <view class="section-card glass-card">
      <text class="section-label">通知</text>
      <view class="setting-item">
        <text class="setting-icon">🔔</text>
        <text class="setting-text">经期提醒</text>
        <LunaSwitch v-model="periodReminder" />
      </view>
      <view class="setting-item">
        <text class="setting-icon">🌙</text>
        <text class="setting-text">睡眠提醒</text>
        <LunaSwitch v-model="sleepReminder" />
      </view>
      <view class="setting-item">
        <text class="setting-icon">💊</text>
        <text class="setting-text">服药提醒</text>
        <LunaSwitch v-model="medicineReminder" />
      </view>
      <view class="setting-item">
        <text class="setting-icon">📊</text>
        <text class="setting-text">周报推送</text>
        <LunaSwitch v-model="weeklyReport" />
      </view>
    </view>

    <!-- 隐私 -->
    <view class="section-card glass-card">
      <text class="section-label">隐私</text>
      <view class="setting-item">
        <text class="setting-icon">🔐</text>
        <text class="setting-text">应用锁</text>
        <LunaSwitch v-model="appLock" />
      </view>
      <view class="setting-item" @click="handleClearCache">
        <text class="setting-icon">🗑️</text>
        <text class="setting-text">清除缓存</text>
        <text class="setting-value">{{ cacheSize }}</text>
        <text class="setting-arrow">›</text>
      </view>
    </view>

    <!-- 关于 -->
    <view class="section-card glass-card">
      <text class="section-label">其他</text>
      <view class="setting-item" @click="goToAbout">
        <text class="setting-icon">ℹ️</text>
        <text class="setting-text">关于 Luna</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="handleFeedback">
        <text class="setting-icon">💬</text>
        <text class="setting-text">意见反馈</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="handleRate">
        <text class="setting-icon">⭐</text>
        <text class="setting-text">去评分</text>
        <text class="setting-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-area">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
      <text class="logout-hint">退出后本地数据不会被清除</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore, usePeriodStore } from '@/store'

const userStore = useUserStore()
const periodStore = usePeriodStore()

const periodReminder = ref(true)
const sleepReminder = ref(true)
const medicineReminder = ref(false)
const weeklyReport = ref(true)
const appLock = ref(false)
const cacheSize = ref('2.3 MB')

const maskedPhone = computed(() => {
  const phone = userStore.userInfo.phone
  if (!phone) return '未绑定'
  return phone.slice(0, 3) + '****' + phone.slice(-4)
})

const adjustCycle = (delta: number) => {
  periodStore.cycleLength = Math.max(21, Math.min(45, periodStore.cycleLength + delta))
  uni.setStorageSync('period_cycleLength', periodStore.cycleLength.toString())
}

const adjustPeriod = (delta: number) => {
  periodStore.periodLength = Math.max(2, Math.min(10, periodStore.periodLength + delta))
  uni.setStorageSync('period_periodLength', periodStore.periodLength.toString())
}

const handleEditProfile = () => {
  uni.navigateTo({ url: '/pages/profile/profile' })
}

const handleBindPhone = () => {
  uni.showToast({ title: '手机号绑定功能开发中', icon: 'none' })
}

const handleChangePassword = () => {
  uni.showToast({ title: '密码修改功能开发中', icon: 'none' })
}

const handleClearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除所有缓存数据吗？本地记录不会被清除。',
    success: (res: any) => {
      if (res.confirm) {
        cacheSize.value = '0 KB'
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    }
  })
}

const handleFeedback = () => {
  uni.showToast({ title: '感谢反馈！我们会尽快处理', icon: 'none' })
}

const handleRate = () => {
  uni.showToast({ title: '感谢支持！', icon: 'none' })
}

const goToAbout = () => {
  uni.navigateTo({ url: '/pages/about/about' })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res: any) => {
      if (res.confirm) {
        userStore.logout()
      }
    }
  })
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.settings-page {
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
.glass-card:first-of-type {
  margin-top: 108px;
}
.section-label {
  font-size: 13px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 12px;
}

/* 单项设置 */
.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(139,92,246,0.06);
}
.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.setting-item:first-of-type {
  padding-top: 0;
}
.setting-icon {
  font-size: 20px;
  width: 28px;
  text-align: center;
}
.setting-text {
  font-size: 15px;
  color: #1F2937;
  flex: 1;
}
.setting-value {
  font-size: 14px;
  color: #9CA3AF;
}
.setting-arrow {
  font-size: 20px;
  color: #D1D5DB;
  margin-left: 4px;
}

/* 控制按钮 */
.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}
.control-btn {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: rgba(139,92,246,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #8B5CF6;
  font-weight: 500;
}
.control-value {
  font-size: 15px;
  color: #1F2937;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

/* 退出 */
.logout-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 20px;
}
.logout-btn {
  width: 100%;
  height: 50px;
  background: white;
  border-radius: 25px;
  color: #EF4444;
  font-size: 16px;
  font-weight: 500;
  border: none;
  line-height: 50px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.logout-btn::after {
  border: none;
}
.logout-hint {
  font-size: 12px;
  color: #9CA3AF;
}
</style>
