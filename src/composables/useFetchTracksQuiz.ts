import camelcaseKeys from "camelcase-keys";
import type { MusicQuiz } from "../dtos/quiz";
import { computed } from "vue";

export async function useFetchTracksQuiz() {
  const { data, pending, error } = await useFetch<MusicQuiz>("/api/quiz");

  const musicQuiz = computed<MusicQuiz | null>(() => {
    if (!data.value) return null;
    return camelcaseKeys(data.value, { deep: true });
  });

  return {
    pending,
    error,
    data: musicQuiz,
  };
}
