"use client";

export type VideoProvider = "youtube" | "vimeo" | "self-hosted";

export interface VideoPlayerProps {
  provider: VideoProvider;
  videoId?: string;
  src?: string;
  poster?: string;
  title?: string;
  className?: string;
}

function getEmbedUrl(provider: VideoProvider, videoId: string): string {
  switch (provider) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
    case "vimeo":
      return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
    default:
      return "";
  }
}

export function VideoPlayer({
  provider,
  videoId,
  src,
  poster,
  title = "Video",
  className = "",
}: VideoPlayerProps) {
  const aspectRatio = "aspect-video"; // 16:9

  if (provider === "self-hosted" && src) {
    return (
      <div
        className={`overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-2xl shadow-black/5 dark:border-white/5 dark:bg-white/5 ${className}`}
      >
        <div className={aspectRatio}>
          <video
            className="h-full w-full object-cover"
            src={src}
            poster={poster}
            controls
            preload="metadata"
            title={title}
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  const embedUrl =
    (provider === "youtube" || provider === "vimeo") && videoId
      ? getEmbedUrl(provider, videoId)
      : null;

  if (!embedUrl) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-2xl shadow-black/5 dark:border-white/5 dark:bg-white/5 ${className}`}
    >
      <div className={`relative w-full ${aspectRatio}`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
