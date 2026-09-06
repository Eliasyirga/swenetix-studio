import React from 'react';
import styled from '@emotion/styled';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Disc,
  Heart,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useAppDispatch } from '../store/store';
import { toggleFavoriteRequest } from '../store/songsSlice';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';
import { Badge } from './Badge';

function formatSeconds(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const PlayerContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 76px;
  background: ${(props) => props.theme.colors.surface};
  border-top: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  backdrop-filter: blur(16px);
  transform: translateY(${(props) => (props.isVisible ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    padding: 0 12px;
    height: 70px;
  }
`;

const TrackArtBox = styled.div<{ isPlaying: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary}, #FF4B5C);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: ${(props) =>
    props.isPlaying ? '0 0 16px rgba(217, 28, 46, 0.6)' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
  animation: ${(props) => (props.isPlaying ? 'spin 12s linear infinite' : 'none')};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary}, #FF4B5C);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(217, 28, 46, 0.4);
  transition: all 0.15s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 18px rgba(217, 28, 46, 0.6);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const ControlBtn = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.surfaceLight};
    transform: scale(1.1);
  }
`;

const ProgressBar = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  appearance: none;
  background: ${(props) => props.theme.colors.surfaceBorder};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const VolumeSlider = styled.input`
  width: 70px;
  height: 4px;
  border-radius: 2px;
  appearance: none;
  background: ${(props) => props.theme.colors.surfaceBorder};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.text};
    cursor: pointer;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const EqualizerBar = styled.div<{ height: number; delay: number }>`
  width: 3px;
  height: ${(props) => props.height}px;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 2px;
  animation: bounce 0.8s ease-in-out infinite alternate;
  animation-delay: ${(props) => props.delay}s;

  @keyframes bounce {
    0% {
      height: 4px;
    }
    100% {
      height: 18px;
    }
  }
`;

export const AudioPlayerBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
  } = useAudioPlayer();

  if (!currentSong) return null;

  return (
    <PlayerContainer isVisible={!!currentSong}>
      {/* 1. Track Info (Left) */}
      <Flex alignItems="center" gap={3} style={{ width: '28%', minWidth: '180px' }}>
        <TrackArtBox isPlaying={isPlaying}>
          <Disc size={22} />
        </TrackArtBox>

        <Box overflow="hidden">
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold" fontSize={1} color="text" truncate title={currentSong.title}>
              {currentSong.title}
            </Text>
            <Box display={['none', 'inline-block']}>
              <Badge variant="primary" style={{ padding: '1px 6px', fontSize: '10px' }}>
                {currentSong.genre}
              </Badge>
            </Box>
          </Flex>
          <Text fontSize={0} color="textSecondary" truncate>
            {currentSong.artist} &middot; {currentSong.album}
          </Text>
        </Box>

        <ControlBtn
          onClick={() => dispatch(toggleFavoriteRequest(currentSong.id))}
          title={currentSong.isFavorite ? 'Remove favorite' : 'Add favorite'}
          style={{ color: currentSong.isFavorite ? '#FF4B5C' : undefined }}
        >
          <Heart size={16} fill={currentSong.isFavorite ? '#FF4B5C' : 'transparent'} />
        </ControlBtn>
      </Flex>

      {/* 2. Controls & Scrubber (Center) */}
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
        style={{ width: '44%', maxWidth: '520px' }}
      >
        <Flex alignItems="center" gap={3}>
          <ControlBtn onClick={prevTrack} title="Previous Track">
            <SkipBack size={18} />
          </ControlBtn>

          <PlayButton onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" style={{ marginLeft: '2px' }} />}
          </PlayButton>

          <ControlBtn onClick={nextTrack} title="Next Track">
            <SkipForward size={18} />
          </ControlBtn>
        </Flex>

        {/* Scrubber Time Bar */}
        <Flex alignItems="center" gap={2} style={{ width: '100%' }}>
          <Text fontSize={0} color="textMuted" style={{ fontFamily: 'monospace', minWidth: '32px' }}>
            {formatSeconds(currentTime)}
          </Text>
          <ProgressBar
            type="range"
            min={0}
            max={duration || 210}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <Text fontSize={0} color="textMuted" style={{ fontFamily: 'monospace', minWidth: '32px' }}>
            {formatSeconds(duration)}
          </Text>
        </Flex>
      </Flex>

      {/* 3. Equalizer, Volume & Dismiss (Right) */}
      <Flex alignItems="center" justifyContent="flex-end" gap={3} style={{ width: '28%' }}>
        {/* Animated Equalizer */}
        {isPlaying && (
          <Flex alignItems="center" gap={1} display={['none', 'flex']} height="20px">
            <EqualizerBar height={8} delay={0.1} />
            <EqualizerBar height={14} delay={0.3} />
            <EqualizerBar height={18} delay={0.2} />
            <EqualizerBar height={10} delay={0.4} />
          </Flex>
        )}

        {/* Volume Controls */}
        <Flex alignItems="center" gap={2}>
          <ControlBtn onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </ControlBtn>
          <VolumeSlider
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </Flex>

        {/* Close / Dismiss Player */}
        <ControlBtn onClick={closePlayer} title="Close Player">
          <X size={16} />
        </ControlBtn>
      </Flex>
    </PlayerContainer>
  );
};
