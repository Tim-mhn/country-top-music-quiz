<template>
  <div
    class="flex flex-col text-slate-100 text-lg w-screen h-screen items-center justify-center gap-16"
  >
    <div class="text-4xl md:text-7xl font-thin">Best Results</div>
    <div class="flex flex-col gap-4 md:gap-8 text-xl md:text-3xl font-semibold">
      <div v-for="(score, index) of bestScores" :key="score.date.getTime()">
        <span class="font-thin">{{ index + 1 }}.</span>
        <span
          :class="{
            'text-slate-100': !score.isLatestScore,
            'text-blue-300': score.isLatestScore,
          }"
        >
          {{ score.score }} pts
          <span v-if="score.isLatestScore" class="text-sm">(you)</span>
        </span>
      </div>
    </div>

    <NuxtLink to="quiz" class="pt-8">
      <button
        class="text-6xl text-tertiary font-semibold hover:text-tertiary-hover"
      >
        Try again
      </button>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { useScoreLadder } from "~/src/composables/useScoreLadder";

const { bestScores, fetch } = useScoreLadder();

onMounted(() => fetch());
</script>
