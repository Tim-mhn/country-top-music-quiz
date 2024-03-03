import type { MusicPlayer } from "../models/music-player";

export function useMusicPlayer(): MusicPlayer {
  let source = ref<AudioBufferSourceNode>();

  const playMusic = async (url: string) => {
    const context = new AudioContext();
    source.value = context.createBufferSource();
    const audioBuffer = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((ArrayBuffer) => context.decodeAudioData(ArrayBuffer));

    source.value.buffer = audioBuffer;
    source.value.connect(context.destination);
    source.value.start();
  };

  const stopMusic = () => source.value?.stop();

  return { playMusic, stopMusic };
}
