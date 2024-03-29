import camelcaseKeys from "camelcase-keys";
import type { Item, SpotifyPlaylist } from "~/src/dtos/playlist";
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
  Spain: "37i9dQZEVXbNFJfN1Vw8d9",
  Turkey: "37i9dQZEVXbIVYVBNw9D5K",
  Portugal: "37i9dQZEVXbKyJS56d1pgi",
  Mexico: "37i9dQZEVXbO3qyFxbkOE1",
  Argentina: "37i9dQZEVXbMMy2roB9myp",
  India: "37i9dQZEVXbLZ52XmnySJg",
  Switzerland: "37i9dQZEVXbJiyhoAPEfMK",
  Morocco: "37i9dQZEVXbJU9eQpX8gPT",
  Vietnam: "37i9dQZEVXbLdGSmz6xilI",
  Netherlands: "37i9dQZEVXbKCF6dqVpDkS",
  Sweden: "37i9dQZEVXbLoATJ81JYXz",
  Indonesia: "1OiiFyV4pJ7Pl5yhB4OHLO",
  Nigeria: "37i9dQZEVXbKY7jLzlJ11V",
  Romania: "37i9dQZEVXbNZbJ6TZelCq",
  Poland: "37i9dQZEVXbN6itCcaL3Tt",
  Greece: "37i9dQZEVXbJqdarpmTJDL",
  Thailand: "37i9dQZEVXbMnz8KIWsvf9",
  Cambodia: "42E8Ls2T8QK63F6R3k5FOw",
  Montenegro: "59Em8Zqcw60fh1rgNFy4ag",
  Chile: "37i9dQZEVXbL0GavIqMTeb",
  Cameroon: "39t3BhdVssvlUjBHDOjQVi",
  Philippines: "6wCqlVZVPhs53gy5AveIDm",
  Hungary: "37i9dQZEVXbNHwMxAkvmF8",
  Slovenia: "2mN8qgKnWkvm3ZyQt0l4VB",
  Croatia: "7HLFayaacjut2hKJzCzpLb",
  Ireland: "37i9dQZEVXbKM896FDX8L1",
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
    shuffle(objectKeys(COUNTRY_TOP_PLAYLIST_ID))
      .slice(0, 10)
      .map(async (country) => {
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
      const tracksWithUrls = playlist.tracks.items
        .map(
          (i, index) =>
            ({ ...i, position: index + 1 } as Item & { position: number })
        )
        .filter((i) => isNotNullOrUndefined(i.track.previewUrl));

      if (tracksWithUrls.length === 0) return null;

      const { track, position } = randomElement(tracksWithUrls);

      return {
        country,
        track: {
          name: track.name,
          artist: track.artists[0]?.name || "Unknown",
          url: track.previewUrl as string,
          image: track.album.images[0].url,
          position,
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
