<template>
  <div class="luna-input" :class="{ 'is-focus': focus, 'is-disabled': disabled }">
    <!-- 左侧图标插槽 -->
    <div v-if="$slots.prefix || icon" class="luna-input__prefix">
      <slot name="prefix"></slot>
      <text v-if="!$slots.prefix" class="luna-input__icon-text">{{ iconTextMap[icon] || icon }}</text>
    </div>

    <!-- 输入框 -->
    <input
      class="luna-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :password="type === 'password'"
      :clearable="clearable"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
    />

    <!-- 右侧按钮/内容插槽 -->
    <div v-if="$slots.suffix || buttonText" class="luna-input__suffix">
      <slot name="suffix"></slot>
      <button
        v-if="buttonText && !$slots.suffix"
        class="luna-input__button"
        :class="{ 'is-disabled': buttonDisabled }"
        :disabled="buttonDisabled"
        @click="handleButtonClick"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const iconTextMap: Record<string, string> = {
  'person': '👤',
  'phone': '📱',
  'email': '✉️',
  'locked': '🔒',
  'lock': '🔒',
  'eye': '👁',
  'eye-slash': '🙈',
  'search': '🔍',
  'calendar': '📅',
  'clock': '🕐',
  'location': '📍',
  'heart': '❤️',
  'star': '⭐',
  'settings': '⚙️',
  'home': '🏠',
  'chat': '💬',
  'plus': '+',
  'close': '✕',
  'checkmark': '✓',
  'back': '‹',
  'forward': '›',
  'up': '↑',
  'down': '↓'
}

interface Props {
  modelValue?: string | number
  type?: 'text' | 'number' | 'password' | 'tel' | 'email'
  placeholder?: string
  icon?: string
  disabled?: boolean
  clearable?: boolean
  maxlength?: number
  buttonText?: string
  buttonDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '请输入',
  icon: '',
  disabled: false,
  clearable: true,
  maxlength: -1,
  buttonText: '',
  buttonDisabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: Event): void
  (e: 'blur', event: Event): void
  (e: 'confirm', event: Event): void
  (e: 'button-click'): void
}>()

const focus = ref(false)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (e: Event) => {
  focus.value = true
  emit('focus', e)
}

const handleBlur = (e: Event) => {
  focus.value = false
  emit('blur', e)
}

const handleConfirm = (e: Event) => {
  emit('confirm', e)
}

const handleButtonClick = () => {
  if (!props.buttonDisabled) {
    emit('button-click')
  }
}
</script>

<style lang="scss" scoped>
.luna-input {
  display: flex;
  align-items: center;
  width: 100%;
  height: 52px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 26px;
  border: 1.5px solid rgba(196, 76, 255, 0.1);
  box-shadow:
    0 4px 16px rgba(196, 76, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &.is-focus {
    border-color: rgba(196, 76, 255, 0.4);
    box-shadow:
      0 6px 20px rgba(196, 76, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 0 0 4px rgba(196, 76, 255, 0.08);
  }

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__prefix {
    display: flex;
    align-items: center;
    margin-right: 12px;
    color: #9ca3af;
  }

  &__icon-text {
    font-size: 18px;
  }

  &__inner {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: #1f2937;
    font-family: inherit;

    &::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }
  }

  &__suffix {
    display: flex;
    align-items: center;
    margin-left: 12px;
  }

  &__button {
    height: 32px;
    padding: 0 16px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #c44cff 0%, #a445ff 100%);
    color: #ffffff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:active {
      transform: scale(0.96);
      opacity: 0.9;
    }

    &.is-disabled {
      background: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
</style>
