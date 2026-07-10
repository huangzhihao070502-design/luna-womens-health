<template>
  <view class="calendar-heatmap">
    <!-- 月份标题 -->
    <view class="calendar-header">
      <view class="calendar-nav" @click="prevMonth">
        <text class="nav-arrow">‹</text>
      </view>
      <text class="calendar-title">{{ currentYear }}年{{ currentMonth + 1 }}月</text>
      <view class="calendar-nav" @click="nextMonth">
        <text class="nav-arrow">›</text>
      </view>
    </view>

    <!-- 星期标题 -->
    <view class="weekdays">
      <text v-for="day in weekDays" :key="day" class="weekday">{{ day }}</text>
    </view>

    <!-- 日期网格 -->
    <view class="days-grid">
      <view
        v-for="(day, index) in calendarDays"
        :key="index"
        class="day-cell"
        :class="getDayClass(day)"
        @click="selectDay(day)"
      >
        <text v-if="day" class="day-number">{{ day.date }}</text>
        <view v-if="day && isToday(day)" class="today-dot"></view>
        <view v-if="day && day.hasMark" class="day-mark" :class="`mark-${day.markType}`"></view>
      </view>
    </view>

    <!-- 图例 -->
    <view class="legend">
      <view class="legend-item">
        <view class="legend-dot mark-period"></view>
        <text class="legend-text">经期</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot mark-ovulation"></view>
        <text class="legend-text">排卵期</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot mark-fertile"></view>
        <text class="legend-text">易孕期</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot mark-predicted"></view>
        <text class="legend-text">预测日</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CalendarDay {
  date: number
  fullDate: string
  isCurrentMonth: boolean
  isToday?: boolean
  markType?: 'period' | 'ovulation' | 'fertile' | 'predicted'
  hasMark?: boolean
}

interface Props {
  marks?: Record<string, 'period' | 'ovulation' | 'fertile' | 'predicted'>
  defaultDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  marks: () => ({}),
  defaultDate: () => new Date()
})

const emit = defineEmits<{
  (e: 'select', day: CalendarDayItem): void
  (e: 'month-change', year: number, month: number): void
}>()

type CalendarDayItem = CalendarDay | null

const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const today = new Date()
const currentYear = ref(props.defaultDate.getFullYear())
const currentMonth = ref(props.defaultDate.getMonth())

const calendarDays = computed((): CalendarDayItem[] => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const days: (CalendarDay | null)[] = []

  // 填充上月空白
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null)
  }

  // 填充当月日期
  for (let date = 1; date <= daysInMonth; date++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    const markType = props.marks[fullDate]
    days.push({
      date,
      fullDate,
      isCurrentMonth: true,
      isToday: isTodayDate(year, month, date),
      markType,
      hasMark: !!markType
    })
  }

  return days
})

const isTodayDate = (year: number, month: number, date: number): boolean => {
  return (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    date === today.getDate()
  )
}

const isToday = (day: CalendarDayItem): boolean => {
  if (!day) return false
  return !!day.isToday
  return !!day.isToday
}

const getDayClass = (day: CalendarDayItem) => {
  if (!day) return 'is-empty'
  return {
    'is-other-month': !day.isCurrentMonth,
    'is-today': day.isToday,
    [`is-${day.markType}`]: day.hasMark
  }
}

const selectDay = (day: CalendarDayItem) => {
  if (day) {
    emit('select', day)
  }
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  emit('month-change', currentYear.value, currentMonth.value)
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  emit('month-change', currentYear.value, currentMonth.value)
}
</script>

<style lang="scss" scoped>
.calendar-heatmap {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 20px;
  box-shadow:
    0 8px 32px rgba(196, 76, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.calendar-nav {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(196, 76, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.9);
    background: rgba(196, 76, 255, 0.2);
  }
}

.nav-arrow {
  font-size: 24px;
  font-weight: 300;
  color: #6b21a8;
  line-height: 1;
}

.calendar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.weekday {
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
  padding: 8px 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.is-empty {
    pointer-events: none;
  }

  &:active {
    transform: scale(0.92);
  }
}

.day-number {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  z-index: 1;
}

.today-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c44cff;
}

.day-mark {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  z-index: 0;

  &.mark-period {
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);

    + .day-number {
      color: #ffffff;
      font-weight: 600;
    }
  }

  &.mark-ovulation {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

    + .day-number {
      color: #ffffff;
      font-weight: 600;
    }
  }

  &.mark-fertile {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    opacity: 0.6;
    box-shadow: 0 2px 8px rgba(240, 147, 251, 0.25);
  }

  &.mark-predicted {
    background: rgba(196, 76, 255, 0.2);
    border: 2px dashed #c44cff;
    box-sizing: border-box;
  }
}

// 今天特殊样式
.is-today {
  .day-number {
    font-weight: 700;
    color: #c44cff;
  }
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(196, 76, 255, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;

  &.mark-period {
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  }

  &.mark-ovulation {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.mark-fertile {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    opacity: 0.6;
  }

  &.mark-predicted {
    background: rgba(196, 76, 255, 0.2);
    border: 1px dashed #c44cff;
  }
}

.legend-text {
  font-size: 12px;
  color: #6b7280;
}
</style>
