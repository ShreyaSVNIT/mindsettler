'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface MusicPlayerProps {
  youtubeUrl?: string;
}

const MusicPlayer = ({ youtubeUrl = 'https://www.youtube.com/shorts/4rQFnfkuxQE' }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:shorts\/|v=|\/embed\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: videoId,
          playsinline: 1,
        },
        events: {
          onReady: () => setIsLoaded(true),
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
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
