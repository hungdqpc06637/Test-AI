<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSettingsStore, type ThemeMode, type ThemeColor } from '@/stores/settings'

const settingsStore = useSettingsStore()

const themeMode = computed({
  get: () => settingsStore.themeMode,
  set: (value: ThemeMode) => {
    settingsStore.setThemeMode(value)
  }
})

const themeColor = computed({
  get: () => settingsStore.themeColor,
  set: (value: ThemeColor) => {
    settingsStore.setThemeColor(value)
  }
})

const colorOptions = [
  { label: 'Xanh dương', value: 'blue', color: '#1890ff' },
  { label: 'Xanh lá', value: 'green', color: '#52c41a' },
  { label: 'Tím', value: 'purple', color: '#722ed1' },
  { label: 'Đỏ', value: 'red', color: '#f5222d' },
  { label: 'Cam', value: 'orange', color: '#fa8c16' }
]

const resetSettings = () => {
  themeMode.value = 'light'
  themeColor.value = 'blue'
}

const saveSettings = () => {
  settingsStore.saveSettings()
}

watch([themeMode, themeColor], () => {
  saveSettings()
})
</script>

<template>
  <div class="settings-container">
    <a-card title="Cài đặt giao diện" :bordered="false">
      <a-form layout="vertical">
        <a-form-item label="Chế độ giao diện">
          <a-radio-group v-model:value="themeMode" button-style="solid">
            <a-radio-button value="light">
              <template #icon><bulb-outlined /></template>
              Sáng
            </a-radio-button>
            <a-radio-button value="dark">
              <template #icon><bulb-filled /></template>
              Tối
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Màu chủ đề">
          <div class="color-selector">
            <a-tooltip v-for="option in colorOptions" :key="option.value" :title="option.label">
              <div class="color-option" :class="{ active: themeColor === option.value }"
                :style="{ backgroundColor: option.color }" @click="themeColor = option.value as ThemeColor">
              </div>
            </a-tooltip>
          </div>
        </a-form-item>

        <a-form-item label="Xem trước">
          <div class="preview-container" :class="{ 'dark-preview': themeMode === 'dark' }">
            <div class="preview-header" :style="{ backgroundColor: themeMode === 'dark' ? '#001529' : '#fff' }">
              <div class="preview-logo" :style="{ color: colorOptions.find(o => o.value === themeColor)?.color }">
                Dashboard
              </div>
              <div class="preview-menu" :style="{ backgroundColor: themeMode === 'dark' ? '#001529' : '#fff' }">
                <div class="preview-menu-item active"
                  :style="{ color: colorOptions.find(o => o.value === themeColor)?.color }">
                  Dashboard
                </div>
                <div class="preview-menu-item">Báo cáo</div>
                <div class="preview-menu-item">Người dùng</div>
                <div class="preview-menu-item">Cài đặt</div>
              </div>
            </div>
            <div class="preview-content" :style="{ backgroundColor: themeMode === 'dark' ? '#141414' : '#f0f2f5' }">
              <div class="preview-card" :style="{ backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#fff' }">
                <div class="preview-card-title">Thống kê</div>
                <div class="preview-card-content">
                  <div class="preview-stat" :style="{ color: colorOptions.find(o => o.value === themeColor)?.color }">
                    4,385
                  </div>
                  <div class="preview-label">Người dùng</div>
                </div>
              </div>
              <div class="preview-card" :style="{ backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#fff' }">
                <div class="preview-card-title">Doanh thu</div>
                <div class="preview-card-content">
                  <div class="preview-stat" :style="{ color: colorOptions.find(o => o.value === themeColor)?.color }">
                    126.5M
                  </div>
                  <div class="preview-label">VND</div>
                </div>
              </div>
            </div>
          </div>
        </a-form-item>
 
        <a-form-item>
          <a-button type="primary" @click="saveSettings">
            Lưu cài đặt
          </a-button>
          <a-button style="margin-left: 8px" @click="resetSettings">
            Khôi phục mặc định
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.settings-container {
  width: 100%;
}

.color-selector {
  display: flex;
  gap: 16px;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.color-option.active {
  transform: scale(1.2);
  border-color: #d9d9d9;
}

.preview-container {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.dark-preview {
  border-color: #303030;
}

.preview-header {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.dark-preview .preview-header {
  border-color: #303030;
}

.preview-logo {
  font-weight: bold;
  font-size: 18px;
  margin-right: 48px;
}

.preview-menu {
  display: flex;
  gap: 24px;
}

.preview-menu-item {
  cursor: pointer;
  padding: 0 8px;
  color: rgba(0, 0, 0, 0.65);
}

.dark-preview .preview-menu-item {
  color: rgba(255, 255, 255, 0.65);
}

.preview-menu-item.active {
  font-weight: 500;
}

.preview-content {
  padding: 16px;
  display: flex;
  gap: 16px;
}

.preview-card {
  flex: 1;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.preview-card-title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
}

.dark-preview .preview-card-title {
  color: rgba(255, 255, 255, 0.45);
}

.preview-card-content {
  display: flex;
  flex-direction: column;
}

.preview-stat {
  font-size: 24px;
  font-weight: 500;
}

.preview-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.dark-preview .preview-label {
  color: rgba(255, 255, 255, 0.65);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    gap: 16px;
  }

  .preview-menu {
    overflow-x: auto;
  }

  .preview-content {
    flex-direction: column;
  }
}
</style>
