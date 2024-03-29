import { ref } from "vue";

export function useCountdown(durationInSeconds: number) {
  const seconds = ref(durationInSeconds);

  const intervalRef = ref<ReturnType<typeof setInterval>>();

  function start() {
    clearInterval(intervalRef.value);
    seconds.value = durationInSeconds;
    intervalRef.value = setInterval(() => {
      seconds.value = Math.max(0, seconds.value - 1);
    }, 1000);
  }

  return { start, seconds };
}
