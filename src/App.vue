<template>
  <router-view />
</template>

<script setup lang="ts"></script>

<style lang="css">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}
body {
  width: 100vw;
  height: 100vh;
  background-color: var(--color-primary);
}
</style>
