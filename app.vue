<template>
  <div class="relative bg-primary w-screen h-screen">
    <div
      class="fixed flex justify-center items-center left-[10%] right-[10%] top-[10%] bottom-[10%] md:left-[20%] md:right-[20%] md:top-1/4 md:bottom-1/4"
    >
      <QuizControls @start-clicked="start()" v-if="quizState === 'idle'" />
    </div>

    <MusicQuiz
      :options="question?.options"
      class="left-[10%] right-[10%] md:left-1/4 md:right-1/4 bottom-1/4 z-10 fixed"
      v-if="quizState === 'playing-music'"
      @answer-clicked="(country) => answer(country)"
    />
    <AudioVisualizer
      :get-audio-spectrum="musicPlayer.getAudioSpectrum"
      v-if="quizState === 'playing-music'"
    />

    <div
      class="fixed left-[10%] right-[10%] md:left-1/4 md:right-1/4 top-0 pt-16"
      v-if="quizState === 'playing-music'"
    >
      <div
        class="text-2xl md:text-5xl font-thin text-white flex flex-col gap-1 flex-grow justify-center items-center"
      >
        Song {{ step }} / {{ totalQuestions }} <br />

        <div class="text-lg md:text-xl font-thin">
          Correct answers: {{ points }}/{{ step - 1 }}
        </div>
      </div>
    </div>

    <div
      class="text-5xl text-slate-100 fixed top-1/3 bottom-1/3 left-1/3 right-1/3 flex flex-col items-center justify-center gap-4"
      v-if="quizState === 'finished'"
    >
      <div class="text-6xl font-thin">Results</div>
      <div>{{ points }} / {{ totalQuestions }}</div>
    </div>

    <TrackInfo
      class="fixed left-0 right-0 bottom-0 top-0"
      v-if="quizState === 'showing-track'"
      :track="question.track"
      :country="question.country"
    >
      <button
        @click="goToNextQuestion"
        class="text-4xl text-slate-100 font-semibold hover:text-slate-500"
      >
        Continue
      </button>
    </TrackInfo>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Button from "primevue/button";
import TrackInfo from "./src/components/TrackInfo.vue";
import Toast from "primevue/toast";

import AudioVisualizer from "./src/components/AudioVisualizer.vue";
import QuizControls from "./src/components/QuizControls.vue";
import MusicQuiz from "./src/components/MusicQuiz.vue";

import { useFetchTracksQuiz } from "./src/composables/useFetchTracksQuiz";
import { useMusicPlayer } from "./src/composables/useMusicPlayer";
import { useQuiz } from "./src/composables/useQuiz";
import { useToastService } from "./src/composables/useToastService";

const { data: quizTracks } = await useFetchTracksQuiz();

const toastService = useToastService();

const musicUrls = computed<string[]>(() => {
  if (!quizTracks.value) return [];
  const urls = quizTracks.value.map(({ track }) => track.url);

  return urls;
});

watch(quizTracks, (p) => {
  console.log(p);
});

const musicPlayer = useMusicPlayer();

const {
  question,
  step,
  totalQuestions,
  start,
  answer,
  points,
  quizState,
  goToNextQuestion,
} = useQuiz({ musicUrls, quiz: quizTracks }, { musicPlayer, toastService });
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
