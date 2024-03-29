import type { MusicQuiz } from "../dtos/quiz";
import type { MusicPlayer } from "../models/music-player";
import { ref, computed, toValue } from "vue";
import type { ToastService } from "../models/toat-service";
import { useCountdown } from "./useCountdown";

export type QuizState = "idle" | "playing-music" | "finished" | "showing-track";

const NO_ANSWER = null;

const QUESTION_DURATION_IN_SECS = 30;
const QUESTION_DURATION_IN_MS = QUESTION_DURATION_IN_SECS * 1000;

export function useQuiz(
  {
    musicUrls,
    quiz,
  }: {
    musicUrls: MaybeRefOrGetter<string[]>;
    quiz: MaybeRefOrGetter<MusicQuiz | null>;
  },
  {
    musicPlayer,
    toastService,
  }: { musicPlayer: MusicPlayer; toastService: ToastService }
) {
  const index = ref(-1);

  const step = computed(() => index.value + 1);

  const question = computed(() => toValue(quiz)?.[index.value]);

  const quizState = ref<QuizState>("idle");

  const points = ref(0);

  const { seconds, start: startCountdown } = useCountdown(
    QUESTION_DURATION_IN_SECS
  );

  const handleGoodAnswer = () => {
    points.value += 1;
    toastService.showSuccessToast();
  };

  const handleBadAnswer = () => toastService.showErrorToast();

  const answer = (country: string | typeof NO_ANSWER) => {
    const correctAnswer = country === question.value?.country;
    if (correctAnswer) handleGoodAnswer();
    else handleBadAnswer();
    quizState.value = "showing-track";
  };

  const playMusicAndPassIfNoAnswer = () => {
    const questionIndex = index.value;

    musicPlayer.playMusic(toValue(musicUrls)[questionIndex]);
    startCountdown();

    setTimeout(() => {
      const isStillPlayingSameMusic =
        quizState.value === "playing-music" && index.value === questionIndex;

      if (isStillPlayingSameMusic) answer(NO_ANSWER);
    }, QUESTION_DURATION_IN_MS);
  };

  const start = () => {
    index.value = 0;
    quizState.value = "playing-music";
    playMusicAndPassIfNoAnswer();
  };

  const goToNextQuestion = () => {
    musicPlayer.stopMusic();

    index.value += 1;
    quizState.value = "playing-music";

    if (index.value === toValue(quiz)?.length) {
      quizState.value = "finished";
      return;
    }

    playMusicAndPassIfNoAnswer();
  };

  return {
    step,
    question,
    totalQuestions: computed(() => toValue(quiz)?.length),
    start,
    answer,
    points,
    quizState,
    goToNextQuestion,
    secondsRemaining: seconds,
  };
}
