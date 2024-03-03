<script lang="ts" setup>
import { onMounted, ref } from "vue";

const container = ref<HTMLElement>();
const canvasEl = ref<HTMLCanvasElement>();

const bufferLength = 500;

const maxHeight = window.innerHeight;

const randomSign = () => (Math.random() > 0.5 ? 1 : -1);
const initialDataArray = Array.from({ length: bufferLength }).map(() =>
  Math.floor(Math.random() * maxHeight)
);

const nextDataArray = (currentDataArray: number[]) => {
  return currentDataArray.map((barHeight) => {
    let nextFrameBarHeight =
      barHeight +
      ((randomSign() *
        Math.abs(Math.sin(Date.now() * 0.0001)) *
        Math.random()) /
        5) *
        (maxHeight / 3);

    return Math.max(0, Math.floor(Math.min(maxHeight, nextFrameBarHeight)));
  });
};

const dataArray = ref(initialDataArray);

const updateDataArray = () => {
  dataArray.value = nextDataArray(dataArray.value);
};
onMounted(() => {
  console.log({
    container: container.value,
    canvasEl: canvasEl.value,
  });

  if (!container.value || !canvasEl.value) return;

  if (!canvasEl.value) return;

  canvasEl.value.width = window.innerWidth;
  canvasEl.value.height = window.innerHeight;

  const ctx = canvasEl.value.getContext("2d");

  const barWidth = canvasEl.value.width / 2 / bufferLength; // the width of each bar in the canvasEl

  let x = 0; // used to draw the bars one after another. This will get increased by the width of one bar

  const animate = () => {
    if (!canvasEl.value) throw new Error("canvasEl is undefined");
    if (!ctx) throw new Error("ctx is undefined");

    x = 0;
    ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height); // clears the canvasEl
    updateDataArray();

    drawVisualizer({ bufferLength, dataArray: dataArray.value, barWidth });
    requestAnimationFrame(animate); // calls the animate function again. This method is built in
  };

  const drawVisualizer = ({
    bufferLength,
    dataArray,
    barWidth,
  }: {
    bufferLength: number;
    dataArray: number[];
    barWidth: number;
  }) => {
    if (!canvasEl.value) throw new Error("canvasEl is undefined");
    if (!ctx) throw new Error("ctx is undefined");

    let barHeight: number;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
      const red = Math.floor((barHeight * 255) / maxHeight);
      const green = Math.floor((i * 255) / bufferLength);
      const blue = Math.floor(((bufferLength - i) * 255) / bufferLength);

      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(
        canvasEl.value.width / 2 - x, // this will start the bars at the center of the canvasEl and move from right to left
        canvasEl.value.height - barHeight,
        barWidth,
        barHeight
      ); // draws the bar. the reason we're calculating Y weird here is because the canvasEl starts at the top left corner. So we need to start at the bottom left corner and draw the bars from there
      x += barWidth; // increases the x value by the width of the bar
    }

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
      const red = Math.floor((barHeight * 255) / maxHeight);
      const green = Math.floor((i * 255) / bufferLength);
      const blue = Math.floor(((bufferLength - i) * 255) / bufferLength);
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(x, canvasEl.value.height - barHeight, barWidth, barHeight); // this will continue moving from left to right
      x += barWidth; // increases the x value by the width of the bar
    }
  };

  animate();
});
</script>

<template>
  <div ref="container" class="w-128 h-128 border border-black">
    <canvas
      class="z-0 w-screen h-screen fixed left-0 right-0 top-0 bottom-0"
      ref="canvasEl"
      :style="{
        backgroundImage: 'radial-gradient(darkred 40%, #fc464a 70%)',
      }"
    ></canvas>
  </div>
</template>
