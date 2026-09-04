import React from 'react';
import styled from '@emotion/styled';
import { Edit2, Trash2, Disc3, Clock } from 'lucide-react';
import { Song } from '../types/song';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Flex, Box } from './common/Flex';
import { Heading, Text } from './common/Text';

const CardContainer = styled(Card)`
  padding: 18px;
  position: relative;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-3px);
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
`;

const CoverArtwork = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${(props) => props.theme.radii.md};
  background-color: ${(props) => props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  flex-shrink: 0;
`;

export interface SongCardProps {
  song: Song;
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onEdit,
  onDelete,
}) => {
  const formattedDuration = song.duration
    ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
    : '3:30';

  return (
    <CardContainer>
      <Box>
        <Flex alignItems="flex-start" gap={3} mb={3}>
          <CoverArtwork>
            <Disc3 size={24} />
          </CoverArtwork>

          <Box flex={1} overflow="hidden">
            <Heading as="h4" fontSize={2} fontWeight="bold" truncate title={song.title} color="text" mb={1}>
              {song.title}
            </Heading>
            <Text fontSize={1} color="textSecondary" truncate>
              {song.artist}
            </Text>
          </Box>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Text fontSize={0} color="textMuted" truncate style={{ maxWidth: '140px' }} title={song.album}>
            {song.album}
          </Text>
          <Flex alignItems="center" gap={1}>
            <Clock size={11} />
            <Text fontSize={0} color="textMuted" style={{ fontFamily: 'monospace' }}>
              {formattedDuration}
            </Text>
          </Flex>
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
            title="Edit Track"
            style={{ padding: '5px 8px', borderRadius: '6px' }}
          >
            <Edit2 size={13} />
          </Button>
          <Button
            variant="ghost"
            buttonSize="sm"
            onClick={() => onDelete(song)}
            title="Delete Track"
            style={{ padding: '5px 8px', borderRadius: '6px' }}
          >
            <Trash2 size={13} />
          </Button>
        </Flex>
      </Flex>
    </CardContainer>
  );
};
