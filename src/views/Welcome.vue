<template>
    <div class="App">
        <header class="App-header">
            <img src="@/assets/img/logo.png" class="App-logo" alt="logo" />
            <p style="paddingTop: 64px">
                Welcome to Risk and Safety Modeling for ADS.
            </p>
        </header>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
const router = useRouter()
setTimeout(() => {
    router.push('home')
}, 2000)
</script>

<style lang='less'>
.App {
    text-align: center;
}

.App-logo {
    height: 40vmin;
    pointer-events: none;
}

/* @media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 30s linear;
  }
} */

.App-header {
    background-color: #ccc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: #222;
}

/* @keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
} */
</style>
