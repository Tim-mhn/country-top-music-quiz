export const randomNumber = ({ min, max }: { min: number; max: number }) =>
  Math.floor(Math.random() * (max - min)) + min;

export const randomElement = <T>(arr: T[]) => {
  const randomIndex = randomNumber({ min: 0, max: arr.length });
  return arr[randomIndex];
};
