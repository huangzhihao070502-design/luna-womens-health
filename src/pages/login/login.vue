<template>
  <view class="login-page">
    <!-- Logo和标题 -->
    <view class="header">
      <view class="logo">
        <view class="logo-icon">
          <view class="logo-moon">
            <view class="moon-shape"></view>
          </view>
        </view>
      </view>
      <text class="welcome-title">欢迎回来</text>
      <text class="welcome-subtitle">登录以继续使用 Luna</text>
    </view>

    <!-- 输入表单 -->
    <view class="form-area">
      <LunaInput v-model="phone" placeholder="输入手机号" icon="phone" type="tel" :maxlength="11" />
      <LunaInput
        v-model="code"
        placeholder="输入验证码"
        icon="locked"
        type="number"
        :maxlength="6"
        :buttonText="countdown > 0 ? `${countdown}s` : '获取验证码'"
        :buttonDisabled="countdown > 0"
        @button-click="getCode"
      />
    </view>

    <!-- 登录按钮 -->
    <LunaButton type="primary" size="large" text="登录" @click="handleLogin" />

    <!-- 其他登录方式 -->
    <view class="other-login">
      <text class="other-text">或使用其他方式登录</text>
      <view class="third-party">
        <view class="third-icon">🍎</view>
        <view class="third-icon wechat" @click="handleWechatLogin">💬</view>
        <view class="third-icon google">G</view>
      </view>
    </view>

    <!-- 注册链接 -->
    <view class="register-area">
      <text class="register-text">还没有账号？</text>
      <text class="register-link" @click="goToRegister">立即注册</text>
    </view>

    <!-- 游客模式 -->
    <button class="guest-btn" @click="handleGuest">游客模式体验</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const phone = ref('')
const code = ref('')
const countdown = ref(0)
let timer: number

const getCode = () => {
  if (countdown.value > 0) return
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return
  }
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
  uni.showToast({ title: '验证码已发送', icon: 'success' })
}

const handleLogin = () => {
  if (!phone.value || !code.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  // Mock login
  userStore.setToken('mock_token_' + Date.now())
  userStore.setUserInfo({
    phone: phone.value,
    nickname: 'Luna用户',
    avatar: '👩',
    createdAt: new Date().toISOString()
  })
  uni.showToast({ title: '登录成功', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/home/home' })
  }, 500)
}

const handleWechatLogin = () => {
  uni.showToast({ title: '微信登录开发中', icon: 'none' })
}

const handleGuest = () => {
  userStore.setToken('guest_' + Date.now())
  userStore.setUserInfo({
    nickname: '游客',
    avatar: '🌙',
    isGuest: true
  })
  uni.switchTab({ url: '/pages/home/home' })
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/register/register' })
}
</script>

<style lang="scss" scoped>
.login-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(168,85,247,0.08) 0%, #F8F7FC 40%);
  padding: 80px 24px 40px;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}
.logo {
  margin-bottom: 28px;
}
.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 8px 24px rgba(139,92,246,0.3);
}
.logo-moon {
  position: relative;
  width: 40px;
  height: 40px;
}
.moon-shape {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: inset -10px 3px 0 0 #ffffff;
  transform: rotate(-45deg);
}
.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
}
.welcome-subtitle {
  font-size: 15px;
  color: #6B7280;
}
.form-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}
.other-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  margin-bottom: 24px;
}
.other-text {
  font-size: 14px;
  color: #9CA3AF;
}
.third-party {
  display: flex;
  gap: 24px;
}
.third-icon {
  width: 52px;
  height: 52px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}
.third-icon.wechat {
  color: #07C160;
}
.third-icon.google {
  color: #4285F4;
  font-weight: 700;
}
.register-area {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 24px;
}
.register-text {
  font-size: 14px;
  color: #6B7280;
}
.register-link {
  font-size: 14px;
  color: #8B5CF6;
  font-weight: 500;
}
.guest-btn {
  width: 100%;
  height: 52px;
  background: rgba(255,255,255,0.9);
  border-radius: 26px;
  color: #6B7280;
  font-size: 15px;
  border: 1px solid rgba(0,0,0,0.05);
  margin-top: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.guest-btn::after {
  border: none;
}
</style>
