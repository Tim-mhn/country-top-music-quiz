<script lang="ts" setup>
import { onMounted, ref } from "vue";

const props = defineProps<{ getAudioSpectrum: () => number[] }>();
const container = ref<HTMLElement>();
const canvasEl = ref<HTMLCanvasElement>();

const bufferLength = 400;

const maxHeight = window.innerHeight;

const initialDataArray = Array.from({ length: bufferLength }).map(() =>
  Math.floor(Math.random() * maxHeight)
);

const dataArray = ref(initialDataArray);

const updateDataArray = () => {
  dataArray.value = props.getAudioSpectrum();
};
onMounted(() => {
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

    const gapBetweenBars = 4;
    let barHeight: number;

    const visualizerWidth = (barWidth + gapBetweenBars) * bufferLength;
    const leftPadding = (canvasEl.value.width - visualizerWidth) / 2;
    x = leftPadding;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 2; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar

      ctx.fillStyle = `rgb(${250}, ${250}, ${250})`;
      ctx.fillRect(
        x, // this will start the bars at the center of the canvasEl and move from right to left
        canvasEl.value.height - barHeight,
        barWidth,
        barHeight
      ); // draws the bar. the reason we're calculating Y weird here is because the canvasEl starts at the top left corner. So we need to start at the bottom left corner and draw the bars from there
      x += barWidth + gapBetweenBars;
    }
  };

  animate();
});
</script>

<template>
  <div
    ref="container"
    class="w-128 h-128 w-screen h-screen fixed flex justify-center items-center"
  >
    <canvas class="z-0" ref="canvasEl"></canvas>
  </div>
</template>
