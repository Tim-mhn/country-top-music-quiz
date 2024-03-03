type Country = string;

export type MusicQuiz = Array<{
  country: Country;
  track: {
    artist: string;
    name: string;
    url: string;
  };
  options: Country[];
}>;
