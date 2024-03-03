import type { MusicQuiz } from "../dtos/quiz";
import type { MusicPlayer } from "../models/music-player";
import { ref, computed, toValue } from "vue";
import type { ToastService } from "../models/toat-service";

export type QuizState = "idle" | "playing-music" | "finished" | "showing-track";

export function useQuiz(
  {
    musicUrls,
    quiz,
  }: {
    musicUrls: MaybeRefOrGetter<string[]>;
    quiz: MaybeRefOrGetter<MusicQuiz>;
  },
  {
    musicPlayer,
    toastService,
  }: { musicPlayer: MusicPlayer; toastService: ToastService }
) {
  const index = ref(-1);

  const step = computed(() => index.value + 1);

  const question = computed(() => toValue(quiz)[index.value]);

  const quizState = ref<QuizState>("idle");

  const points = ref(0);

  const handleGoodAnswer = () => {
    points.value += 1;
    toastService.showSuccessToast();
  };

  const handleBadAnswer = () => toastService.showErrorToast();

  const answer = (country: string) => {
    const correctAnswer = country === question.value.country;
    if (correctAnswer) handleGoodAnswer();
    else handleBadAnswer();
    quizState.value = "showing-track";
  };

  const start = () => {
    index.value = 0;
    quizState.value = "playing-music";
    musicPlayer.playMusic(toValue(musicUrls)[0]);
  };

  const goToNextQuestion = () => {
    musicPlayer.stopMusic();

    index.value += 1;
    quizState.value = "playing-music";

    if (index.value === toValue(quiz).length) {
      quizState.value = "finished";
      return;
    }

    musicPlayer.playMusic(toValue(musicUrls)[index.value]);
  };

  return {
    step,
    question,
    totalQuestions: computed(() => toValue(quiz).length),
    start,
    answer,
    points,
    quizState,
    goToNextQuestion,
  };
}
