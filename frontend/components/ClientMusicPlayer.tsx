"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const MusicPlayer = dynamic(() => import('./MusicPlayer'), {
  ssr: false,
  loading: () => null,
});

export default function ClientMusicPlayer(props: any) {
  return <MusicPlayer {...props} />;
}
