export const toHref = (value: string | URL) =>
  typeof value === "string" ? value : value.toString();

export const hasAnyProp = (props: object): boolean =>
  Object.keys(props).length > 0;

// Audio MIME type inference
const AUDIO_MIME_MAP: Record<string, string> = {
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  aac: "audio/aac",
  wav: "audio/wav",
  flac: "audio/flac",
  m4a: "audio/mp4",
  opus: "audio/opus",
  webm: "audio/webm",
};

export const inferAudioMimeType = (src: string): string | undefined => {
  const key = src.split(".").pop()?.split("?")[0]?.toLowerCase() ?? "";
  return AUDIO_MIME_MAP[key];
};

// Image MIME type inference
const IMAGE_MIME_MAP: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
};

export const inferImageMimeType = (
  src: string,
  format?: string,
): string | undefined => {
  const key = (
    format ??
    src.split(".").pop()?.split("?")[0] ??
    ""
  ).toLowerCase();
  return IMAGE_MIME_MAP[key];
};

export const isSvg = (input: string): boolean => {
  return inferImageMimeType(input) === "image/svg+xml";
};

// Video MIME type inference
const VIDEO_MIME_MAP: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  m4v: "video/mp4",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
};

export const inferVideoMimeType = (src: string): string | undefined => {
  const key = src.split(".").pop()?.split("?")[0]?.toLowerCase() ?? "";
  return VIDEO_MIME_MAP[key];
};
