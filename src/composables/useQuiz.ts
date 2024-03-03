import type { MusicQuiz } from "../dtos/quiz";
import type { MusicPlayer } from "../models/music-player";
import { ref, computed, toValue } from "vue";

export type QuizState = "idle" | "in-progress" | "finished";

export function useQuiz(
  {
    musicUrls,
    quiz,
  }: {
    musicUrls: MaybeRefOrGetter<string[]>;
    quiz: MaybeRefOrGetter<MusicQuiz>;
  },
  musicPlayer: MusicPlayer
) {
  const index = ref(-1);

  const step = computed(() => index.value + 1);

  const question = computed(() => toValue(quiz)[index.value]);

  const goToNextQuestion = () => {
    index.value += 1;
  };

  const quizState = computed<QuizState>(() => {
    if (index.value === -1) return "idle";
    if (index.value === toValue(quiz).length) return "finished";
    return "in-progress";
  });

  const points = ref(0);

  const answer = (country: string) => {
    const correctAnswer = country === question.value.country;
    if (correctAnswer) points.value += 1;
    musicPlayer.stopMusic();
    goToNextQuestion();

    if (quizState.value === "finished") return;
    musicPlayer.playMusic(toValue(musicUrls)[index.value]);
  };

  const start = () => {
    index.value = 0;
    musicPlayer.playMusic(toValue(musicUrls)[0]);
  };

  return {
    step,
    question,
    totalQuestions: computed(() => toValue(quiz).length),
    start,
    answer,
    points,
    quizState,
  };
}
