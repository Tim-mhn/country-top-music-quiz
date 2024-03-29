import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useScoreLadderWithDeps, type ScoresStorage } from "./useScoreLadder";

const expectScore = (score: number) =>
  expect.objectContaining({
    score,
  });

const expectScores = (scores: number[]) => scores.map((sc) => expectScore(sc));

const buildScore = ({
  score,
  date = new Date(),
}: {
  score: number;
  date?: Date;
}) => ({
  score,
  date,
});

describe("Score Ladder", () => {
  const fakeScoresStorage: ScoresStorage = {
    getAllScores: () => [
      buildScore({ score: 8 }),
      buildScore({ score: 1 }),
      buildScore({ score: 3 }),
      buildScore({ score: 4 }),
      buildScore({ score: 9 }),
      buildScore({ score: 5 }),
    ],
    saveScore: () => {
      throw new Error("method not implemented");
    },
  };

  it("shows the scores in the right order", async () => {
    const { bestScores, fetch } = useScoreLadderWithDeps({
      scoresStorage: fakeScoresStorage,
    });

    await fetch();

    expect(bestScores.value).toEqual(expectScores([9, 8, 5, 4, 3]));
  });

  it('marks the latest score as the user"s score', async () => {
    const fakeScoresStorage: ScoresStorage = {
      saveScore: () => {
        throw new Error("not implemented");
      },
      getAllScores: () => [
        buildScore({ score: 7, date: new Date("2022/02/18") }),
        buildScore({ score: 1, date: new Date("2022/02/18") }),
        buildScore({ score: 3, date: new Date() }),
      ],
    };
    const { bestScores, fetch } = useScoreLadderWithDeps({
      scoresStorage: fakeScoresStorage,
    });

    await fetch();

    expect(bestScores.value[1]).toEqual(
      expect.objectContaining({
        score: 3,
        isLatestScore: true,
      })
    );
  });
});
