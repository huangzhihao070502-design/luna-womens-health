<template>
  <button
    class="luna-button"
    :class="[
      `luna-button--${type}`,
      `luna-button--${size}`,
      { 'is-disabled': disabled, 'is-plain': plain, 'is-round': round }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot v-if="$slots.default"></slot>
    <text v-else>{{ text }}</text>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  text?: string
  disabled?: boolean
  plain?: boolean
  round?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  text: '',
  disabled: false,
  plain: false,
  round: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<style lang="scss" scoped>
.luna-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  outline: none;
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  // 尺寸
  &--small {
    height: 36px;
    padding: 0 20px;
    font-size: 13px;
    border-radius: 18px;
  }

  &--medium {
    height: 48px;
    padding: 0 32px;
    font-size: 15px;
    border-radius: 24px;
  }

  &--large {
    height: 56px;
    padding: 0 40px;
    font-size: 16px;
    border-radius: 28px;
    width: 100%;
  }

  // 完全圆角
  &.is-round {
    border-radius: 999px;
  }

  // 主按钮 - 粉紫渐变 + 外发光
  &--primary {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #c44cff 75%, #a445ff 100%);
    color: #ffffff;
    box-shadow:
      0 8px 24px rgba(196, 76, 255, 0.35),
      0 4px 12px rgba(255, 154, 158, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);

    &:active {
      transform: translateY(2px);
      box-shadow:
        0 4px 12px rgba(196, 76, 255, 0.3),
        0 2px 6px rgba(255, 154, 158, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    // 朴素变体 - 白色半透明
    &.is-plain {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #c44cff;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow:
        0 4px 16px rgba(196, 76, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);

      &:active {
        background: rgba(255, 255, 255, 0.35);
        transform: translateY(1px);
      }
    }
  }

  // 次要按钮 - 白色毛玻璃
  &--secondary {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: #6b21a8;
    box-shadow:
      0 6px 20px rgba(107, 33, 168, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);

    &:active {
      transform: translateY(2px);
      background: rgba(255, 255, 255, 0.95);
      box-shadow:
        0 3px 10px rgba(107, 33, 168, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }
  }

  // 轮廓按钮
  &--outline {
    background: transparent;
    color: #c44cff;
    border: 1.5px solid #c44cff;
    box-shadow: none;

    &:active {
      background: rgba(196, 76, 255, 0.08);
      transform: translateY(1px);
    }
  }

  // 禁用状态
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
