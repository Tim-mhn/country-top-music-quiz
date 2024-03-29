import { ref } from "vue";
import { useStorage } from "@vueuse/core";

type Score = {
  score: number;
  date: Date;
};

export interface ScoresStorage {
  getAllScores(): Promise<Score[]> | Score[];
  saveScore(newScore: number): Promise<void> | void;
}

export function useScoreLadderWithDeps({
  scoresStorage,
}: {
  scoresStorage: ScoresStorage;
}) {
  const bestScores = ref<(Score & { isLatestScore: boolean })[]>([]);

  async function fetch() {
    const allScores = await scoresStorage.getAllScores();

    const latestTime = Math.max(...allScores.map((s) => s.date.getTime()));

    bestScores.value = allScores
      .toSorted((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((score) => ({
        ...score,
        isLatestScore: score.date.getTime() === latestTime,
      }));
  }

  return { bestScores, saveScore: scoresStorage.saveScore, fetch };
}

const SCORES_KEY = "scores" as const;

export function useScoreLadder() {
  const storage = useStorage<Score[]>(SCORES_KEY, [], undefined, {
    serializer: {
      write: (scores: Score[]) => {
        const stringified = JSON.stringify(
          scores.map((sc) => ({
            ...sc,
            date: sc.date.getTime(),
          }))
        );

        return stringified;
      },
      read: (stringifiedScores) => {
        try {
          return (
            (
              (JSON.parse(stringifiedScores || "") || []) as Array<{
                score: number;
                date: number;
              }>
            )?.map((sc) => ({
              score: sc.score,
              date: new Date(sc.date),
            })) || []
          );
        } catch (err) {
          return [];
        }
      },
    },
  });

  const scoresLocalStorage: ScoresStorage = {
    getAllScores: () => {
      return storage.value;
    },
    saveScore: (score) => {
      const now = new Date();
      storage.value = [
        ...(storage.value || []),
        {
          date: now,
          score,
        },
      ];
    },
  };
  return useScoreLadderWithDeps({
    scoresStorage: scoresLocalStorage,
  });
}
