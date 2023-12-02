<script setup lang="ts">
</script>

<template>
  <router-view></router-view>
</template>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
}

#app {
  height: 100%;
  width: 100%;
}

svg {
  display: block;
}

.lf-dndpanel {
  max-height: 100vh;
  flex-direction: column;
  flex-wrap: wrap;
  display: flex;
}
</style>
