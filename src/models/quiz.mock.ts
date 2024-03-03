import type { MusicQuiz } from "../dtos/quiz";

const allCountries = [
  "USA",
  "France",
  "Italy",
  "Spain",
  "Hong Kong",
  "Russia",
  "Ireland",
  "Egypt",
  "Japan",
  "Korea",
  "Portugal",
  "Slovakia",
  "Germany",
];

const pickRandomElements = <T>(
  arr: T[],
  { elementsCount }: { elementsCount: number }
) => {
  let copy = [...arr];

  const pickedElements: T[] = [];

  while (pickedElements.length < elementsCount) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    const nextElement = copy[randomIndex];
    pickedElements.push(nextElement);
    copy = copy.filter((el) => el !== nextElement);
  }

  return pickedElements;
};

export const getCountriesDifferentThan = ({
  country,
  count,
}: {
  country: string;
  count: number;
}) => allCountries.filter((c) => c !== country).slice(0, count);

export const QUIZ = allCountries.map((country) => ({
  answer: country,
  options: [
    country,
    ...pickRandomElements(
      allCountries.filter((c) => c !== country),
      { elementsCount: 3 }
    ),
  ].sort(),
}));

export const quizBuilder = (_quiz: MusicQuiz = []) => {
  const addQuestion = ({
    answer,
    otherOptions,
  }: {
    answer: string;
    otherOptions: string[];
  }) => {
    const quiz = [
      ..._quiz,
      { country: answer, options: [answer, ...otherOptions], track: {} as any },
    ];

    return quizBuilder(quiz);
  };

  const build = () => _quiz;

  return { addQuestion, build };
};
