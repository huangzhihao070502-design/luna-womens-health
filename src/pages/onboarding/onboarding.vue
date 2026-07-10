<template>
  <view class="onboarding-page">
    <!-- 插画区域 -->
    <view class="illustration-area">
      <view class="illustration-bg"></view>
      <swiper class="illustration-swiper" :current="currentSlide" @change="onSlideChange" circular>
        <swiper-item v-for="(slide, index) in slides" :key="index">
          <view class="illustration">
            <view class="emoji-illustration">
              <text class="main-emoji">{{ slide.emoji }}</text>
              <view class="deco-emojis">
                <text v-for="(d, i) in slide.decos" :key="i" class="deco" :style="d.style">{{ d.emoji }}</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 文字区域 -->
    <view class="text-area">
      <text class="title">{{ slides[currentSlide].title }}</text>
      <text class="subtitle">{{ slides[currentSlide].subtitle }}</text>
    </view>

    <!-- 引导点 -->
    <view class="dots">
      <view
        v-for="(slide, index) in slides"
        :key="index"
        class="dot"
        :class="{ 'dot-active': index === currentSlide }"
        @click="goToSlide(index)"
      ></view>
    </view>

    <!-- 按钮 -->
    <view class="btn-area">
      <button class="start-btn" @click="handleStart">
        <text>{{ currentSlide === slides.length - 1 ? '立即开始' : '下一步' }}</text>
        <text class="arrow">›</text>
      </button>
      <text v-if="currentSlide === 0" class="skip-btn" @click="handleSkip">跳过</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentSlide = ref(0)
const slides = [
  {
    title: '了解你的身体',
    subtitle: '智能周期追踪，了解你的身体变化',
    emoji: '🌸',
    decos: [
      { emoji: '🌿', style: 'top: 10%; left: 5%; font-size: 32px;' },
      { emoji: '💫', style: 'top: 5%; right: 10%; font-size: 24px;' },
      { emoji: '✨', style: 'bottom: 20%; left: 10%; font-size: 20px;' }
    ]
  },
  {
    title: '记录你的每一次周期',
    subtitle: '智能预测 · 健康管理 · 贴心陪伴',
    emoji: '📅',
    decos: [
      { emoji: '💗', style: 'top: 5%; left: 15%; font-size: 28px;' },
      { emoji: '🌙', style: 'top: 15%; right: 5%; font-size: 36px;' },
      { emoji: '⭐', style: 'bottom: 25%; right: 15%; font-size: 22px;' }
    ]
  },
  {
    title: 'AI 专属健康顾问',
    subtitle: '随时解答你的健康疑问，专业贴心',
    emoji: '🧠',
    decos: [
      { emoji: '💬', style: 'top: 10%; left: 8%; font-size: 28px;' },
      { emoji: '💜', style: 'top: 5%; right: 12%; font-size: 24px;' },
      { emoji: '✨', style: 'bottom: 15%; left: 15%; font-size: 26px;' }
    ]
  }
]

const onSlideChange = (e: any) => {
  currentSlide.value = e.detail.current
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const handleStart = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  } else {
    uni.redirectTo({ url: '/pages/login/login' })
  }
}

const handleSkip = () => {
  uni.redirectTo({ url: '/pages/login/login' })
}
</script>

<style lang="scss" scoped>
.onboarding-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 24px 40px;
}
.illustration-area {
  width: 100%;
  height: 340px;
  position: relative;
  margin-bottom: 40px;
}
.illustration-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
  border-radius: 50%;
}
.illustration-swiper {
  width: 100%;
  height: 100%;
}
.illustration {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.emoji-illustration {
  position: relative;
  width: 200px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-emoji {
  font-size: 120px;
  filter: drop-shadow(0 8px 24px rgba(139,92,246,0.2));
}
.deco-emojis {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.deco {
  position: absolute;
  animation: float 3s ease-in-out infinite;
  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 1s; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  text-align: center;
}
.subtitle {
  font-size: 16px;
  color: #6B7280;
  text-align: center;
}
.dots {
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(139,92,246,0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}
.dot-active {
  width: 24px;
  background: #8B5CF6;
}
.btn-area {
  width: 100%;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.start-btn {
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
  border-radius: 28px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(236,72,153,0.3);
  border: none;
  margin: 0;
}
.start-btn::after {
  border: none;
}
.arrow {
  font-size: 24px;
  font-weight: 300;
}
.skip-btn {
  font-size: 15px;
  color: #9CA3AF;
  padding: 8px 24px;
}
</style>
