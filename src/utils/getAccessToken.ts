import { useRuntimeConfig } from "nuxt/app";

export async function getAccessToken() {
  const config = useRuntimeConfig();
  const { access_token } = await $fetch<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          config.spotifyClientId + ":" + config.spotifyClientSecret
        ).toString("base64"),
    },
  });

  return access_token;
}
