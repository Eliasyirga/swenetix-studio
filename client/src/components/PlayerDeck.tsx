import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2 } from 'lucide-react';
import { useAppSelector } from '../store/store';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';

const PlayerDockContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background-color: ${(props) => props.theme.colors.surface};
  border-top: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(217, 28, 46, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`;

const SoundwaveBar = styled.span<{ height: number; isPlaying: boolean; delay: number }>`
  width: 3px;
  height: ${(props) => (props.isPlaying ? `${props.height}px` : '4px')};
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 2px;
  transition: height 0.2s ease;
  animation: ${(props) => (props.isPlaying ? `soundwave 0.8s ease-in-out infinite alternate` : 'none')};
  animation-delay: ${(props) => `${props.delay}s`};

  @keyframes soundwave {
    0% { height: 4px; }
    50% { height: 18px; }
    100% { height: 8px; }
  }
`;

const TrackArtBox = styled(Box)`
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PlayButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: ${(props) => props.theme.radii.full};
  background-color: ${(props) => props.theme.colors.primary};
  color: #FFFFFF;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(217, 28, 46, 0.4);

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
    transform: scale(1.06);
    box-shadow: 0 4px 16px rgba(217, 28, 46, 0.6);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: ${(props) => props.theme.radii.sm};
  transition: all 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.surfaceLight};
  }
`;

const ProgressBar = styled.div`
  width: 280px;
  height: 4px;
  background-color: ${(props) => props.theme.colors.surfaceBorder};
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProgressFill = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 2px;
  transition: width 0.1s linear;
`;

const GenreTag = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  background-color: ${(props) => props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  color: ${(props) => props.theme.colors.primary};
`;

export const PlayerDeck: React.FC = () => {
  const { items } = useAppSelector((state) => state.songs);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(24);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const activeSong = items[currentSongIndex] || items[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!activeSong) return null;

  const handleNext = () => {
    if (items.length > 0) {
      setCurrentSongIndex((prev) => (prev + 1) % items.length);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (items.length > 0) {
      setCurrentSongIndex((prev) => (prev - 1 + items.length) % items.length);
      setProgress(0);
    }
  };

  return (
    <PlayerDockContainer>
      {/* Left: Track Information & Waveform */}
      <Flex alignItems="center" gap={3} style={{ minWidth: '220px', maxWidth: '320px' }}>
        <TrackArtBox>
          <Music2 size={20} />
        </TrackArtBox>
        <Box style={{ overflow: 'hidden' }}>
          <Text
            fontSize={1}
            fontWeight="semibold"
            color="text"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            {activeSong.title}
          </Text>
          <Text
            fontSize={0}
            color="textSecondary"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            {activeSong.artist} • {activeSong.album}
          </Text>
        </Box>

        {/* Mini Soundwave visualizer */}
        <Flex alignItems="center" gap={1} style={{ marginLeft: '6px' }}>
          {[12, 18, 8, 16, 10].map((h, i) => (
            <SoundwaveBar key={i} height={h} isPlaying={isPlaying} delay={i * 0.15} />
          ))}
        </Flex>
      </Flex>

      {/* Center: Controls & Scrubber */}
      <Flex flexDirection="column" alignItems="center" gap={1}>
        <Flex alignItems="center" gap={2}>
          <IconButton onClick={handlePrev} title="Previous Track">
            <SkipBack size={18} />
          </IconButton>
          <PlayButton onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
          </PlayButton>
          <IconButton onClick={handleNext} title="Next Track">
            <SkipForward size={18} />
          </IconButton>
        </Flex>

        <Flex alignItems="center" gap={2}>
          <Text fontSize={0} color="textMuted" style={{ fontFamily: 'monospace' }}>
            {isPlaying ? '0:42' : '0:00'}
          </Text>
          <ProgressBar
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newProgress = (clickX / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, newProgress)));
            }}
          >
            <ProgressFill progress={progress} />
          </ProgressBar>
          <Text fontSize={0} color="textMuted" style={{ fontFamily: 'monospace' }}>
            {activeSong.duration
              ? `${Math.floor(activeSong.duration / 60)}:${(activeSong.duration % 60).toString().padStart(2, '0')}`
              : '3:30'}
          </Text>
        </Flex>
      </Flex>

      {/* Right: Volume & Status */}
      <Flex alignItems="center" gap={3}>
        <IconButton onClick={() => setIsMuted(!isMuted)} title={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </IconButton>
        <GenreTag>{activeSong.genre}</GenreTag>
      </Flex>
    </PlayerDockContainer>
  );
};
