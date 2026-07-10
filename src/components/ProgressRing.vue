<template>
  <view class="progress-ring-container">
    <view class="progress-ring" :style="{ width: size + 'px', height: size + 'px' }">
      <view class="ring-bg"></view>
      <view class="ring-progress" :style="progressStyle"></view>
      <view class="ring-content" :style="{ top: strokeWidth + 'px', left: strokeWidth + 'px', right: strokeWidth + 'px', bottom: strokeWidth + 'px' }">
        <slot></slot>
        <text v-if="showPercentage" class="progress-text">{{ Math.round(percentage) }}%</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  percentage: number
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  size: 120,
  strokeWidth: 10,
  showPercentage: true
})
const progressStyle = computed(() => {
  const clampedPercentage = Math.min(100, Math.max(0, props.percentage))
  const deg = (clampedPercentage / 100) * 360
  return {
    background: `conic-gradient(#c44cff 0%, #8b5cf6 40%, #3b82f6 ${deg}deg, transparent ${deg}deg)`,
    width: props.size + 'px',
    height: props.size + 'px',
    boxShadow: `0 4px 20px rgba(196, 76, 255, ${clampedPercentage / 200})`
  }
})
</script>

<style lang="scss" scoped>
.progress-ring-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-ring {
  position: relative;
  border-radius: 50%;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.ring-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(196, 76, 255, 0.1);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}
.ring-progress {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.ring-content {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 4px 16px rgba(196, 76, 255, 0.1);
}
.progress-text {
  background: linear-gradient(135deg, #c44cff 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 24px;
  font-weight: 700;
}
</style>
