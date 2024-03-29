<template>
  <div
    class="relative flex flex-col justify-around gap-8 md:gap-16 bg-primary w-screen h-screen py-8 md:py-16"
  >
    <div class="flex justify-center items-center">
      <QuizControls @start-clicked="start()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import QuizControls from "../src/components/QuizControls.vue";

const start = () => navigateTo("quiz");
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
