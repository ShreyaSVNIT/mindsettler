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

      {/* Music Control Button */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`
            group relative
            flex items-center justify-center
            w-14 h-14 rounded-full
            bg-gradient-to-br from-[#F9D1D5] to-[#E8B4B8]
            shadow-lg shadow-[#F9D1D5]/20
            transition-all duration-300
            hover:scale-110 hover:shadow-xl hover:shadow-[#F9D1D5]/30
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isPlaying ? 'animate-pulse' : ''}
          `}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-[#1a161f]" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6 text-[#1a161f] ml-0.5" fill="currentColor" />
          )}
          
          {/* Ripple effect when playing */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-[#F9D1D5] animate-ping opacity-20"></span>
          )}
        </button>

        {/* Mute/Unmute Button */}
        {isPlaying && (
          <button
            onClick={toggleMute}
            className={`
              flex items-center justify-center
              w-10 h-10 rounded-full
              bg-[#1a161f]/80 backdrop-blur-sm
              shadow-lg
              transition-all duration-300
              hover:bg-[#1a161f] hover:scale-105
              ${isMuted ? 'text-gray-400' : 'text-white'}
            `}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
