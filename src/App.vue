<script setup> 
</script>

<template>
  <router-view />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}

#app {
  height: 100%;
}

/* CSS Variables for theme */
:root { 
  --primary-color: #1890ff;
}

/* Dark theme */
.dark-theme {
  --primary-color: #1890ff;
  color-scheme: dark;
}
</style>
