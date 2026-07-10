<template>
  <view class="luna-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="luna-navbar__content" :style="{ height: navBarHeight + 'px' }">
      <!-- 左侧返回区域 -->
      <view class="luna-navbar__left" @click="handleBack">
        <slot name="left">
          <view v-if="showBack" class="luna-navbar__back">
            <text class="luna-navbar__back-icon">‹</text>
          </view>
        </slot>
      </view>

      <!-- 中间标题 -->
      <view class="luna-navbar__title">
        <slot name="title">
          <text class="luna-navbar__title-text">{{ title }}</text>
        </slot>
      </view>

      <!-- 右侧操作区域 -->
      <view class="luna-navbar__right" @click="handleRightClick">
        <slot name="right">
          <text v-if="rightText" class="luna-navbar__right-text">{{ rightText }}</text>
        </slot>
      </view>
    </view>

    <!-- 底部安全占位 -->
    <view v-if="fixed && placeholder" class="luna-navbar__placeholder" :style="{ height: (statusBarHeight + navBarHeight) + 'px' }"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  title?: string
  showBack?: boolean
  rightText?: string
  fixed?: boolean
  placeholder?: boolean
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  rightText: '',
  fixed: true,
  placeholder: true,
  backgroundColor: 'transparent'
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'right-click'): void
}>()

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

onMounted(() => {
  // 获取系统状态栏高度
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20

  // #ifdef MP-WEIXIN
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
  // #endif

  // #ifndef MP-WEIXIN
  navBarHeight.value = 44
  // #endif
})

const handleBack = () => {
  emit('back')
  if (props.showBack) {
    uni.navigateBack({
      fail: () => {
        uni.switchTab({ url: '/pages/index/index' })
      }
    })
  }
}

const handleRightClick = () => {
  emit('right-click')
}

defineExpose({
  statusBarHeight,
  navBarHeight
})
</script>

<style lang="scss" scoped>
.luna-navbar {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 999;

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 0 16px;
  }

  &__left {
    display: flex;
    align-items: center;
    min-width: 60px;
    height: 100%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  &__back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.9);
      background: rgba(255, 255, 255, 0.95);
    }
  }

  &__back-icon {
    font-size: 28px;
    font-weight: 300;
    color: #1f2937;
    line-height: 1;
    margin-top: -2px;
  }

  &__title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__title-text {
    font-size: 17px;
    font-weight: 600;
    color: #1f2937;
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 60px;
    height: 100%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  &__right-text {
    font-size: 15px;
    color: #c44cff;
    font-weight: 500;
  }

  &__placeholder {
    width: 100%;
  }
}
</style>
