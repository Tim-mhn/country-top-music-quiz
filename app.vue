<template>
  <div
    class="relative flex flex-col justify-around gap-8 md:gap-16 bg-primary w-screen h-screen py-8 md:py-16"
  >
    <div class="flex justify-center items-center" v-if="quizState === 'idle'">
      <QuizControls @start-clicked="start()" />
    </div>

    <div class="z-10" v-if="quizState === 'playing-music'">
      <div
        class="text-2xl md:text-5xl font-thin text-white flex flex-col gap-1 flex-grow justify-center items-center"
      >
        Song {{ step }} / {{ totalQuestions }} <br />

        <div class="text-lg md:text-xl font-thin">
          Correct answers: {{ points }}/{{ step - 1 }}
        </div>
      </div>
    </div>

    <MusicQuiz
      :options="question?.options || []"
      class="px-[10%] z-10"
      v-if="quizState === 'playing-music'"
      @answer-clicked="(country) => answer(country)"
    />
    <AudioVisualizer
      :get-audio-spectrum="musicPlayer.getAudioSpectrum"
      v-if="quizState === 'playing-music'"
    />

    <div
      class="text-5xl text-slate-100 fixed top-1/3 bottom-1/3 left-1/3 right-1/3 flex flex-col items-center justify-center gap-4"
      v-if="quizState === 'finished'"
    >
      <div class="text-6xl font-thin">Results</div>
      <div>{{ points }} / {{ totalQuestions }}</div>
    </div>

    <TrackInfo
      Info
      class="fixed left-0 right-0 bottom-0 top-0"
      v-if="quizState === 'showing-track' && question"
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

    <Countdown
      class="mx-auto z-10 py-16"
      v-if="quizState === 'playing-music'"
      :seconds="secondsRemaining"
    />

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
import Countdown from "./src/components/Countdown.vue";
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
  secondsRemaining,
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
