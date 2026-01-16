'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, X } from 'lucide-react';

interface MusicPlayerProps {
  youtubeUrl?: string;
}

// Lightweight YT typings for the methods we use (avoid `any`)
declare namespace YT {
  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    destroy(): void;
  }
  interface PlayerState {
    PLAYING: number;
    PAUSED: number;
  }
}

declare global {
  interface Window {
    YT?: {
      Player?: { new (elementId: string | HTMLElement, options: Record<string, unknown>): YT.Player };
      PlayerState?: { PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
    __msSplashDone?: boolean;
  }
}

const MusicPlayer = ({ youtubeUrl = 'https://www.youtube.com/watch?v=fNh2yB0w8gU&t=4s' }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hasAutoPlayedRef = useRef(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:shorts\/|v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  useEffect(() => {
    if (!videoId) {
      Promise.resolve().then(() => setError('Invalid YouTube URL'));
      return;
    }

    // Initialize player when API is ready
    const initializePlayer = () => {
      try {
        if (!playerRef.current && window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player('youtube-player', {
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              loop: 1,
              playlist: videoId,
              playsinline: 1,
              enablejsapi: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: (event: { target?: YT.Player }) => {
                // Player ready
                setIsLoaded(true);
                setError(null);
              },
              onStateChange: (event: { data?: number }) => {
                if (window.YT && window.YT.PlayerState) {
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    setIsPlaying(true);
                  } else if (event.data === window.YT.PlayerState.PAUSED) {
                    setIsPlaying(false);
                  }
                }
              },
              onError: (event: { data?: number }) => {
                console.error('YouTube player error:', event.data);
                setError('Failed to load video');
                setIsLoaded(false);
              },
            },
          });
        }
      } catch (err: unknown) {
        console.error('Error initializing player:', err);
        setError('Failed to initialize player');
      }
    };

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Load YouTube IFrame API only if not already loaded
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    // Set up the callback for when API loads
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (err: unknown) {
          console.error('Error destroying player:', err);
        }
      }
    };
  }, [videoId]);

  // Auto-play after splash screen completes
  useEffect(() => {
    const handleSplashDone = () => {
      if (!hasAutoPlayedRef.current && playerRef.current && isLoaded) {
        setTimeout(() => {
          try {
            playerRef.current?.playVideo();
            hasAutoPlayedRef.current = true;
          } catch (err: unknown) {
            console.error('Error auto-playing music:', err);
          }
        }, 500); // Small delay to ensure smooth transition
      }
    };

    // Check if splash already completed
    if (window.__msSplashDone && !hasAutoPlayedRef.current && isLoaded) {
      handleSplashDone();
    }

    // Listen for splash completion event
    window.addEventListener('splashDone', handleSplashDone);
    return () => window.removeEventListener('splashDone', handleSplashDone);
  }, [isLoaded]);

  // Hide player when footer is visible to avoid overlap on small screens
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const footer = document.querySelector('footer');
    if (!footer) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setFooterVisible(entry.isIntersecting);
      });
    }, { root: null, threshold: 0.05 });

    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  const togglePlay = () => {
    if (!playerRef.current || !isLoaded) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (err: unknown) {
      console.error('Error toggling play:', err);
    }
  };

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        <div id="youtube-player"></div>
      </div>

      {/* Music Control Corner - show on md+; on small screens use collapsible toggle */}
      <div className={`hidden md:block fixed bottom-6 left-20 z-50 ${footerVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`
            group
            bg-[var(--color-primary)] text-white
            w-12 h-12 md:w-14 md:h-14
            rounded-full
            shadow-2xl hover:shadow-[var(--color-primary)]/50
            transition-all hover:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center
            min-h-[44px] min-w-[44px]
          `}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
          )}
        </button>
      </div>

      {/* Mobile collapsible player: toggle button and expandable panel */}
      <div className={`md:hidden fixed bottom-6 left-4 z-50 flex flex-col items-start gap-2 ${footerVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => setPlayerExpanded(!playerExpanded)}
          aria-label={playerExpanded ? 'Collapse music player' : 'Open music player'}
          className="bg-[var(--color-primary)] text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center min-h-[44px] min-w-[44px]"
        >
          {playerExpanded ? <X className="w-5 h-5" /> : <Music className="w-5 h-5" />}
        </button>

        <div className={`transition-all ${playerExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="bg-white/90 p-2 rounded-xl shadow-2xl flex items-center">
            <button
              onClick={togglePlay}
              disabled={!isLoaded}
              className={`group bg-[var(--color-primary)] text-white w-12 h-12 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
