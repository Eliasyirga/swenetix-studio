import React from 'react';
import styled from '@emotion/styled';
import { Edit2, Trash2, Disc, Heart, Play, Pause } from 'lucide-react';
import { Song } from '../types/song';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Flex, Box } from './common/Flex';
import { Heading, Text } from './common/Text';

const CardContainer = styled(Card)<{ isCurrent?: boolean }>`
  padding: 18px;
  position: relative;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-color: ${(props) => (props.isCurrent ? props.theme.colors.primary : undefined)};

  &:hover {
    transform: translateY(-3px);
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

const CoverArtwork = styled.button<{ isPlaying?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: ${(props) => props.theme.radii.md};
  background-color: ${(props) =>
    props.isPlaying ? props.theme.colors.primary : props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isPlaying ? '#FFFFFF' : props.theme.colors.primary)};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: #FFFFFF;
    transform: scale(1.08);
  }
`;

const HeartButton = styled.button<{ isFavorite?: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isFavorite ? '#FF4B5C' : props.theme.colors.textMuted)};
  transition: all 0.15s ease;

  &:hover {
    color: #FF4B5C;
    transform: scale(1.2);
    background: rgba(255, 75, 92, 0.1);
  }
`;

export interface SongCardProps {
  song: Song;
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
  onToggleFavorite?: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();
  const isThisCurrentTrack = currentSong?.id === song.id;
  const isThisTrackPlaying = isThisCurrentTrack && isPlaying;

  const handlePlayClick = () => {
    if (isThisCurrentTrack) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <CardContainer isCurrent={isThisCurrentTrack}>
      <Box>
        <Flex alignItems="flex-start" justifyContent="space-between" gap={2} mb={3}>
          <Flex alignItems="flex-start" gap={3} overflow="hidden" flex={1}>
            <CoverArtwork
              isPlaying={isThisTrackPlaying}
              onClick={handlePlayClick}
              title={isThisTrackPlaying ? 'Pause track' : 'Play track'}
              aria-label="Play song"
            >
              {isThisTrackPlaying ? (
                <Pause size={20} fill="#fff" />
              ) : isThisCurrentTrack ? (
                <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />
              ) : (
                <Disc size={22} />
              )}
            </CoverArtwork>

            <Box flex={1} overflow="hidden">
              <Heading
                as="h4"
                fontSize={2}
                fontWeight="bold"
                truncate
                title={song.title}
                color={isThisCurrentTrack ? 'primary' : 'text'}
                mb={1}
              >
                {song.title}
              </Heading>
              <Text fontSize={1} color="textSecondary" truncate>
                {song.artist}
              </Text>
            </Box>
          </Flex>

          <HeartButton
            isFavorite={song.isFavorite}
            onClick={() => onToggleFavorite?.(song)}
            title={song.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart
              size={17}
              fill={song.isFavorite ? '#FF4B5C' : 'transparent'}
            />
          </HeartButton>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Text fontSize={0} color="textMuted" truncate style={{ maxWidth: '180px' }} title={song.album}>
            Album: {song.album}
          </Text>
        </Flex>
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        borderTop="1px solid"
        borderColor="surfaceBorder"
      >
        <Badge variant="primary">{song.genre}</Badge>

        <Flex alignItems="center" gap={1}>
          <Button
            variant="ghost"
            buttonSize="sm"
            onClick={() => onEdit(song)}
            title="Edit Song"
            style={{ padding: '6px 8px', borderRadius: '6px' }}
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghost"
            buttonSize="sm"
            onClick={() => onDelete(song)}
            title="Delete Song"
            style={{ padding: '6px 8px', borderRadius: '6px' }}
          >
            <Trash2 size={14} />
          </Button>
        </Flex>
      </Flex>
    </CardContainer>
  );
};
