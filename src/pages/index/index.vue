<template>
  <view class="redirect-page">
    <view class="loading-container">
      <view class="loading-spinner"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

onLoad(() => {
  // Check if it's first launch
  const hasLaunched = uni.getStorageSync('has_launched')
  const isLoggedIn = uni.getStorageSync('token')

  setTimeout(() => {
    if (!hasLaunched) {
      uni.reLaunch({ url: '/pages/splash/splash' })
    } else if (isLoggedIn) {
      uni.switchTab({ url: '/pages/home/home' })
    } else {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }, 100)
})
</script>

<style lang="scss" scoped>
.redirect-page {
  width: 100vw;
  height: 100vh;
  background: $bg-light-purple;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(196, 76, 255, 0.2);
  border-top-color: #c44cff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
