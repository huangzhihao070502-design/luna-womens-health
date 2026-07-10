<template>
  <view class="about-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">‹</view>
      <text class="nav-title">关于 Luna</text>
      <view class="nav-spacer"></view>
    </view>

    <!-- Logo 和版本 -->
    <view class="brand-section">
      <view class="brand-logo">
        <view class="logo-icon">
          <view class="logo-moon">
            <view class="moon-shape"></view>
          </view>
        </view>
      </view>
      <text class="brand-name">Luna</text>
      <text class="brand-version">Version 1.0.0</text>
      <text class="brand-desc">你的专属健康伴侣</text>
    </view>

    <!-- 功能介绍 -->
    <view class="section-card glass-card">
      <text class="section-title">✨ 核心功能</text>
      <view class="feature-list">
        <view class="feature-item">
          <text class="feature-icon">📅</text>
          <view class="feature-info">
            <text class="feature-name">经期追踪</text>
            <text class="feature-desc">智能预测周期，记录经期症状</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🌙</text>
          <view class="feature-info">
            <text class="feature-name">睡眠分析</text>
            <text class="feature-desc">追踪睡眠质量，提供改善建议</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">💛</text>
          <view class="feature-info">
            <text class="feature-name">心情日记</text>
            <text class="feature-desc">记录每日心情，发现情绪规律</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🤖</text>
          <view class="feature-info">
            <text class="feature-name">AI 智能预测</text>
            <text class="feature-desc">96%准确率的经期预测模型</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📊</text>
          <view class="feature-info">
            <text class="feature-name">数据统计</text>
            <text class="feature-desc">可视化你的健康数据趋势</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📄</text>
          <view class="feature-info">
            <text class="feature-name">健康报告</text>
            <text class="feature-desc">一键生成综合健康评估报告</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 技术信息 -->
    <view class="section-card glass-card">
      <text class="section-title">🔧 技术信息</text>
      <view class="info-row">
        <text class="info-label">框架</text>
        <text class="info-value">uni-app (Vue 3 + TypeScript)</text>
      </view>
      <view class="info-row">
        <text class="info-label">状态管理</text>
        <text class="info-value">Pinia</text>
      </view>
      <view class="info-row">
        <text class="info-label">数据存储</text>
        <text class="info-value">本地加密存储</text>
      </view>
      <view class="info-row">
        <text class="info-label">隐私保护</text>
        <text class="info-value">所有数据仅存储在本地</text>
      </view>
    </view>

    <!-- 链接 -->
    <view class="section-card glass-card">
      <text class="section-title">📎 相关链接</text>
      <view class="link-item" @click="handleLink('privacy')">
        <text class="link-text">隐私政策</text>
        <text class="link-arrow">›</text>
      </view>
      <view class="link-item" @click="handleLink('terms')">
        <text class="link-text">用户协议</text>
        <text class="link-arrow">›</text>
      </view>
      <view class="link-item" @click="handleLink('help')">
        <text class="link-text">帮助中心</text>
        <text class="link-arrow">›</text>
      </view>
      <view class="link-item" @click="handleContact">
        <text class="link-text">联系我们</text>
        <text class="link-arrow">›</text>
      </view>
    </view>

    <!-- 版权 -->
    <view class="copyright">
      <text class="copyright-text">© 2024 Luna Team. All rights reserved.</text>
      <text class="copyright-sub">Made with 💜 for every woman</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleLink = (type: string) => {
  uni.showToast({ title: '页面开发中', icon: 'none' })
}

const handleContact = () => {
  uni.showToast({ title: '客服邮箱: support@luna.app', icon: 'none' })
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.about-page {
  width: 100vw;
  min-height: 100vh;
  background: #F8F7FC;
  padding-bottom: 40px;
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
.nav-spacer { width: 60px; }

/* 品牌区域 */
.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 0 32px;
}
.brand-logo {
  margin-bottom: 16px;
}
.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(139,92,246,0.35);
}
.logo-moon {
  width: 40px;
  height: 40px;
}
.moon-shape {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: inset -10px 3px 0 0 #ffffff;
  transform: rotate(-45deg);
}
.brand-name {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 4px;
}
.brand-version {
  font-size: 14px;
  color: #9CA3AF;
  margin-bottom: 8px;
}
.brand-desc {
  font-size: 15px;
  color: #6B7280;
}

/* 卡片 */
.glass-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(139,92,246,0.06);
  padding: 20px;
  margin: 0 20px 16px;
}
.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1F2937;
  display: block;
  margin-bottom: 16px;
}

/* 功能列表 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.feature-icon {
  font-size: 24px;
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}
.feature-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.feature-name {
  font-size: 15px;
  font-weight: 500;
  color: #1F2937;
}
.feature-desc {
  font-size: 13px;
  color: #9CA3AF;
}

/* 技术信息 */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(139,92,246,0.06);
}
.info-row:last-child {
  border-bottom: none;
}
.info-label {
  font-size: 14px;
  color: #6B7280;
}
.info-value {
  font-size: 14px;
  color: #1F2937;
  font-weight: 500;
}

/* 链接 */
.link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(139,92,246,0.06);
}
.link-item:last-child {
  border-bottom: none;
}
.link-text {
  font-size: 15px;
  color: #1F2937;
}
.link-arrow {
  font-size: 20px;
  color: #D1D5DB;
}

/* 版权 */
.copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 32px 0;
}
.copyright-text {
  font-size: 13px;
  color: #9CA3AF;
}
.copyright-sub {
  font-size: 12px;
  color: #D1D5DB;
}
</style>
