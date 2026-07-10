<template>
  <view class="ai-message-bubble" :class="{ 'is-user': isUser }">
    <!-- Luna月牙头像 -->
    <view v-if="!isUser" class="bubble-avatar">
      <view class="luna-icon">
        <view class="moon"></view>
        <view class="moon-glow"></view>
      </view>
    </view>

    <!-- 消息内容 -->
    <view class="bubble-content" :class="{ 'is-user-content': isUser }">
      <view class="bubble-text" :class="{ 'is-user-text': isUser }">
        <slot></slot>
        <text v-if="text">{{ text }}</text>
      </view>
      <view v-if="time" class="bubble-time">{{ time }}</view>
    </view>

    <!-- 用户头像占位 -->
    <view v-if="isUser" class="bubble-avatar is-user-avatar">
      <slot name="user-avatar">
        <text class="user-avatar-icon">👤</text>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  time?: string
  isUser?: boolean
  showAvatar?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '',
  time: '',
  isUser: false,
  showAvatar: true
})
</script>

<style lang="scss" scoped>
.ai-message-bubble {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;

  &.is-user {
    flex-direction: row-reverse;
  }
}

.bubble-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c44cff 0%, #7c3aed 100%);
  box-shadow:
    0 4px 12px rgba(196, 76, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: visible;

  &.is-user-avatar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}

// Luna月牙图标
.luna-icon {
  position: relative;
  width: 22px;
  height: 22px;
}

.moon {
  position: absolute;
  top: 0;
  right: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  box-shadow: inset -6px 2px 0 0 #ffffff;
  transform: rotate(-45deg);
}

.moon-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.user-avatar-icon {
  font-size: 18px;
}

.bubble-content {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &.is-user-content {
    align-items: flex-end;
  }
}

.bubble-text {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 14px 18px;
  border-radius: 20px 20px 20px 4px;
  font-size: 15px;
  line-height: 1.6;
  color: #1f2937;
  box-shadow:
    0 4px 16px rgba(196, 76, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.6);
  word-break: break-word;

  &.is-user-text {
    background: linear-gradient(135deg, #c44cff 0%, #7c3aed 100%);
    color: #ffffff;
    border-radius: 20px 20px 4px 20px;
    border: none;
    box-shadow:
      0 4px 16px rgba(196, 76, 255, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.bubble-time {
  margin-top: 6px;
  font-size: 11px;
  color: #9ca3af;
  padding: 0 4px;
}
</style>
