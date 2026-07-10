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

const progress = ref(0)
const starStyles = ref<Record<string, any>>({})
let timer: ReturnType<typeof setInterval> | null = null

// Pre-generate deterministic star positions based on index
function generateStarStyles() {
  const styles: Record<string, any> = {}
  const seeds = [0.1234, 0.5678, 0.9012, 0.3456, 0.7890, 0.2345, 0.6789, 0.1111, 0.2222, 0.3333,
    0.4444, 0.5555, 0.6666, 0.7777, 0.8888, 0.9999, 0.1122, 0.3344, 0.5566, 0.7788,
    0.9900, 0.2233, 0.4455, 0.6677, 0.8899, 0.1020, 0.3040, 0.5060, 0.7080, 0.9090,
    0.1123, 0.3145, 0.5167, 0.7189, 0.9101, 0.1213, 0.3235, 0.5257, 0.7279, 0.9291,
    0.1314, 0.3336, 0.5358, 0.7379, 0.9401, 0.1415, 0.3437, 0.5459, 0.7470, 0.9492]
  for (let i = 0; i < 50; i++) {
    const s = seeds[i] || (i * 0.0197)
    const size = (s * 3 + 1)
    styles[i] = {
      left: ((s * 7 + i * 0.3) % 1 * 100) + '%',
      top: ((s * 13 + i * 0.7) % 1 * 100) + '%',
      width: size + 'px',
      height: size + 'px',
      opacity: ((s * 5 + i * 0.1) % 1 * 0.8 + 0.2),
      animationDelay: ((s * 3) % 1 * 3) + 's'
    }
  }
  return styles
}

starStyles.value = generateStarStyles()

const getStarStyle = (i: number) => {
  return starStyles.value[i] || { left: '50%', top: '50%', width: '3px', height: '3px', opacity: 0.5 }
}

onMounted(() => {
  // Mark as launched
  try { uni.setStorageSync('has_launched', 'true') } catch (e) {}

  timer = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      if (timer) clearInterval(timer)
      timer = null
      // Check if already logged in
      let token = ''
      try { token = uni.getStorageSync('token') || '' } catch (e) {}
      if (token) {
        uni.reLaunch({ url: '/pages/home/home' })
      } else {
        uni.redirectTo({ url: '/pages/onboarding/onboarding' })
      }
    }
  }, 60)
})
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
