<template>
  <view class="record-page">
    <!-- 自定义导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">记录经期</text>
      <text class="nav-save" @click="saveRecord">保存</text>
    </view>

    <!-- 表单区域 -->
    <view class="form-area">
      <!-- 日期选择 -->
      <view class="form-card glass-card">
        <view class="form-item" @click="selectStartDate">
          <text class="item-label">开始日期</text>
          <view class="item-right">
            <text class="item-value">{{ startDate }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="divider"></view>
        <view class="form-item">
          <text class="item-label">结束日期</text>
          <view class="item-right">
            <text class="item-value">{{ endDate }} (预计)</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 流量选择 -->
      <view class="form-card glass-card">
        <view class="form-item">
          <text class="item-label">流量</text>
          <view class="flow-select">
            <view
              v-for="i in 7"
              :key="i"
              class="flow-drop"
              :class="{'flow-active': i <= selectedFlow}"
              @click="selectedFlow = i"
            >
              💧
            </view>
          </view>
          <text class="item-arrow">›</text>
        </view>
      </view>

      <!-- 痛经程度 -->
      <view class="form-card glass-card">
        <view class="form-item column">
          <text class="item-label">痛经程度</text>
          <view class="pain-select">
            <view
              v-for="(level, index) in painLevels"
              :key="index"
              class="pain-item"
              :class="{'pain-active': selectedPain === index}"
              @click="selectedPain = index"
            >
              {{ level }}
            </view>
          </view>
        </view>
      </view>

      <!-- 情绪选择 -->
      <view class="form-card glass-card">
        <view class="form-item column">
          <text class="item-label">情绪</text>
          <view class="mood-select">
            <view
              v-for="(mood, index) in moods"
              :key="index"
              class="mood-item"
              :class="{'mood-active': selectedMood === index}"
              @click="selectedMood = index"
            >
              {{ mood.icon }}
            </view>
          </view>
        </view>
      </view>

      <!-- 开关项 -->
      <view class="form-card glass-card">
        <view class="form-item">
          <text class="item-label">是否服药</text>
          <LunaSwitch v-model="hasMedicine" />
        </view>
        <view class="divider"></view>
        <view class="form-item">
          <text class="item-label">是否性生活</text>
          <LunaSwitch v-model="hasSex" />
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-card glass-card">
        <view class="form-item">
          <text class="item-label">备注</text>
          <view class="item-right">
            <text class="item-placeholder">请输入备注（选填）</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部保存按钮 -->
    <view class="bottom-area">
      <button class="save-btn" @click="saveRecord">保存记录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LunaSwitch from '@/components/LunaSwitch.vue'
const startDate = ref('2024/05/20')
const endDate = ref('2024/05/26')
const selectedFlow = ref(4)
const painLevels = ['无', '轻度', '中度', '重度']
const selectedPain = ref(1)
const moods = [
  { icon: '😢', name: '难过' },
  { icon: '😌', name: '平静' },
  { icon: '😊', name: '开心' },
  { icon: '😫', name: '疲惫' }
]
const selectedMood = ref(3)
const hasMedicine = ref(true)
const hasSex = ref(false)
const goBack = () => uni.navigateBack()
const selectStartDate = () => {}
const saveRecord = () => {
  uni.showToast({ title: '记录已保存', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}
</script>

<style lang="scss" scoped>
.record-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  padding-bottom: 120px;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88px;
  padding-top: 44px;
  background: rgba(248,247,252,0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  z-index: 99;
}
.nav-back {
  font-size: 32px;
  font-weight: 300;
  color: #1F2937;
  width: 60px;
}
.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}
.nav-save {
  width: 60px;
  text-align: right;
  font-size: 16px;
  color: #8B5CF6;
  font-weight: 500;
}
.form-area {
  padding: 100px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  overflow: hidden;
}
.form-item {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-item.column {
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.item-label {
  font-size: 16px;
  color: #1F2937;
  font-weight: 500;
}
.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.item-value {
  font-size: 16px;
  color: #1F2937;
}
.item-placeholder {
  font-size: 16px;
  color: #9CA3AF;
}
.item-arrow {
  font-size: 24px;
  color: #9CA3AF;
}
.divider {
  height: 1px;
  background: rgba(0,0,0,0.05);
  margin: 0 20px;
}
.flow-select {
  display: flex;
  gap: 12px;
  align-items: center;
}
.flow-drop {
  font-size: 24px;
  opacity: 0.3;
  filter: grayscale(100%);
}
.flow-active {
  opacity: 1;
  filter: none;
}
.pain-select {
  display: flex;
  gap: 12px;
  width: 100%;
}
.pain-item {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  color: #6B7280;
}
.pain-active {
  background: rgba(236,72,153,0.15);
  color: #EC4899;
  font-weight: 500;
}
.mood-select {
  display: flex;
  gap: 16px;
  width: 100%;
  justify-content: space-between;
}
.mood-item {
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
.mood-active {
  background: rgba(139,92,246,0.15);
  border: 2px solid #8B5CF6;
}
.bottom-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, #F8F7FC 80%, transparent);
}
.save-btn {
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
  border-radius: 28px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(236,72,153,0.3);
  border: none;
  margin: 0;
}
.save-btn::after {
  border: none;
}
</style>
