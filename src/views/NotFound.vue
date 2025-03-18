<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="not-found-code">404</h1>
      <h2 class="not-found-title">Không tìm thấy trang</h2>
      <p class="not-found-message">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <a-button type="primary" size="large" @click="goHome">
        Quay lại trang chủ
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 500px;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
  padding: 32px;
}

.not-found-code {
  font-size: 120px;
  font-weight: bold;
  color: var(--primary-color, #1890ff);
  margin: 0;
  line-height: 1.2;
}

.not-found-title {
  font-size: 24px;
  margin: 16px 0;
}

.not-found-message {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 24px;
}

:deep(.dark-theme) .not-found-message {
  color: rgba(255, 255, 255, 0.65);
}
</style>
