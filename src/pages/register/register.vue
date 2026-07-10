<template>
  <view class="register-page">
    <!-- Logo和标题 -->
    <view class="header">
      <view class="logo">
        <view class="logo-icon">
          <view class="logo-moon">
            <view class="moon-shape"></view>
          </view>
        </view>
      </view>
      <text class="welcome-title">创建账号</text>
      <text class="welcome-subtitle">注册 Luna，开始记录你的每一天</text>
    </view>

    <!-- 输入表单 -->
    <view class="form-area">
      <LunaInput
        v-model="nickname"
        placeholder="输入昵称"
        icon="person"
        :maxlength="20"
      />
      <LunaInput
        v-model="phone"
        placeholder="输入手机号"
        icon="phone"
        type="tel"
        :maxlength="11"
      />
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
      <LunaInput
        v-model="password"
        placeholder="设置密码（6-20位）"
        icon="locked"
        type="password"
        :maxlength="20"
      />
      <LunaInput
        v-model="confirmPassword"
        placeholder="确认密码"
        icon="locked"
        type="password"
        :maxlength="20"
      />
    </view>

    <!-- 用户协议 -->
    <view class="agreement">
      <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
        <text v-if="agreed" class="check-icon">✓</text>
      </view>
      <text class="agreement-text">
        我已阅读并同意
        <text class="link">《用户协议》</text>
        和
        <text class="link">《隐私政策》</text>
      </text>
    </view>

    <!-- 注册按钮 -->
    <LunaButton
      type="primary"
      size="large"
      text="注册"
      :disabled="!canSubmit"
      @click="handleRegister"
    />

    <!-- 登录链接 -->
    <view class="login-area">
      <text class="login-text">已有账号？</text>
      <text class="login-link" @click="goToLogin">立即登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const nickname = ref('')
const phone = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreed = ref(false)
const countdown = ref(0)
let timer: number

const canSubmit = computed(() => {
  return nickname.value
    && phone.value.length === 11
    && code.value.length >= 4
    && password.value.length >= 6
    && confirmPassword.value === password.value
    && agreed.value
})

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

const handleRegister = () => {
  if (!canSubmit.value) return

  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }

  // Mock register
  userStore.setToken('mock_token_' + Date.now())
  userStore.setUserInfo({
    phone: phone.value,
    nickname: nickname.value || 'Luna用户',
    avatar: '👩',
    createdAt: new Date().toISOString()
  })

  uni.setStorageSync('has_launched', 'true')

  uni.showToast({ title: '注册成功', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/home/home' })
  }, 500)
}

const goToLogin = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.register-page {
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
  margin-bottom: 36px;
}
.logo {
  margin-bottom: 24px;
}
.logo-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(139,92,246,0.3);
}
.logo-moon {
  width: 34px;
  height: 34px;
}
.moon-shape {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  box-shadow: inset -8px 2px 0 0 #ffffff;
  transform: rotate(-45deg);
}
.welcome-title {
  font-size: 26px;
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
  gap: 14px;
  margin-bottom: 20px;
}
.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 24px;
  padding: 0 4px;
}
.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #D1D5DB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s;

  &.checked {
    background: #8B5CF6;
    border-color: #8B5CF6;
  }
}
.check-icon {
  color: white;
  font-size: 12px;
  font-weight: 700;
}
.agreement-text {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}
.link {
  color: #8B5CF6;
}
.login-area {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 28px;
}
.login-text {
  font-size: 14px;
  color: #6B7280;
}
.login-link {
  font-size: 14px;
  color: #8B5CF6;
  font-weight: 500;
}
</style>
