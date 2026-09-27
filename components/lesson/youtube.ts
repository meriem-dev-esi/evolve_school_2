export type YouTubePlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
};

export type YouTubeAPI = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: {
        start?: number;
      };
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    if (parsed.hostname.includes("youtube.com")) {
      const vParam = parsed.searchParams.get("v");
      if (vParam) return vParam;

      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch) return embedMatch[1] ?? null;

      const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch) return shortsMatch[1] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}