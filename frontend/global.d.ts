export {};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
    __msSplashDone?: boolean;
  }
}
