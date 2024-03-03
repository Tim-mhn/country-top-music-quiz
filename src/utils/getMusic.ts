import { useFetch } from "@vueuse/core";
import type { CountryTopTracks } from "~/dtos/playlist";
import camelcaseKeys from "camelcase-keys";

export function usePlaylist() {
  const {
    data: stringData,
    isFetching,
    error,
  } = useFetch<CountryTopTracks>("/api/playlist");

  const data = computed<CountryTopTracks>(() =>
    !stringData.value
      ? null
      : camelcaseKeys(JSON.parse(stringData.value as any as string), {
          deep: true,
        })
  );

  return {
    isFetching,
    error,
    data,
  };
}
