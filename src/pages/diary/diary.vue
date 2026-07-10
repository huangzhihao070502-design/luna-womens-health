<template>
  <view class="diary-page">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-top">
        <text class="page-title">我的日记</text>
        <view class="add-btn" @click="goToEdit">
          <text class="add-icon">+</text>
        </view>
      </view>
      <text class="page-subtitle">记录生活中的美好瞬间 ✨</text>
    </view>

    <!-- 筛选标签 -->
    <scroll-view class="filter-bar" scroll-x>
      <view
        class="filter-tag"
        :class="{ 'tag-active': currentFilter === 'all' }"
        @click="currentFilter = 'all'"
      >全部</view>
      <view
        v-for="tag in allTags"
        :key="tag"
        class="filter-tag"
        :class="{ 'tag-active': currentFilter === tag }"
        @click="currentFilter = tag"
      >{{ tag }}</view>
    </scroll-view>

    <!-- 日记列表 -->
    <view class="diary-list" v-if="filteredEntries.length > 0">
      <view
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="diary-card glass-card"
        @click="goToDetail(entry.id)"
      >
        <view class="card-header">
          <view class="card-date">
            <text class="date-day">{{ getDay(entry.date) }}</text>
            <view class="date-info">
              <text class="date-month">{{ getMonthYear(entry.date) }}</text>
              <text class="date-weekday">{{ getWeekday(entry.date) }}</text>
            </view>
          </view>
          <view class="mood-badge">
            <text class="mood-icon">{{ entry.moodIcon }}</text>
          </view>
        </view>
        <text class="card-title">{{ entry.title }}</text>
        <text class="card-content">{{ entry.content.length > 80 ? entry.content.slice(0, 80) + '...' : entry.content }}</text>
        <view class="card-footer" v-if="entry.tags.length > 0">
          <view class="tag-list">
            <text v-for="tag in entry.tags.slice(0, 3)" :key="tag" class="tag-item">#{{ tag }}</text>
          </view>
          <text class="card-time">{{ formatTime(entry.updatedAt) }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-emoji">📝</text>
      <text class="empty-title">还没有日记</text>
      <text class="empty-desc">记录下今天的心情吧</text>
      <LunaButton type="primary" size="medium" text="写第一篇日记" @click="goToEdit" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDiaryStore } from '@/store'

const diaryStore = useDiaryStore()
const currentFilter = ref('all')

const allTags = computed(() => {
  const tags = new Set<string>()
  diaryStore.entries.forEach(e => e.tags.forEach(t => tags.add(t)))
  return Array.from(tags)
})

const filteredEntries = computed(() => {
  if (currentFilter.value === 'all') return diaryStore.entries
  return diaryStore.entries.filter(e => e.tags.includes(currentFilter.value))
})

const getDay = (dateStr: string) => {
  return parseInt(dateStr.split('-')[2])
}

const getMonthYear = (dateStr: string) => {
  const [year, month] = dateStr.split('-')
  return `${year}年${parseInt(month)}月`
}

const getWeekday = (dateStr: string) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[new Date(dateStr).getDay()]
}

const formatTime = (isoStr: string) => {
  const d = new Date(isoStr)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const goToEdit = () => {
  uni.navigateTo({ url: '/pages/diary-edit/diary-edit' })
}

const goToDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/diary-detail/diary-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.diary-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  padding-bottom: 100px;
}
.header {
  padding: 70px 20px 20px;
  background: linear-gradient(180deg, rgba(139,92,246,0.1) 0%, transparent 100%);
}
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
}
.add-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.add-icon {
  font-size: 28px;
  color: white;
  font-weight: 300;
  line-height: 1;
  margin-top: -2px;
}
.page-subtitle {
  font-size: 14px;
  color: #9CA3AF;
}
.filter-bar {
  white-space: nowrap;
  padding: 0 20px 16px;
}
.filter-tag {
  display: inline-block;
  padding: 8px 18px;
  background: white;
  border-radius: 20px;
  font-size: 13px;
  color: #6B7280;
  margin-right: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s ease;

  &.tag-active {
    background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(139,92,246,0.25);
  }
}
.diary-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.glass-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 20px;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}
.card-date {
  display: flex;
  align-items: center;
  gap: 12px;
}
.date-day {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}
.date-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.date-month {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}
.date-weekday {
  font-size: 12px;
  color: #9CA3AF;
}
.mood-badge {
  width: 36px;
  height: 36px;
  background: rgba(139,92,246,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mood-icon {
  font-size: 20px;
}
.card-title {
  font-size: 17px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
  display: block;
}
.card-content {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  display: block;
  margin-bottom: 12px;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.04);
}
.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tag-item {
  font-size: 12px;
  color: #8B5CF6;
  background: rgba(139,92,246,0.08);
  padding: 2px 8px;
  border-radius: 8px;
}
.card-time {
  font-size: 12px;
  color: #D1D5DB;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 40px;
  gap: 12px;
}
.empty-emoji {
  font-size: 64px;
  margin-bottom: 12px;
}
.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
}
.empty-desc {
  font-size: 14px;
  color: #9CA3AF;
  margin-bottom: 20px;
}
</style>
