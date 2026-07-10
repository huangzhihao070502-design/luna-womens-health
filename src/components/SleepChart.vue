<template>
  <view class="sleep-chart">
    <view class="chart-header">
      <text class="chart-title">{{ title }}</text>
      <view class="chart-legend">
        <view class="legend-bar"></view>
        <text class="legend-text">睡眠时长(小时)</text>
      </view>
    </view>

    <view class="chart-container">
      <!-- Y轴刻度 -->
      <view class="y-axis">
        <text v-for="(label, index) in yAxisLabels" :key="index" class="y-label">{{ label }}</text>
      </view>

      <!-- 柱状图区域 -->
      <view class="bars-container">
        <!-- 网格线 -->
        <view class="grid-lines">
          <view v-for="i in 5" :key="i" class="grid-line"></view>
        </view>

        <!-- 柱子 -->
        <view class="bars-wrapper">
          <view
            v-for="(item, index) in data"
            :key="index"
            class="bar-item"
            @click="selectBar(index)"
          >
            <view
              class="bar"
              :style="{ height: getBarHeight(item.value) + '%' }"
              :class="{ 'is-active': activeIndex === index }"
            >
              <view v-if="showValue && activeIndex === index" class="bar-tooltip">
                {{ item.value }}h
              </view>
            </view>
            <text class="bar-label">{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 统计信息插槽 -->
    <view v-if="$slots.stats" class="chart-stats">
      <slot name="stats"></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SleepDataItem {
  label: string
  value: number
  date?: string
}

interface Props {
  data?: SleepDataItem[]
  title?: string
  maxValue?: number
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  title: '睡眠趋势',
  maxValue: 12,
  showValue: true
})

const emit = defineEmits<{
  (e: 'select', item: SleepDataItem, index: number): void
}>()

const activeIndex = ref(-1)

const yAxisLabels = computed(() => {
  const labels = []
  const step = props.maxValue / 4
  for (let i = 4; i >= 0; i--) {
    labels.push(Math.round(i * step))
  }
  return labels
})

const getBarHeight = (value: number): number => {
  return Math.min(100, Math.max(0, (value / props.maxValue) * 100))
}

const selectBar = (index: number) => {
  activeIndex.value = activeIndex.value === index ? -1 : index
  if (activeIndex.value !== -1) {
    emit('select', props.data[index], index)
  }
}
</script>

<style lang="scss" scoped>
.sleep-chart {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  box-shadow:
    0 8px 32px rgba(196, 76, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-bar {
  width: 16px;
  height: 10px;
  border-radius: 3px;
  background: linear-gradient(180deg, #c44cff 0%, #3b82f6 100%);
}

.legend-text {
  font-size: 12px;
  color: #6b7280;
}

.chart-container {
  display: flex;
  height: 200px;
  gap: 8px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  padding-right: 8px;
}

.y-label {
  font-size: 11px;
  color: #9ca3af;
  text-align: right;
}

.bars-container {
  flex: 1;
  position: relative;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  width: 100%;
  height: 1px;
  background: rgba(196, 76, 255, 0.08);
}

.bars-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-bottom: 24px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.bar {
  width: 100%;
  max-width: 32px;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, #c44cff 0%, #8b5cf6 50%, #3b82f6 100%);
  position: absolute;
  bottom: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 12px rgba(196, 76, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  &.is-active {
    transform: scaleY(1.05);
    box-shadow:
      0 6px 20px rgba(196, 76, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
}

.bar-tooltip {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #c44cff 0%, #7c3aed 100%);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(196, 76, 255, 0.3);

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #7c3aed;
  }
}

.bar-label {
  position: absolute;
  bottom: 0;
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

.chart-stats {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(196, 76, 255, 0.1);
}
</style>
