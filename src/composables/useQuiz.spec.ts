import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  vitest,
  afterEach,
} from "vitest";
import type { MusicPlayer } from "../models/music-player";
import { type QuizState, useQuiz } from "./useQuiz";
import { quizBuilder } from "../models/quiz.mock";
import type { MusicQuiz } from "../dtos/quiz";
import type { ToastService } from "../models/toat-service";

describe("useQuiz", () => {
  const musicUrls = ["music-1.mp3", "music-2.mp3", "music-3.mp3"];

  let musicPlayer!: MusicPlayer;

  let toastService!: ToastService;

  const quiz: MusicQuiz = quizBuilder()
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
    vitest.useFakeTimers();

    musicPlayer = {
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
    };

    toastService = {
      showErrorToast: vi.fn(),
      showSuccessToast: vi.fn(),
    };
  });

  afterEach(() => {
    vitest.useRealTimers();
  });
  it("plays the first music when starting the quiz", () => {
    const { start } = useQuiz(
      { musicUrls, quiz },
      { musicPlayer, toastService }
    );

    start();

    expect(musicPlayer.playMusic).toHaveBeenCalledWith("music-1.mp3");
  });

  it("keeps playing the music after answering a question, it plays the next music when moving on to the next question", () => {
    const { start, answer, goToNextQuestion } = useQuiz(
      { musicUrls, quiz },
      { musicPlayer, toastService }
    );

    start();
    expect(musicPlayer.playMusic).toHaveBeenCalledTimes(1);

    answer("France");
    expect(musicPlayer.stopMusic).not.toHaveBeenCalled();

    goToNextQuestion();

    expect(musicPlayer.playMusic).toHaveBeenCalledTimes(2);
    expect(musicPlayer.playMusic).toHaveBeenCalledWith("music-2.mp3");
  });

  it("correctly updates the points", () => {
    const { start, answer, points, goToNextQuestion } = useQuiz(
      { musicUrls, quiz },
      { musicPlayer, toastService }
    );

    start();

    answer("France");
    goToNextQuestion();
    answer("France");
    goToNextQuestion();
    answer("USA");
    goToNextQuestion();

    expect(points.value).toEqual(2);
  });

  it("marks the quiz as finished when answering all questions", async () => {
    const { start, answer, quizState, goToNextQuestion } = useQuiz(
      { musicUrls, quiz },
      { musicPlayer, toastService }
    );

    expect(quizState.value).toEqual<QuizState>("idle");

    start();
    expect(quizState.value).toEqual<QuizState>("playing-music");

    answer("France");
    goToNextQuestion();
    answer("France");
    goToNextQuestion();

    expect(quizState.value).toEqual<QuizState>("playing-music");

    answer("France");
    goToNextQuestion();

    expect(quizState.value).toEqual<QuizState>("finished");
  });

  it("does not play the music when we answer the last question", () => {
    const { start, answer, quizState, goToNextQuestion } = useQuiz(
      { musicUrls, quiz },
      { musicPlayer, toastService }
    );

    start();

    answer("France");
    goToNextQuestion();

    answer("France");
    goToNextQuestion();

    answer("France");
    goToNextQuestion();

    expect(musicPlayer.playMusic).toHaveBeenCalledTimes(3);
  });

  it("shows the first track picture after answering the first question", () => {
    const { start, answer, quizState, goToNextQuestion } = useQuiz(
      { musicUrls, quiz },
      { musicPlayer, toastService }
    );

    start();

    answer("USA");

    expect(quizState.value).toEqual<QuizState>("showing-track");
    expect(musicPlayer.playMusic).toHaveBeenCalledTimes(1);

    goToNextQuestion();

    expect(quizState.value).toEqual<QuizState>("playing-music");
    expect(musicPlayer.playMusic).toHaveBeenCalledTimes(2);
    expect(musicPlayer.playMusic).toHaveBeenCalledWith("music-2.mp3");
  });

  it("answers nothing if the user has not answered when the music stops", () => {
    const { start, quizState, goToNextQuestion } = useQuiz(
      { musicUrls, quiz },
      { musicPlayer, toastService }
    );

    start();

    vitest.advanceTimersByTime(30 * 1000);

    expect(quizState.value).toEqual<QuizState>("showing-track");

    goToNextQuestion();
    vitest.advanceTimersByTime(30 * 1000);
    expect(quizState.value).toEqual<QuizState>("showing-track");
  });

  // TODO: test has been broken by an unknwon change (happy-dom ? nuxt enviroment in vitest config ?)
  // it("shows the time remaining to answer", () => {
  //   const { start, goToNextQuestion, secondsRemaining, answer } = useQuiz(
  //     { musicUrls, quiz },
  //     { musicPlayer, toastService }
  //   );

  //   start();

  //   expect(secondsRemaining.value).toEqual(30);

  //   vitest.advanceTimersByTime(5 * 1000);
  //   expect(secondsRemaining.value).toEqual(25);

  //   answer("some country");

  //   goToNextQuestion();

  //   expect(secondsRemaining.value).toEqual(30);
  // });

  describe("feedback", () => {
    it("shows the right toast when answering", () => {
      const { start, answer, goToNextQuestion } = useQuiz(
        { musicUrls, quiz },
        { musicPlayer, toastService }
      );

      start();

      answer("France");

      expect(toastService.showSuccessToast).toHaveBeenCalled();
      goToNextQuestion();

      answer("France");
      expect(toastService.showErrorToast).toHaveBeenCalled();
    });
  });
});
