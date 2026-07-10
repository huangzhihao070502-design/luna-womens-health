<template>
  <div
    class="luna-card"
    :class="[
      `luna-card--${padding}`,
      { 'is-hoverable': hoverable, 'is-clickable': clickable }
    ]"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  padding?: 'none' | 'small' | 'medium' | 'large'
  hoverable?: boolean
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: 'medium',
  hoverable: false,
  clickable: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<style lang="scss" scoped>
.luna-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 8px 32px rgba(196, 76, 255, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow: hidden;

  // 内边距
  &--none {
    padding: 0;
  }

  &--small {
    padding: 12px 16px;
  }

  &--medium {
    padding: 20px 24px;
  }

  &--large {
    padding: 28px 32px;
  }

  // 可悬停
  &.is-hoverable:hover {
    transform: translateY(-2px);
    box-shadow:
      0 12px 40px rgba(196, 76, 255, 0.12),
      0 4px 12px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: rgba(196, 76, 255, 0.2);
  }

  // 可点击
  &.is-clickable {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
