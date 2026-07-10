<template>
  <view
    class="luna-switch"
    :class="{ 'is-checked': modelValue, 'is-disabled': disabled }"
    @click="toggle"
  >
    <view class="luna-switch__core">
      <view class="luna-switch__handle"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  disabled?: boolean
  activeColor?: string
  inactiveColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  activeColor: '',
  inactiveColor: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const toggle = () => {
  if (props.disabled) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style lang="scss" scoped>
.luna-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s ease;

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__core {
    position: relative;
    width: 52px;
    height: 30px;
    border-radius: 15px;
    background: #e5e7eb;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  &__handle {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  // 开启状态 - 紫色渐变
  &.is-checked {
    .luna-switch__core {
      background: linear-gradient(135deg, #c44cff 0%, #7c3aed 100%);
      box-shadow:
        0 4px 12px rgba(196, 76, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .luna-switch__handle {
      transform: translateX(22px);
    }
  }

  // 点击动效
  &:active {
    .luna-switch__handle {
      width: 28px;
    }

    &.is-checked .luna-switch__handle {
      transform: translateX(18px);
    }
  }
}
</style>
