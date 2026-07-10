<template>
  <view class="edit-page">
    <!-- 导航栏 -->
    <LunaNavBar title="写日记" rightText="保存" @right-click="saveDiary" />

    <view class="edit-content">
      <!-- 日期选择 -->
      <view class="date-row glass-card" @click="selectDate">
        <text class="date-label">日期</text>
        <view class="date-value-wrap">
          <text class="date-value">{{ formatDateDisplay(date) }}</text>
          <text class="date-arrow">›</text>
        </view>
      </view>

      <!-- 心情选择 -->
      <view class="mood-section glass-card">
        <text class="section-label">今天的心情</text>
        <view class="mood-selector">
          <view
            v-for="(mood, index) in moods"
            :key="index"
            class="mood-item"
            :class="{ 'mood-active': selectedMood === index }"
            @click="selectedMood = index"
          >
            <text class="mood-emoji">{{ mood.icon }}</text>
            <text class="mood-name">{{ mood.name }}</text>
          </view>
        </view>
      </view>

      <!-- 标题输入 -->
      <view class="title-section">
        <input
          class="title-input"
          v-model="title"
          placeholder="给今天起个标题..."
          placeholder-class="placeholder"
        />
      </view>

      <!-- 内容输入 -->
      <view class="content-section glass-card">
        <textarea
          class="content-textarea"
          v-model="content"
          placeholder="今天发生了什么？写下你的心情和故事..."
          placeholder-class="placeholder"
          :maxlength="2000"
          auto-height
        />
        <text class="char-count">{{ content.length }}/2000</text>
      </view>

      <!-- 标签选择 -->
      <view class="tag-section glass-card">
        <text class="section-label">添加标签</text>
        <view class="tag-input-wrap">
          <view v-for="tag in tags" :key="tag" class="selected-tag">
            <text class="tag-text">#{{ tag }}</text>
            <text class="tag-remove" @click="removeTag(tag)">×</text>
          </view>
          <input
            class="tag-input"
            v-model="newTag"
            placeholder="添加标签..."
            placeholder-class="placeholder"
            @confirm="addTag"
          />
        </view>
        <view class="quick-tags">
          <text
            v-for="tag in quickTags"
            :key="tag"
            class="quick-tag"
            @click="addQuickTag(tag)"
          >#{{ tag }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useDiaryStore } from '@/store'
import { formatDate } from '@/utils'

const diaryStore = useDiaryStore()
const editId = ref<string | null>(null)
const date = ref(formatDate())
const title = ref('')
const content = ref('')
const tags = ref<string[]>([])
const newTag = ref('')
const selectedMood = ref(1)

const moods = [
  { icon: '😢', name: '难过' },
  { icon: '😌', name: '平静' },
  { icon: '😊', name: '开心' },
  { icon: '😫', name: '疲惫' },
  { icon: '🥰', name: '幸福' },
  { icon: '😤', name: '烦躁' }
]

const quickTags = ['工作', '朋友', '美食', '旅行', '运动', '学习', '家人', '爱情']

onLoad((options: any) => {
  if (options?.id) {
    editId.value = options.id
    const entry = diaryStore.getEntry(options.id)
    if (entry) {
      date.value = entry.date
      title.value = entry.title
      content.value = entry.content
      tags.value = [...entry.tags]
      const moodIdx = moods.findIndex(m => m.name === entry.mood)
      if (moodIdx !== -1) selectedMood.value = moodIdx
    }
  }
})

const formatDateDisplay = (dateStr: string) => {
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`
}

const selectDate = () => {
  // uni-app date picker
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
  }
  newTag.value = ''
}

const addQuickTag = (tag: string) => {
  if (!tags.value.includes(tag)) {
    tags.value.push(tag)
  }
}

const removeTag = (tag: string) => {
  tags.value = tags.value.filter(t => t !== tag)
}

const saveDiary = () => {
  if (!title.value.trim()) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }

  const mood = moods[selectedMood.value]

  if (editId.value) {
    diaryStore.updateEntry(editId.value, {
      date: date.value,
      title: title.value.trim(),
      content: content.value.trim(),
      mood: mood.name,
      moodIcon: mood.icon,
      tags: tags.value
    })
    uni.showToast({ title: '保存成功', icon: 'success' })
  } else {
    diaryStore.addEntry({
      date: date.value,
      title: title.value.trim(),
      content: content.value.trim(),
      mood: mood.name,
      moodIcon: mood.icon,
      tags: tags.value
    })
    uni.showToast({ title: '保存成功', icon: 'success' })
  }

  setTimeout(() => {
    uni.navigateBack()
  }, 800)
}
</script>

<style lang="scss" scoped>
.edit-page {
  min-height: 100vh;
  background: #F8F7FC;
  padding-bottom: 40px;
}
.edit-content {
  padding: 100px 20px 40px;
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
}
.date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}
.date-label {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
}
.date-value-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.date-value {
  font-size: 14px;
  color: #8B5CF6;
}
.date-arrow {
  font-size: 20px;
  color: #D1D5DB;
}
.section-label {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16px;
  display: block;
}
.mood-selector {
  display: flex;
  justify-content: space-between;
}
.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border-radius: 14px;
  transition: all 0.2s ease;
}
.mood-item.mood-active {
  background: rgba(139,92,246,0.12);
  transform: scale(1.05);
}
.mood-emoji {
  font-size: 28px;
}
.mood-name {
  font-size: 11px;
  color: #6B7280;
}
.mood-item.mood-active .mood-name {
  color: #8B5CF6;
  font-weight: 500;
}
.title-section {
  padding: 0 4px;
}
.title-input {
  width: 100%;
  font-size: 22px;
  font-weight: 700;
  color: #1F2937;
  padding: 8px 0;
}
.placeholder {
  color: #D1D5DB;
}
.content-textarea {
  width: 100%;
  min-height: 200px;
  font-size: 15px;
  color: #374151;
  line-height: 1.8;
  padding: 0;
}
.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #D1D5DB;
  margin-top: 12px;
}
.tag-input-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.selected-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(139,92,246,0.1);
  padding: 6px 12px;
  border-radius: 16px;
}
.tag-text {
  font-size: 13px;
  color: #8B5CF6;
}
.tag-remove {
  font-size: 16px;
  color: #8B5CF6;
  line-height: 1;
}
.tag-input {
  flex: 1;
  min-width: 80px;
  font-size: 13px;
  padding: 6px 0;
}
.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.quick-tag {
  font-size: 13px;
  color: #9CA3AF;
  background: #F3F4F6;
  padding: 6px 12px;
  border-radius: 16px;
}
</style>
