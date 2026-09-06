import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Song } from '../types/song';

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playSong: (song: Song, playlist?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  playSong: () => {},
  togglePlay: () => {},
  pause: () => {},
  resume: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  seek: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  closePlayer: () => {},
});

// Chord frequencies for Web Audio synth
const GENRE_CHORDS: Record<string, number[][]> = {
  Pop: [[261.63, 329.63, 392.0], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66]], // C - Am - F - G
  Rock: [[164.81, 246.94, 329.63], [220.0, 277.18, 329.63], [146.83, 220.0, 293.66], [196.0, 246.94, 392.0]], // E - A - D - G
  'Hip-Hop': [[130.81, 196.0, 261.63], [116.54, 174.61, 233.08], [103.83, 155.56, 207.65], [116.54, 174.61, 233.08]], // Cm - Bb - Ab - Bb
  'R&B': [[174.61, 220.0, 261.63, 329.63], [220.0, 261.63, 329.63, 392.0], [146.83, 174.61, 220.0, 261.63], [196.0, 246.94, 293.66, 349.23]], // Fmaj7 - Am7 - Dm7 - G7
  Jazz: [[146.83, 174.61, 220.0, 261.63], [196.0, 246.94, 293.66, 349.23], [261.63, 329.63, 392.0, 493.88], [220.0, 261.63, 329.63, 392.0]], // Dm7 - G7 - Cmaj7 - Am7
  Electronic: [[130.81, 164.81, 196.0], [146.83, 174.61, 220.0], [164.81, 196.0, 246.94], [174.61, 220.0, 261.63]], // C - Dm - Em - F
  Afrobeats: [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [130.81, 164.81, 196.0], [196.0, 246.94, 293.66]], // Am - F - C - G
  Reggae: [[196.0, 246.94, 293.66], [146.83, 174.61, 220.0], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66]], // G - Dm - F - G
  Soul: [[130.81, 164.81, 196.0, 246.94], [174.61, 220.0, 261.63, 329.63], [220.0, 261.63, 329.63, 392.0], [196.0, 246.94, 293.66, 349.23]],
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(210);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // Initialize Web Audio Context
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        const gain = audioCtxRef.current.createGain();
        gain.gain.value = isMuted ? 0 : volume;
        gain.connect(audioCtxRef.current.destination);
        gainNodeRef.current = gain;
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [isMuted, volume]);

  // Synthesize musical ambient notes
  const playMusicalChords = useCallback(
    (genre: string) => {
      const ctx = getAudioContext();
      if (!ctx || !gainNodeRef.current) return;

      const chords = GENRE_CHORDS[genre] || GENRE_CHORDS.Pop;
      let chordIndex = 0;

      const playChord = () => {
        if (!ctx || ctx.state === 'suspended') return;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const now = ctx.currentTime;
          const noteVolume = isMuted ? 0 : volume * 0.08;
          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.linearRampToValueAtTime(noteVolume, now + 0.3);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

          osc.connect(noteGain);
          noteGain.connect(gainNodeRef.current!);

          osc.start(now);
          osc.stop(now + 2.3);
        });
      };

      playChord();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = window.setInterval(playChord, 2400);
    },
    [getAudioContext, isMuted, volume]
  );

  const stopSynth = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  const playSong = useCallback(
    (song: Song, newPlaylist?: Song[]) => {
      setCurrentSong(song);
      if (newPlaylist && newPlaylist.length > 0) {
        setPlaylist(newPlaylist);
      }
      const songDuration = song.duration || 210;
      setDuration(songDuration);
      setCurrentTime(0);
      setIsPlaying(true);

      getAudioContext();
      playMusicalChords(song.genre);
    },
    [getAudioContext, playMusicalChords]
  );

  const pause = useCallback(() => {
    setIsPlaying(false);
    stopSynth();
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
  }, [stopSynth]);

  const resume = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying(true);
    getAudioContext();
    playMusicalChords(currentSong.genre);
  }, [currentSong, getAudioContext, playMusicalChords]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const nextTrack = useCallback(() => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex], playlist);
  }, [currentSong, playlist, playSong]);

  const prevTrack = useCallback(() => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex], playlist);
  }, [currentSong, playlist, playSong]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(duration, seconds));
      setCurrentTime(clamped);
    },
    [duration]
  );

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = clamped;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  const closePlayer = useCallback(() => {
    pause();
    setCurrentSong(null);
    setCurrentTime(0);
  }, [pause]);

  // Elapsed time increment loop when playing
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, nextTrack]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSynth();
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [stopSynth]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playSong,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
