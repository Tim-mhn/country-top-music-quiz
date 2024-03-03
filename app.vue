<template>
  <div class="relative">
    <div
      class="fixed flex justify-center items-center left-1/3 right-1/3 top-1/3 bottom-1/3"
    >
      <QuizControls @start-clicked="start()" v-if="quizState === 'idle'" />
    </div>

    <MusicQuiz
      :options="question?.options"
      class="top-1/4 left-1/4 right-1/4 bottom-1/4 z-10 fixed"
      v-if="quizState === 'in-progress'"
      @answer-clicked="(country) => answer(country)"
    />
    <AudioVisualizer v-if="quizState === 'in-progress'" />

    <div
      class="fixed left-1/4 right-1/4 bottom-[10%]"
      v-if="quizState === 'in-progress'"
    >
      <div
        class="text-5xl text-slate-300 font-semibold flex flex-grow justify-center items-center"
      >
        Song {{ step }} / {{ totalQuestions }} <br />Points =
        {{ points }}
      </div>
    </div>

    <div
      class="text-5xl text-slate-800 fixed top-1/3 bottom-1/3 left-1/3 right-1/3 flex flex-col items-center justify-center"
      v-if="quizState === 'finished'"
    >
      <div>Results</div>
      <div>{{ points }} / {{ totalQuestions }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import AudioVisualizer from "./src/components/AudioVisualizer.vue";
import QuizControls from "./src/components/QuizControls.vue";
import MusicQuiz from "./src/components/MusicQuiz.vue";

import { useFetchTracksQuiz } from "./src/composables/useFetchTracksQuiz";
import { useMusicPlayer } from "./src/composables/useMusicPlayer";
import { useQuiz } from "./src/composables/useQuiz";

const { data: quizTracks } = await useFetchTracksQuiz();

const musicUrls = computed<string[]>(() => {
  if (!quizTracks.value) return [];
  const urls = quizTracks.value.map(({ track }) => track.url);

  return urls;
});

watch(quizTracks, (p) => {
  console.log(p);
});

const musicPlayer = useMusicPlayer();

const { question, step, totalQuestions, start, answer, points, quizState } =
  useQuiz({ musicUrls, quiz: quizTracks }, musicPlayer);
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
./src/composables/getMusic./src/composables/useFetchTracksQuiz
