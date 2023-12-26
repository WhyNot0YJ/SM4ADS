<script setup lang="ts">
</script>

<template>
  <router-view></router-view>
</template>

<style lang="less">
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
  height: 100vh;
  padding: 0 !important;
  margin: 0 !important;
  flex-direction: column;
  flex-wrap: wrap;
  display: flex;
}
.uml-wrapper{
  .uml-head{
    .uml-title{
       font-weight: bold;
       font-size: 16px;
    }
  }
}


</style>
