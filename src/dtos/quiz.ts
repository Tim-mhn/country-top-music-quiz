type Country = string;

export type Track = {
  artist: string;
  name: string;
  url: string;
  image: string;
  position: number;
};
export type MusicQuiz = Array<{
  country: Country;
  track: Track;
  options: Country[];
}>;
