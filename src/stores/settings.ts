import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'
export type ThemeColor = 'blue' | 'green' | 'purple' | 'red' | 'orange'

interface SettingsState {
  themeMode: ThemeMode
  themeColor: ThemeColor
  sidebarCollapsed: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('dashboard-settings')
    const defaultSettings: SettingsState = {
      themeMode: 'light',
      themeColor: 'blue',
      sidebarCollapsed: false
    }
    
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings
  },
  
  getters: {
    isDarkMode: (state) => state.themeMode === 'dark',
    primaryColor: (state) => {
      const colors = {
        blue: '#1890ff',
        green: '#52c41a',
        purple: '#722ed1',
        red: '#f5222d',
        orange: '#fa8c16'
      }
      return colors[state.themeColor]
    }
  },
  
  actions: {
    setThemeMode(mode: ThemeMode) {
      this.themeMode = mode
      this.saveSettings()
    },
    
    setThemeColor(color: ThemeColor) {
      this.themeColor = color
      this.saveSettings()
    },
    
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      this.saveSettings()
    },
    
    saveSettings() {
      localStorage.setItem('dashboard-settings', JSON.stringify({
        themeMode: this.themeMode,
        themeColor: this.themeColor,
        sidebarCollapsed: this.sidebarCollapsed
      }))
    }
  }
})
