const barsCount = 100;
const maxHeight = 1000;

const nextDataArray = (currentDataArray: number[]) =>
  currentDataArray.map((barHeight) => {
    const nextFrameBarHeight = Math.floor(
      Math.max(
        0,
        barHeight + (barHeight * Math.cos(Math.random() * 2 * Math.PI)) / 100
      )
    );

    return Math.min(maxHeight, nextFrameBarHeight);
  });

const initialDataArray = Array.from({ length: barsCount }).map(() =>
  Math.floor(Math.random() * maxHeight)
);

let dataArray = initialDataArray;

for (let i = 0; i < 10; i++) {
  dataArray = nextDataArray(dataArray);
  console.log(dataArray);
}
