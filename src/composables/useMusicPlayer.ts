import { useInterval } from "@vueuse/core";
import type { MusicPlayer } from "../models/music-player";

export function useMusicPlayer() {
  let source = ref<AudioBufferSourceNode>();

  let analyser = ref<AnalyserNode>();

  const playMusic = async (url: string) => {
    const context = new AudioContext();
    analyser.value = context.createAnalyser();
    source.value = context.createBufferSource();
    const audioBuffer = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((ArrayBuffer) => context.decodeAudioData(ArrayBuffer));

    source.value.buffer = audioBuffer;
    source.value.connect(context.destination);
    source.value.connect(analyser.value);
    source.value.start();

    const frequencyData = new Uint8Array(analyser.value.frequencyBinCount);
    analyser.value.getByteFrequencyData(frequencyData);
  };

  const getAudioSpectrum = () => {
    if (!analyser.value) return [];

    const frequencyData = new Uint8Array(analyser.value.frequencyBinCount);

    analyser.value.getByteFrequencyData(frequencyData);

    const NB_BARS = 400;

    const barHeights = Array.from({ length: NB_BARS }).map((_, i) => {
      // Since the frequency data array is 1024 in length, we don't want to fetch
      // the first NBR_OF_BARS of values, but try and grab frequencies over the whole spectrum
      const index = (i + 10) * 2;
      // fd is a frequency value between 0 and 255
      const fd = frequencyData[index];

      // If fd is undefined, default to 0, then make sure fd is at least 4
      // This will make make a quiet frequency at least 4px high for visual effects
      const barHeight = Math.max(4, fd || 0);
      return barHeight;
    });

    return barHeights;
  };

  const stopMusic = () => source.value?.stop();

  return { playMusic, stopMusic, getAudioSpectrum };
}
