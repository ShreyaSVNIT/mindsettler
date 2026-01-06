'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface MusicPlayerProps {
  youtubeUrl?: string;
}

const MusicPlayer = ({ youtubeUrl = 'https://www.youtube.com/watch?v=fNh2yB0w8gU&t=4s' }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasAutoPlayedRef = useRef(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:shorts\/|v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  useEffect(() => {
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }

    // Initialize player when API is ready
    const initializePlayer = () => {
      try {
        if (!playerRef.current) {
          playerRef.current = new (window as any).YT.Player('youtube-player', {
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
              onReady: (event: any) => {
                console.log('YouTube player ready');
                setIsLoaded(true);
                setError(null);
              },
              onStateChange: (event: any) => {
                if (event.data === (window as any).YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                  setIsPlaying(false);
                }
              },
              onError: (event: any) => {
                console.error('YouTube player error:', event.data);
                setError('Failed to load video');
                setIsLoaded(false);
              },
            },
          });
        }
      } catch (err) {
        console.error('Error initializing player:', err);
        setError('Failed to initialize player');
      }
    };

    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
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
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready');
      initializePlayer();
    };

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (err) {
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
            playerRef.current.playVideo();
            hasAutoPlayedRef.current = true;
          } catch (err) {
            console.error('Error auto-playing music:', err);
          }
        }, 500); // Small delay to ensure smooth transition
      }
    };

    // Check if splash already completed
    if ((window as any).__msSplashDone && !hasAutoPlayedRef.current && isLoaded) {
      handleSplashDone();
    }

    // Listen for splash completion event
    window.addEventListener('splashDone', handleSplashDone);
    return () => window.removeEventListener('splashDone', handleSplashDone);
  }, [isLoaded]);

  const togglePlay = () => {
    if (!playerRef.current || !isLoaded) return;
    
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (err) {
      console.error('Error toggling play:', err);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !isLoaded) return;
    
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (err) {
      console.error('Error toggling mute:', err);
    }
  };

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        <div id="youtube-player"></div>
      </div>

      {/* Music Control Corner */}
      <div className="fixed bottom-0 left-0 z-50 flex flex-col items-start">
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`
            group relative
            bg-[var(--color-primary)] text-white
            px-8 py-6 rounded-tr-[3rem]
            shadow-2xl hover:shadow-[var(--color-primary)]/50
            transition-all hover:scale-105
            origin-bottom-left
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-3
          `}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
          )}
          <div className="flex flex-col items-start">
            <span className="font-title text-xl font-bold uppercase tracking-wider leading-none">
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </span>
          </div>
        </button>
        
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="bg-[var(--color-primary)] text-white px-6 py-2 ml-8 mb-2 rounded-r-2xl opacity-70 hover:opacity-100 transition-all flex items-center gap-2 shadow-lg"
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="font-body text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
