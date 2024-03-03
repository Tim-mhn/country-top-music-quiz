export type CountryTopTracks = CountryTopTrack[];

type CountryTopTrack = {
  country: string;
  track: {
    artist: string;
    name: string;
    url: string;
  };
};
export type SpotifyPlaylist = {
  collaborative: boolean;
  description: string;
  externalUrls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primaryColor: null;
  public: boolean;
  snapshotID: string;
  tracks: Tracks;
  type: string;
  uri: string;
};

export type ExternalUrls = {
  spotify: string;
};

export type Followers = {
  href: null;
  total: number;
};

export type Image = {
  height: number | null;
  url: string;
  width: number | null;
};

export type Owner = {
  displayName?: string;
  externalUrls: ExternalUrls;
  href: string;
  id: string;
  type: OwnerType;
  uri: string;
  name?: string;
};

export type OwnerType = "user" | "artist";

export type Tracks = {
  href: string;
  items: Item[];
  limit: number;
  next: null;
  offset: number;
  previous: null;
  total: number;
};

export type Item = {
  addedAt: Date;
  addedBy: Owner;
  isLocal: boolean;
  primaryColor: null;
  track: Track;
  videoThumbnail: VideoThumbnail;
};

export type Track = {
  previewUrl: null | string;
  availableMarkets: string[];
  explicit: boolean;
  type: TrackType;
  episode: boolean;
  track: boolean;
  album: Album;
  artists: Owner[];
  discNumber: number;
  trackNumber: number;
  durationMS: number;
  externalIDS: ExternalIDS;
  externalUrls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  uri: string;
  isLocal: boolean;
};

export type Album = {
  availableMarkets: string[];
  type: AlbumTypeEnum;
  albumType: AlbumTypeEnum;
  href: string;
  id: string;
  images: Image[];
  name: string;
  releaseDate: Date;
  releaseDatePrecision: ReleaseDatePrecision;
  uri: string;
  artists: Owner[];
  externalUrls: ExternalUrls;
  totalTracks: number;
};

export type AlbumTypeEnum = "album" | "single";

export type ReleaseDatePrecision = "day";

export type ExternalIDS = {
  isrc: string;
};

export type TrackType = "track";

export type VideoThumbnail = {
  url: null;
};
