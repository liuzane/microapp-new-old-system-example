<template>
  <el-card
    shadow="never"
    class="home-card"
  >
    <!-- 项目标题区域 -->
    <div class="project-header">
      <el-icon class="title-icon">
        <Connection />
      </el-icon>
      <h1 class="project-title">
        new-old-microapp-example
      </h1>
    </div>

    <el-divider>
      <el-icon><Star /></el-icon>
      项目概述
    </el-divider>

    <!-- 项目介绍 -->
    <div class="project-intro">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon color="#409EFF">
                  <Monitor />
                </el-icon>
                <span>核心架构</span>
              </div>
            </template>
            <p class="project-intro__description">
              基于 micro-app 微前端框架实现的新老系统无缝融合方案，让新系统与旧系统应用在同一个平台下协同工作。
            </p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon color="#67C23A">
                  <Link />
                </el-icon>
                <span>独立访问</span>
              </div>
            </template>
            <p class="project-intro__description">
              旧系统保持独立，可单独部署、正常访问；与新系统共存时互不干扰，各自稳定运行。
            </p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-divider>
      <el-icon><Tools /></el-icon>
      技术栈对比
    </el-divider>

    <!-- 技术栈对比表格 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card
          shadow="never"
          class="tech-card new-tech"
        >
          <template #header>
            <div class="card-header">
              <el-tag
                type="primary"
                size="large"
                effect="dark"
              >
                新系统
              </el-tag>
            </div>
          </template>
          <el-descriptions
            :column="1"
            border
            size="small"
          >
            <el-descriptions-item label="语言">
              <el-link
                href="https://www.typescriptlang.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="primary"
                >
                  TypeScript
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="构建工具">
              <el-link
                href="https://vitejs.dev/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="primary"
                >
                  Vite
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="微前端框架">
              <el-link
                href="https://jd-opensource.github.io/micro-app/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="primary"
                >
                  Micro App 主应用
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="框架">
              <el-link
                href="https://vuejs.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="primary"
                >
                  Vue 3
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="路由">
              <el-link
                href="https://router.vuejs.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="primary"
                >
                  Vue Router @5
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="UI 组件库">
              <el-link
                href="https://element-plus.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="primary"
                >
                  Element Plus
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="MockDB 接入方式">
              <el-link
                href="https://www.typescriptlang.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="primary"
                >
                  模块联邦
                </el-tag>
              </el-link>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card
          shadow="never"
          class="tech-card old-tech"
        >
          <template #header>
            <div class="card-header">
              <el-tag
                type="warning"
                size="large"
                effect="dark"
              >
                旧系统
              </el-tag>
              <el-link
                :href="oldSystemUrl"
                target="_blank"
                underline="never"
              >
                {{ oldSystemUrl }}
              </el-link>
            </div>
          </template>
          <el-descriptions
            :column="1"
            border
            size="small"
          >
            <el-descriptions-item label="语言">
              <el-link
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="warning"
                >
                  JavaScript
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="构建工具">
              <el-link
                href="https://cli.vuejs.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="warning"
                >
                  Vue CLI
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="微前端">
              <el-link
                href="https://jd-opensource.github.io/micro-app/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="warning"
                >
                  Micro App 微应用
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="框架">
              <el-link
                href="https://v2.vuejs.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="warning"
                >
                  Vue 2
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="路由">
              <el-link
                href="https://v3.router.vuejs.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="warning"
                >
                  Vue Router @3
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="UI 组件库">
              <el-link
                href="https://element.eleme.io/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="warning"
                >
                  Element UI
                </el-tag>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="MockDB 接入方式">
              <el-link
                href="https://www.typescriptlang.org/"
                target="_blank"
                underline="never"
              >
                <el-tag
                  size="small"
                  type="warning"
                >
                  浏览器变量
                </el-tag>
              </el-link>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-divider>
      <el-icon><InfoFilled /></el-icon>
      <span>架构亮点</span>
    </el-divider>

    <!-- 架构亮点 -->
    <el-row
      :gutter="20"
      class="feature-row"
    >
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <el-icon
            :size="32"
            color="#409EFF"
          >
            <Share />
          </el-icon>
          <h4>keep-alive 缓存</h4>
          <p>内嵌子应用完美支持 keep-alive，页面状态保持，且弹窗居中显示</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <el-icon
            :size="32"
            color="#67C23A"
          >
            <Grid />
          </el-icon>
          <h4>路由同步</h4>
          <p>新系统与旧系统路由状态自动同步，深度联动，导航体验一致</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <el-icon
            :size="32"
            color="#E6A23C"
          >
            <ChatDotRound />
          </el-icon>
          <h4>应用通信</h4>
          <p>基于 micro-app 数据通信机制，跨应用数据共享与事件传递更安全高效</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <el-icon
            :size="32"
            color="#F56C6C"
          >
            <Setting />
          </el-icon>
          <h4>渐进式升级</h4>
          <p>逐渐替换旧系统模块，无需中断业务</p>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
// 基础模块
import {
  Connection,
  Star,
  Monitor,
  Link,
  Tools,
  InfoFilled,
  Share,
  Grid,
  ChatDotRound,
  Setting,
} from '@element-plus/icons-vue';

const oldSystemUrl: string = import.meta.env.VITE_LEGACY_URL;
</script>

<style scoped>
.project-header {
  display: flex;
  align-items: center;
  padding: 16px 0 8px;
  flex-wrap: wrap;
  gap: 12px;
}

.project-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.divider {
  margin-top: 24px;
}

.title-icon {
  font-size: 28px;
  color: #409EFF;
}

.project-intro {
  margin: 16px 0 8px;
}

.intro-card {
  height: 100%;
  min-height: 100px;
}

.intro-card p {
  margin: 8px 0 0;
  color: #606266;
  line-height: 1.8;
  font-size: 14px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.tech-card {
  height: 100%;
}

.tech-card :deep(.ep-card__header) {
  background-color: #f5f7fa;
}

.new-tech :deep(.ep-card__header) {
  background-color: #ecf5ff;
}

.old-tech :deep(.ep-card__header) {
  background-color: #fdf6ec;
}

.feature-row {
  margin: 8px 0 4px;
}

.feature-item {
  text-align: center;
  padding: 20px 12px;
  border-radius: 8px;
  background: #fafafa;
  height: 100%;
  min-height: 160px;
}

.feature-item h4 {
  margin: 12px 0 8px;
  font-size: 16px;
  color: #303133;
}

.feature-item p {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
}

.ep-divider {
  margin: 28px 0 20px;
}

.ep-divider .ep-icon {
  margin: 0 8px;
}
</style>
