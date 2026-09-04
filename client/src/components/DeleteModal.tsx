import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Song } from '../types/song';
import { Modal } from './Modal';
import { Button } from './Button';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';

export interface DeleteModalProps {
  isOpen: boolean;
  song: Song | null;
  onClose: () => void;
  onConfirm: (songId: string) => void;
  isLoading?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  song,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!song) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete this song?"
      maxWidth="420px"
    >
      <Flex flexDirection="column" gap={3}>
        <Flex alignItems="center" gap={3}>
          <Box p={2} bg="rgba(239, 68, 68, 0.12)" borderRadius="md" color="danger">
            <AlertTriangle size={22} />
          </Box>
          <Box>
            <Text fontSize={1} fontWeight="semibold" color="text">
              "{song.title}" by {song.artist}
            </Text>
            <Text fontSize={0} color="textMuted" mt="2px">
              This action cannot be undone.
            </Text>
          </Box>
        </Flex>

        <Flex justifyContent="flex-end" gap={2} mt={3}>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm(song.id)}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
