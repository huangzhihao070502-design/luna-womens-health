<template>
  <view class="splash-page">
    <!-- 背景装饰 -->
    <view class="stars">
      <view class="star" v-for="i in 50" :key="i" :style="getStarStyle(i)"></view>
    </view>

    <!-- 中心月牙 -->
    <view class="moon-container">
      <view class="moon-glow"></view>
      <view class="moon">
        <view class="moon-crescent"></view>
        <view class="star-deco">✦</view>
      </view>
      <view class="orbit orbit-1"></view>
      <view class="orbit orbit-2"></view>
    </view>

    <!-- Logo文字 -->
    <view class="logo-text">
      <text class="luna-name">Luna</text>
      <text class="luna-subtitle">AI Women's Health</text>
    </view>

    <!-- 进度条 -->
    <view class="progress-container">
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progress + '%' }"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const progress = ref(0)
let timer: number

onMounted(() => {
  // Mark as launched
  uni.setStorageSync('has_launched', 'true')

  timer = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      clearInterval(timer)
      // Check if already logged in
      const token = uni.getStorageSync('token')
      if (token) {
        uni.reLaunch({ url: '/pages/home/home' })
      } else {
        uni.redirectTo({ url: '/pages/onboarding/onboarding' })
      }
    }
  }, 60)
})

const getStarStyle = (i: number) => {
  const size = Math.random() * 3 + 1
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    width: size + 'px',
    height: size + 'px',
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: Math.random() * 3 + 's'
  }
}
</script>

<style lang="scss" scoped>
.splash-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #A855F7 0%, #8B5CF6 40%, #EC4899 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
.moon-container {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}
.moon-glow {
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  border-radius: 50%;
}
.moon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  position: relative;
  box-shadow: 0 0 60px rgba(255,255,255,0.5);
}
.moon-crescent {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%);
}
.star-deco {
  position: absolute;
  bottom: 15px;
  right: 15px;
  color: white;
  font-size: 24px;
}
.orbit {
  position: absolute;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
}
.orbit-1 {
  width: 160px;
  height: 160px;
  border-left-color: transparent;
  border-bottom-color: transparent;
  transform: rotate(20deg);
}
.orbit-2 {
  width: 200px;
  height: 200px;
  border-right-color: transparent;
  border-top-color: transparent;
  transform: rotate(-15deg);
}
.logo-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 80px;
}
.luna-name {
  font-size: 48px;
  font-weight: 300;
  color: white;
  font-family: 'Georgia', serif;
  font-style: italic;
}
.luna-subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  letter-spacing: 2px;
}
.progress-container {
  position: absolute;
  bottom: 80px;
  width: 200px;
}
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: white;
  border-radius: 2px;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(255,255,255,0.8);
}
</style>
