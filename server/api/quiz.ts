import camelcaseKeys from "camelcase-keys";
import type { SpotifyPlaylist } from "~/src/dtos/playlist";
import type { MusicQuiz } from "~/src/dtos/quiz";
import { shuffle } from "~/src/utils/array";
import { randomElement } from "~/src/utils/random";

function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
const COUNTRY_TOP_PLAYLIST_ID = {
  France: "37i9dQZEVXbIPWwFssbupI",
  UK: "37i9dQZEVXbLnolsZ8PSNw",
  Germany: "37i9dQZEVXbJiZcmkrIHGU",
  USA: "37i9dQZEVXbLRQDuF5jeBp",
  Italy: "37i9dQZEVXbIQnj7RRhdSX",
  Korea: "37i9dQZEVXbNxXF4SkHj9F",
  Egypt: "37i9dQZEVXbLn7RQmT5Xv2",
  Russia: "6qv7CRaZr9nJaamM8Xtrv6",
  China: "3qwyQJzNAt4BDfnijpKkbi",
  Brazil: "37i9dQZEVXbMXbN3EUUhlg",
  Serbia: "11GT6QDN3SgjYYZgW9AzM5",
  "South Africa": "37i9dQZEVXbMH2jvi6jvjk",
  Israel: "37i9dQZEVXbJ6IpvItkve3",
};

const isNotNullOrUndefined = <T>(v: T | null | undefined): v is T => {
  return v !== null && v !== undefined;
};

const getQuestionOptionsForCountry = ({ country }: { country: string }) => {
  const wrongCountries = shuffle(
    objectKeys(COUNTRY_TOP_PLAYLIST_ID).filter((c) => c !== country)
  ).slice(0, 3);

  return shuffle([country, ...wrongCountries]);
};
export default defineEventHandler(async () => {
  const accessToken = await $fetch("/api/token");

  const authorizationHeader = `Bearer ${accessToken}`;

  const countryPlaylists = await Promise.all(
    objectKeys(COUNTRY_TOP_PLAYLIST_ID).map(async (country) => {
      const countryPlaylistId = COUNTRY_TOP_PLAYLIST_ID[country];
      const _playlist = await $fetch(
        `https://api.spotify.com/v1/playlists/${countryPlaylistId}`,
        {
          headers: {
            Authorization: authorizationHeader,
          },
          method: "GET",
          responseType: "json",
        }
      );

      const playlist = camelcaseKeys(_playlist as any, {
        deep: true,
      }) as SpotifyPlaylist;

      return { country, playlist };
    })
  );

  const countryTopTracks = shuffle(countryPlaylists)
    .map(({ country, playlist }) => {
      const tracksWithUrls = playlist.tracks.items.filter((i) =>
        isNotNullOrUndefined(i.track.previewUrl)
      );

      if (tracksWithUrls.length === 0) return null;

      const { track } = randomElement(tracksWithUrls);

      return {
        country,
        track: {
          name: track.name,
          artist: track.artists[0]?.name || "Unknown",
          url: track.previewUrl as string,
          image: track.album.images[0].url,
        },
      };
    })
    .filter(isNotNullOrUndefined);

  const musicQuiz: MusicQuiz = countryTopTracks.map(({ country, track }) => {
    return {
      country,
      track,
      options: getQuestionOptionsForCountry({ country }),
    };
  });

  return musicQuiz;
});
