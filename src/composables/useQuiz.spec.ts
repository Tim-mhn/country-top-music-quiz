import { describe, it, expect, vi, beforeEach } from "vitest";
import { type Quiz } from "../models/quiz";
import type { MusicPlayer } from "../models/music-player";
import { type QuizState, useQuiz } from "./useQuiz";
import { quizBuilder } from "../models/quiz.mock";

describe("useQuiz", () => {
  const musicUrls = ["music-1.mp3", "music-2.mp3", "music-3.mp3"];

  let musicPlayer!: MusicPlayer;

  const quiz: Quiz = quizBuilder()
    .addQuestion({
      answer: "France",
      otherOptions: ["Italy", "Spain"],
    })
    .addQuestion({
      answer: "Spain",
      otherOptions: ["France", "Italy"],
    })
    .addQuestion({
      answer: "USA",
      otherOptions: ["France", "Spain"],
    })
    .build();

  beforeEach(() => {
    musicPlayer = {
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
    };
  });
  it("plays the first music when starting the quiz", () => {
    const { start } = useQuiz({ musicUrls, quiz }, musicPlayer);

    start();

    expect(musicPlayer.playMusic).toHaveBeenCalledWith("music-1.mp3");
  });

  it("plays the second music when answering one question", () => {
    const { start, answer } = useQuiz({ musicUrls, quiz }, musicPlayer);

    start();

    answer("France");

    expect(musicPlayer.playMusic).toHaveBeenCalledTimes(2);
    expect(musicPlayer.playMusic).toHaveBeenCalledWith("music-2.mp3");
  });

  it("correctly updates the points", () => {
    const { start, answer, points } = useQuiz({ musicUrls, quiz }, musicPlayer);

    start();

    answer("France");
    answer("France");
    answer("USA");

    expect(points.value).toEqual(2);
  });

  it("marks the quiz as finished when answering all questions", () => {
    const { start, answer, quizState } = useQuiz(
      { musicUrls, quiz },
      musicPlayer
    );

    expect(quizState.value).toEqual<QuizState>("idle");

    start();
    expect(quizState.value).toEqual<QuizState>("in-progress");

    answer("France");
    answer("France");

    expect(quizState.value).toEqual<QuizState>("in-progress");

    answer("France");
    expect(quizState.value).toEqual<QuizState>("finished");
  });
});
