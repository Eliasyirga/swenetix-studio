import React from 'react';
import styled from '@emotion/styled';
import { Edit2, Trash2, Disc, Clock } from 'lucide-react';
import { Song } from '../types/song';
import { Badge } from './Badge';
import { Button } from './Button';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 14px 16px;
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
  padding: 14px 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
`;

const Tr = styled.tr`
  transition: all 0.15s ease;
  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const TrackIconBox = styled(Box)`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export interface SongTableProps {
  songs: Song[];
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
}

export const SongTable: React.FC<SongTableProps> = ({
  songs,
  onEdit,
  onDelete,
}) => {
  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <Th style={{ width: '48px' }}>#</Th>
            <Th>Track / Title</Th>
            <Th>Artist</Th>
            <Th>Album</Th>
            <Th>Genre</Th>
            <Th style={{ width: '90px' }}>
              <Flex alignItems="center" gap={1}>
                <Clock size={13} /> Time
              </Flex>
            </Th>
            <Th style={{ textAlign: 'right', width: '110px' }}>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => {
            const formattedDuration = song.duration
              ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
              : '3:30';

            return (
              <Tr key={song.id}>
                <Td style={{ color: 'inherit', opacity: 0.6, fontFamily: 'monospace' }}>
                  {(index + 1).toString().padStart(2, '0')}
                </Td>
                <Td>
                  <Flex alignItems="center" gap={2}>
                    <TrackIconBox>
                      <Disc size={16} />
                    </TrackIconBox>
                    <Box>
                      <Text fontWeight="semibold" color="text">
                        {song.title}
                      </Text>
                      <Text fontSize={0} color="textSecondary">
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
                <Td style={{ fontFamily: 'monospace', opacity: 0.75, fontSize: '13px' }}>
                  {formattedDuration}
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  <Flex justifyContent="flex-end" alignItems="center" gap={1}>
                    <Button
                      variant="ghost"
                      buttonSize="sm"
                      onClick={() => onEdit(song)}
                      title="Edit Track"
                      style={{ padding: '6px 8px', borderRadius: '6px' }}
                    >
                      <Edit2 size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      buttonSize="sm"
                      onClick={() => onDelete(song)}
                      title="Delete Track"
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
