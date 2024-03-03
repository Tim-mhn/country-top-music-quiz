import type { MusicPlayer } from "../models/music-player";
import type { Quiz } from "../models/quiz";
import { ref, computed, toValue } from "vue";

export type QuizState = "idle" | "in-progress" | "finished";

export function useQuiz(
  { musicUrls, quiz }: { musicUrls: MaybeRefOrGetter<string[]>; quiz: Quiz },
  musicPlayer: MusicPlayer
) {
  const index = ref(-1);

  const step = computed(() => index.value + 1);

  const question = computed(() => quiz[index.value]);

  const goToNextQuestion = () => {
    index.value += 1;
  };

  const quizState = computed<QuizState>(() => {
    if (index.value === -1) return "idle";
    if (index.value === quiz.length) return "finished";
    return "in-progress";
  });

  const finished = computed(() => quizState.value === "finished");

  const points = ref(0);

  const answer = (country: string) => {
    const correctAnswer = country === question.value.answer;
    console.log({ correctAnswer });
    if (correctAnswer) points.value += 1;
    musicPlayer.stopMusic();
    goToNextQuestion();
    musicPlayer.playMusic(toValue(musicUrls)[index.value]);
  };

  // const { playMusic, stopMusic } = usePlayMusic();

  const start = () => {
    index.value = 0;
    console.log({ musicUrls: toValue(musicUrls) });
    musicPlayer.playMusic(toValue(musicUrls)[0]);
  };

  return {
    step,
    question,
    totalQuestions: quiz.length,
    start,
    answer,
    points,
    quizState,
  };
}
