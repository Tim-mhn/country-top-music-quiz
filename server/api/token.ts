import type { Playlist } from "~/dtos/playlist";
import { getAccessToken } from "~/src/utils/getAccessToken";

export default defineEventHandler(() => {
  return getAccessToken();
});
