import React from 'react';
import styled from '@emotion/styled';
import { Edit2, Trash2, Heart, Play, Pause } from 'lucide-react';
import { Song } from '../types/song';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Badge } from './Badge';
import { Button } from './Button';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
  box-shadow: ${(props) => props.theme.shadows.card};
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 14px 18px;
  background: ${(props) => props.theme.colors.surfaceLight};
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 12px;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
`;

const Td = styled.td`
  padding: 14px 18px;
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
`;

const Tr = styled.tr<{ isCurrent?: boolean }>`
  transition: all 0.15s ease;
  background: ${(props) => (props.isCurrent ? props.theme.colors.surfaceLight : 'transparent')};

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }

  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const TrackIconBtn = styled.button<{ isPlaying?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.isPlaying ? props.theme.colors.primary : props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  color: ${(props) => (props.isPlaying ? '#FFFFFF' : props.theme.colors.primary)};
  display: flex;
  align-items: center;
  justify-content: center;
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

export interface SongTableProps {
  songs: Song[];
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
  onToggleFavorite?: (song: Song) => void;
}

export const SongTable: React.FC<SongTableProps> = ({
  songs,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();

  const handlePlayClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, songs);
    }
  };

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <Th style={{ width: '40px' }}>#</Th>
            <Th style={{ width: '40px' }}>Fav</Th>
            <Th>Title</Th>
            <Th>Artist</Th>
            <Th>Album</Th>
            <Th>Genre</Th>
            <Th style={{ textAlign: 'right', width: '110px' }}>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => {
            const isThisTrackPlaying = currentSong?.id === song.id && isPlaying;
            const isThisCurrentTrack = currentSong?.id === song.id;

            return (
              <Tr key={song.id} isCurrent={isThisCurrentTrack}>
                <Td style={{ color: 'inherit', opacity: 0.6, fontFamily: 'monospace', fontSize: '13px' }}>
                  {(index + 1).toString().padStart(2, '0')}
                </Td>
                <Td style={{ padding: '14px 8px' }}>
                  <HeartButton
                    isFavorite={song.isFavorite}
                    onClick={() => onToggleFavorite?.(song)}
                    title={song.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      size={16}
                      fill={song.isFavorite ? '#FF4B5C' : 'transparent'}
                    />
                  </HeartButton>
                </Td>
                <Td>
                  <Flex alignItems="center" gap={3}>
                    <TrackIconBtn
                      isPlaying={isThisTrackPlaying}
                      onClick={() => handlePlayClick(song)}
                      title={isThisTrackPlaying ? 'Pause' : 'Play track'}
                      aria-label="Play song"
                    >
                      {isThisTrackPlaying ? <Pause size={16} fill="#fff" /> : <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />}
                    </TrackIconBtn>
                    <Box>
                      <Text fontWeight="semibold" color={isThisCurrentTrack ? 'primary' : 'text'}>
                        {song.title}
                      </Text>
                      <Text fontSize={0} color="textMuted">
                        Added {new Date(song.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Flex>
                </Td>
                <Td>
                  <Text color="text" fontWeight="medium">{song.artist}</Text>
                </Td>
                <Td>
                  <Text color="textSecondary">{song.album}</Text>
                </Td>
                <Td>
                  <Badge variant="primary">{song.genre}</Badge>
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  <Flex justifyContent="flex-end" alignItems="center" gap={1}>
                    <Button
                      variant="ghost"
                      buttonSize="sm"
                      onClick={() => onEdit(song)}
                      title="Edit Song"
                      style={{ padding: '6px 8px', borderRadius: '6px' }}
                    >
                      <Edit2 size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      buttonSize="sm"
                      onClick={() => onDelete(song)}
                      title="Delete Song"
                      style={{ padding: '6px 8px', borderRadius: '6px' }}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};
