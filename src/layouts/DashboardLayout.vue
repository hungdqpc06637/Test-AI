<script setup lang="ts">
import { ref, computed, watch, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'
const { darkAlgorithm, defaultAlgorithm } = theme
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'

const settingsStore = useSettingsStore()
const userStore = useUserStore()
const router = useRouter()

const collapsed = computed({
  get: () => settingsStore.sidebarCollapsed,
  set: (value) => {
    settingsStore.sidebarCollapsed = value
    settingsStore.saveSettings()
  }
})

const isDarkMode = computed(() => settingsStore.isDarkMode)
const themeColor = computed(() => settingsStore.primaryColor)

const currentUser = computed(() => userStore.currentUser)

// Set default user for demo
onMounted(() => {
  if (!currentUser.value) {
    userStore.setCurrentUser(userStore.users[0])
  }
})

const menuItems = [
  {
    key: 'dashboard',
    icon: () => h(DashboardOutlined),
    label: 'Dashboard',
    path: '/'
  },
  {
    key: 'reports',
    icon: () => h(BarChartOutlined),
    label: 'Báo cáo',
    path: '/reports'
  },
  {
    key: 'users',
    icon: () => h(UserOutlined),
    label: 'Người dùng',
    path: '/users'
  },
  {
    key: 'settings',
    icon: () => h(SettingOutlined),
    label: 'Cài đặt',
    path: '/settings'
  }
]

const selectedKeys = ref<string[]>(['dashboard'])

// Update selected menu item based on route
watch(
  () => router.currentRoute.value.path,
  (path) => {
    const route = menuItems.find(item => {
      if (item.path === '/') {
        return path === '/'
      }
      return path.startsWith(item.path)
    })
    if (route) {
      selectedKeys.value = [route.key]
    }
  },
  { immediate: true }
)

const handleMenuClick = (key: string | number) => {
  const item = menuItems.find(item => item.key === key)
  if (item) {
    router.push(item.path)
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

// Apply theme color to CSS variables
const updateThemeVariables = () => {
  document.documentElement.style.setProperty('--primary-color', themeColor.value)
  document.documentElement.classList.toggle('dark-theme', isDarkMode.value)
}

watch([themeColor, isDarkMode], updateThemeVariables, { immediate: true })
onMounted(updateThemeVariables)
</script>

<template>
  <a-config-provider :theme="{
    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: themeColor,
    },
  }">
    <a-layout class="dashboard-layout">
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        :width="256"
        :class="{ 'sidebar-dark': isDarkMode }"
        :style="{ backgroundColor: isDarkMode ? '#001529' : '#fff' }"
      >
        <div class="logo">
          <h1 v-if="!collapsed">Dashboard</h1>
          <h1 v-else>D</h1>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          :theme="isDarkMode ? 'dark' : 'light'"
          mode="inline"
          @click="(info) => handleMenuClick(info.key)"
        >
          <a-menu-item v-for="item in menuItems" :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <span>{{ item.label }}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="header">
          <div class="header-left">
            <a-button
              type="text"
              :icon="collapsed ? h(MenuUnfoldOutlined) : h(MenuFoldOutlined)"
              @click="collapsed = !collapsed"
              class="trigger-btn"
            />
            <h2 class="page-title">{{ menuItems.find(item => item.key === selectedKeys[0])?.label }}</h2>
          </div>
          <div class="header-right">
            <a-dropdown>
              <div class="user-info">
                <a-avatar :src="currentUser?.avatar" />
                <span v-if="!collapsed" class="username">{{ currentUser?.name }}</span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <user-outlined />
                    Hồ sơ
                  </a-menu-item>
                  <a-menu-item key="settings" @click="router.push('/settings')">
                    <setting-outlined />
                    Cài đặt
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <logout-outlined />
                    Đăng xuất
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content class="content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
}

.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color, #1890ff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.logo h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-dark .logo {
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.header {
  padding: 0 24px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.dark-theme .header {
  background: #001529;
  color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.trigger-btn {
  font-size: 18px;
  margin-right: 12px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  min-height: 280px;
}

.dark-theme .content {
  background: #141414;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header {
    padding: 0 12px;
  }
  
  .content {
    margin: 12px;
    padding: 16px;
  }
  
  .username {
    display: none;
  }
}
</style>
