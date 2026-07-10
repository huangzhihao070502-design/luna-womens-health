<template>
  <view class="detail-page" v-if="entry">
    <LunaNavBar :title="''" rightText="编辑" @right-click="goToEdit">
      <template #right>
        <view class="nav-actions">
          <text class="nav-action" @click="handleDelete">🗑</text>
        </view>
      </template>
    </LunaNavBar>

    <view class="detail-content">
      <!-- 日期和心情 -->
      <view class="header-section">
        <view class="date-area">
          <text class="date-day">{{ getDay(entry.date) }}</text>
          <view class="date-meta">
            <text class="date-month">{{ getMonthYear(entry.date) }}</text>
            <text class="date-weekday">{{ getWeekday(entry.date) }}</text>
          </view>
        </view>
        <view class="mood-display">
          <text class="mood-emoji">{{ entry.moodIcon }}</text>
          <text class="mood-label">{{ entry.mood }}</text>
        </view>
      </view>

      <!-- 标题 -->
      <text class="diary-title">{{ entry.title }}</text>

      <!-- 内容 -->
      <view class="diary-content-section glass-card">
        <text class="diary-content">{{ entry.content }}</text>
      </view>

      <!-- 标签 -->
      <view class="tags-section" v-if="entry.tags.length > 0">
        <text v-for="tag in entry.tags" :key="tag" class="detail-tag">#{{ tag }}</text>
      </view>

      <!-- 时间信息 -->
      <view class="time-info">
        <text class="time-text">创建于 {{ formatDateTime(entry.createdAt) }}</text>
        <text v-if="entry.updatedAt !== entry.createdAt" class="time-text">
          更新于 {{ formatDateTime(entry.updatedAt) }}
        </text>
      </view>
    </view>
  </view>

  <!-- 不存在 -->
  <view v-else class="not-found">
    <text class="nf-emoji">📭</text>
    <text class="nf-text">日记不存在</text>
    <LunaButton type="primary" size="medium" text="返回" @click="goBack" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useDiaryStore } from '@/store'

const diaryStore = useDiaryStore()
const entryId = ref<string | null>(null)

const entry = computed(() => {
  if (!entryId.value) return null
  return diaryStore.getEntry(entryId.value) || null
})

onLoad((options: any) => {
  if (options?.id) {
    entryId.value = options.id
  }
})

const getDay = (dateStr: string) => parseInt(dateStr.split('-')[2])

const getMonthYear = (dateStr: string) => {
  const [year, month] = dateStr.split('-')
  return `${year}年${parseInt(month)}月`
}

const getWeekday = (dateStr: string) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[new Date(dateStr).getDay()]
}

const formatDateTime = (isoStr: string) => {
  const d = new Date(isoStr)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const goToEdit = () => {
  if (entryId.value) {
    uni.navigateTo({ url: `/pages/diary-edit/diary-edit?id=${entryId.value}` })
  }
}

const goBack = () => uni.navigateBack()

const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除这篇日记吗？',
    confirmColor: '#EF4444',
    success: (res) => {
      if (res.confirm && entryId.value) {
        diaryStore.deleteEntry(entryId.value)
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #F8F7FC;
}
.detail-content {
  padding: 100px 20px 40px;
}
.header-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.date-area {
  display: flex;
  align-items: center;
  gap: 14px;
}
.date-day {
  font-size: 56px;
  font-weight: 700;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}
.date-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.date-month {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}
.date-weekday {
  font-size: 13px;
  color: #9CA3AF;
}
.mood-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(139,92,246,0.08);
  padding: 12px 16px;
  border-radius: 16px;
}
.mood-emoji {
  font-size: 28px;
}
.mood-label {
  font-size: 12px;
  color: #8B5CF6;
  font-weight: 500;
}
.diary-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.4;
  margin-bottom: 20px;
  display: block;
}
.glass-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 24px;
}
.diary-content-section {
  margin-bottom: 20px;
}
.diary-content {
  font-size: 16px;
  color: #4B5563;
  line-height: 2;
}
.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}
.detail-tag {
  font-size: 13px;
  color: #8B5CF6;
  background: rgba(139,92,246,0.08);
  padding: 6px 14px;
  border-radius: 20px;
}
.time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}
.time-text {
  font-size: 12px;
  color: #D1D5DB;
}
.nav-actions {
  display: flex;
  gap: 16px;
}
.nav-action {
  font-size: 18px;
}
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
}
.nf-emoji {
  font-size: 64px;
  margin-bottom: 12px;
}
.nf-text {
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 24px;
}
</style>
