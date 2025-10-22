<template>
  <HomePage class="bg-white" />
</template>

<script setup lang="ts">
import HomePage from './pages/HomePage.vue'
</script>

<style lang="css">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

body {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* background-image: url('/court1.JPG');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  backdrop-filter: blur(1.8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: -1; */
}
</style>
