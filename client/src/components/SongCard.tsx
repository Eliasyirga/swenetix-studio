import React from 'react';
import styled from '@emotion/styled';
import { Edit2, Trash2, Disc } from 'lucide-react';
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
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

const CoverArtwork = styled.div`
  width: 44px;
  height: 44px;
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
  return (
    <CardContainer>
      <Box>
        <Flex alignItems="flex-start" gap={3} mb={3}>
          <CoverArtwork>
            <Disc size={22} />
          </CoverArtwork>

          <Box flex={1} overflow="hidden">
            <Heading
              as="h4"
              fontSize={2}
              fontWeight="bold"
              truncate
              title={song.title}
              color="text"
              mb={1}
            >
              {song.title}
            </Heading>
            <Text fontSize={1} color="textSecondary" truncate>
              {song.artist}
            </Text>
          </Box>
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
