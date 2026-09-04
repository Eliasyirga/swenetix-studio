import React from 'react';
import { Music, Search, Plus, RotateCcw } from 'lucide-react';
import { Flex, Box } from './common/Flex';
import { Heading, Text } from './common/Text';
import { Button } from './Button';

export interface EmptyStateProps {
  isFiltered?: boolean;
  onAddSong?: () => void;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered = false,
  onAddSong,
  onClearFilters,
}) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
      px={4}
      bg="surface"
      borderRadius="lg"
      border="1px dashed"
      borderColor="surfaceBorder"
      textAlign="center"
    >
      <Box
        p={3}
        bg="rgba(59, 130, 246, 0.12)"
        borderRadius="md"
        color="primary"
        mb={3}
      >
        {isFiltered ? <Search size={28} /> : <Music size={28} />}
      </Box>

      <Heading as="h3" fontSize={3} fontWeight="bold" mb={2}>
        {isFiltered ? 'No songs match your current filters.' : 'No songs found.'}
      </Heading>

      <Text fontSize={1} color="textSecondary" maxWidth="400px" mb={4}>
        {isFiltered
          ? 'Try adjusting your keyword search or resetting genre, artist, or album filters.'
          : 'Start building your music library by adding your first song.'}
      </Text>

      <Flex gap={2}>
        {isFiltered ? (
          <Button variant="secondary" buttonSize="sm" onClick={onClearFilters}>
            <RotateCcw size={14} /> Clear Filters
          </Button>
        ) : (
          <Button variant="primary" buttonSize="sm" onClick={onAddSong}>
            <Plus size={14} /> + Add Song
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
